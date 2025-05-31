// src/hooks/useSupabaseAuth.ts

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuthStore } from "@/stores/authStore";

export function useSupabaseAuth() {
  const { login, logout } = useAuthStore.getState();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        const u = data.session.user;
        login({
          id: u.id,
          email: u.email ?? "",
          lastLogin: u.last_sign_in_at,
        });
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          login({
            id: session.user.id,
            email: session.user.email ?? "",
            lastLogin: session.user.last_sign_in_at,
          });
        } else {
          logout();
        }
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [login, logout]);
}
