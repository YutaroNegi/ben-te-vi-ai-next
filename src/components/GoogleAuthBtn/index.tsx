"use client";

import { supabase } from "@/lib/supabaseClient";
import Script from "next/script";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GoogleAuthBtn() {
  const router = useRouter();

  useEffect(() => {
    (window as any).handleSignInWithGoogle = async (response: any) => {
      try {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: response.credential,
        });
        if (error) {
          console.error("Erro ao fazer login com Google:", error);
          return;
        }

        console.log("Login bem-sucedido:", data);
        router.push("/");
      } catch (err) {
        console.error("Erro inesperado:", err);
      }
    };
  }, [router]);

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" async defer />
      <div
        id="g_id_onload"
        data-client_id={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
        data-callback="handleSignInWithGoogle"
        data-use_fedcm_for_prompt="true"
        data-ux_mode="popup"
      ></div>
      <div
        className="g_id_signin"
        data-type="standard"
        data-shape="pill"
        data-theme="outline"
        data-text="signin_with"
        data-size="large"
        data-logo_alignment="left"
      ></div>
    </>
  );
}