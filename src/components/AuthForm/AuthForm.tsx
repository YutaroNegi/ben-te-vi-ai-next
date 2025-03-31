"use client";

import { useState } from "react";
import { Button, Input } from "@/components";
import { signIn, createAccount } from "@/utils/auth";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [isloading, setIsLoading] = useState(false);
  const t = useTranslations("AuthPage");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (isLogin) {
      try {
        await signIn(email, password);
        toast.success(t("loginSuccess"));
        return;
      } catch {
        toast.error(t("loginFailed"));
        return;
      } finally {
        setIsLoading(false);
      }
    }

    const confirmPassword = formData.get("confirmPassword") as string;
    if (password !== confirmPassword) {
      toast.error(t("passwordsDontMatch"));
      setIsLoading(false);
      return;
    }

    await createAccount(email, password);
    toast.success(t("accountCreated"));
    setIsLoading(false);
  };

  return (
    <>
      <main className="min-h-screen flex flex-col md:flex-row">
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <h1 className="mb-4 text-[36px] font-extrabold">
            {isLogin ? t("login") : t("createAccount")}
          </h1>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-4 w-full max-w-md"
          >
            <Input
              id="email"
              name="email"
              label={t("email")}
              type="email"
              placeholder={t("email")}
              labelClassName="bg-bentevi-light"
              labelTextClassName="text-chocolate-900"
            />
            <Input
              id="password"
              name="password"
              label={t("password")}
              type="password"
              placeholder={t("password")}
              labelClassName="bg-bentevi-light"
              labelTextClassName="text-chocolate-900"
            />

            {!isLogin && (
              <Input
                id="confirmPassword"
                name="confirmPassword"
                label={t("confirmPassword")}
                type="password"
                labelClassName="bg-bentevi-light"
                labelTextClassName="text-chocolate-900"
                placeholder={t("confirmPassword")}
              />
            )}

            <Button
              label={isLogin ? t("submitLogin") : t("submitCreateAccount")}
              type="submit"
              loading={isloading}
              className="bg-bentenavi-dark text-[14px]"
            />
          </form>

          <div className="mt-4">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="hover:underline"
            >
              {isLogin ? t("toggleToCreate") : t("toggleToLogin")}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
