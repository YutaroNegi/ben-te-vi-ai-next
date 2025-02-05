"use client";

import React from "react";
import { signOut } from "@/utils/auth";
import { Button } from "@/components";

export default function DashbparPage() {
  async function handleSignOut() {
    try {
      console.log("signing out");
      await signOut();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <Button onClick={handleSignOut} label="Logout" />
    </div>
  );
}
