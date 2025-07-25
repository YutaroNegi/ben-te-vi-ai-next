"use client";

import Script from "next/script";
import { supabase } from "@/lib/supabaseClient";
import { CredentialResponse } from "google-one-tap";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize(config: import("google-one-tap").IdConfiguration): void;
          prompt(): void;
        };
      };
    };
  }
}

const OneTapComponent = () => {
  const router = useRouter();

  // generate nonce to use for google id token sign-in
  const generateNonce = async (): Promise<string[]> => {
    const nonce = btoa(
      String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))),
    );
    const encoder = new TextEncoder();
    const encodedNonce = encoder.encode(nonce);
    const hashBuffer = await crypto.subtle.digest("SHA-256", encodedNonce);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedNonce = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return [nonce, hashedNonce];
  };

  useEffect(() => {
    const initializeGoogleOneTap = () => {
      window.addEventListener("load", async () => {
        const [nonce, hashedNonce] = await generateNonce();

        // check if there's already an existing session before initializing the one-tap UI
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting session", error);
        }
        if (data.session) {
          router.push("/");
          return;
        }

        window.google?.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
          callback: async (response: CredentialResponse) => {
            try {
              // send id token returned in response.credential to supabase
              const { data, error } = await supabase.auth.signInWithIdToken({
                provider: "google",
                token: response.credential,
                nonce,
              });

              if (error) throw error;

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
              console.error("Error logging in with Google One Tap", error);
            }
          },
          nonce: hashedNonce,
          // with chrome's removal of third-party cookiesm, we need to use FedCM instead (https://developers.google.com/identity/gsi/web/guides/fedcm-migration)
          use_fedcm_for_prompt: true,
        });
        window.google?.accounts.id.prompt(); // Display the One Tap UI
      });
    };
    initializeGoogleOneTap();
    return () => window.removeEventListener("load", initializeGoogleOneTap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" />
      <div id="oneTap" className="fixed top-0 right-0 z-[100]" />
    </>
  );
};

export default OneTapComponent;
