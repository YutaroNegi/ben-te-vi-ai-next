import { describe, it, expect, vi, beforeEach } from "vitest";
import { signIn } from "./auth";
import { supabase } from "@/lib/supabaseClient";
import type { Mock } from "vitest";

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
    },
  },
}));

describe("signIn", () => {
  const email = "test@example.com";
  const password = "password123";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return user data when authentication is successful", async () => {
    const user = { id: "user-id", email };
    (supabase.auth.signInWithPassword as Mock).mockResolvedValue({
      data: { user },
      error: null,
    });

    const result = await signIn(email, password);

    expect(result).toEqual(user);
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({ email, password });
  });

  it("should throw an error when supabase returns an error", async () => {
    const errorMsg = "Invalid credentials";
    (supabase.auth.signInWithPassword as Mock).mockResolvedValue({
      data: null,
      error: { message: errorMsg },
    });

    await expect(signIn(email, password)).rejects.toEqual(errorMsg);
  });

  it("should throw an error when user data is invalid", async () => {
    (supabase.auth.signInWithPassword as Mock).mockResolvedValue({
      data: {},
      error: null,
    });

    await expect(signIn(email, password)).rejects.toEqual("Invalid user data");
  });
});