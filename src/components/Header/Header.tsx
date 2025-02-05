import React from 'react';
import { signOut } from '@/utils/auth';

function Header() {
  async function handleSignOut() {
    try {
      await signOut();
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <header className="flex items-center justify-between p-4 shadow-md bg-matcha-900">
      <img src="/ben-te-vi-logo.png" alt="Logo do App" className="h-10" />
      <button
        onClick={handleSignOut}
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
      >
        <img src="/logout.svg" alt="Logout" className="h-6 w-6" />
      </button>
    </header>
  );
}

export default Header;