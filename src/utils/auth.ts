import { supabase } from "@/lib/supabaseClient";
import { User } from "@/types/auth";
import { useAuthStore } from "@/stores/authStore";

export async function signIn(email: string, password: string): Promise<User> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error.message;
    }

    if (!data || !data.user || !data.user.id || !data.user.email) {
      throw "Invalid user data";
    }

    const res = {
      id: data.user.id,
      email: data.user.email,
      lastLogin: data.user.last_sign_in_at,
    };

    const login = useAuthStore.getState().login;
    login(res);
    return res;
  } catch (error) {
    throw error;
  }
}

export async function createAccount(
  email: string,
  password: string,
): Promise<User> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw error.message;
    }

    if (!data || !data.user || !data.user.id || !data.user.email) {
      throw "Invalid user data";
    }

    const res = {
      id: data.user.id,
      email: data.user.email,
      lastLogin: data.user.created_at,
    };

    const login = useAuthStore.getState().login;
    login(res);

    return res;
  } catch (error) {
    throw error;
  }
}

export async function signOut() {
  try {
    await supabase.auth.signOut();
    const logout = useAuthStore.getState().logout;
    logout();
  } catch (error) {
    throw error;
  }
}
