"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { Pluggy, Header, Button } from "@/components";
import { SiNubank } from "react-icons/si";
import { FaPlus } from "react-icons/fa";

export default function ConnectPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [show, setShow] = useState(false);

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center h-screen">
          <p className="text-lg text-gray-500">
            <Link href="/" className="text-blue-500 underline">
              log in
            </Link>{" "}
            to connect your account.
          </p>
        </div>
      </>
    );
  }

  const addNuIcon = (
    <div className="flex items-center justify-center">
      <FaPlus className="text-white text-xl" />
      <SiNubank className="text-white text-xl ml-2" />
    </div>
  );

  return (
    <>
      <Header />

      <div className="flex justify-end mt-0">
        <Button
          onClick={() => setShow(!show)}
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow w-[100px] h-[40px]"
          label={addNuIcon}
        />
      </div>

      <Pluggy show={show} />
    </>
  );
}
