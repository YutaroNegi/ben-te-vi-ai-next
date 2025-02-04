import { supabase } from "@/lib/supabaseClient";
import { User } from "@/types/auth";

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

    let res = {
      id: data.user.id,
      email: data.user.email,
    };

    return res;
  } catch (error) {
    throw error;
  }
}

export async function createAccount(email: string, password: string): Promise<User> {
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

    let res = {
      id: data.user.id,
      email: data.user.email,
    };

    return res;
  } catch (error) {
    throw error;
  }
}