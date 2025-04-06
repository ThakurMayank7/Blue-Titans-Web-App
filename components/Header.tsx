"use client";

import { useAuth } from "@/hooks/useAuth";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import Image from "next/image";
import { signOutUser } from "@/firebase/auth";
import { useRouter } from "next/navigation";

function Header() {
  const router = useRouter();

  const { user } = useAuth();

  return (
    <header className="sticky top-0 left-0 right-0 z-50 backdrop-blur-sm">
      <div className="absolute inset-0 bg-amber-600 opacity-60"></div>

      <div className="relative container mx-auto px-4 flex items-center justify-between">
        <h1
          className="text-center text-5xl py-2 text-amber-950 font-black hover:cursor-pointer"
          onClick={() => {
            router.push("/");
          }}
        >
          Blue Titans
        </h1>
        {user && (
          <Popover>
            <PopoverTrigger asChild>
              <button className="focus:outline-none border-2 border-amber-800 rounded-full p-1 hover:bg-amber-700 transition duration-300 ease-in-out cursor-pointer">
                {user.photoURL ? (
                  <div className="relative h-8 w-8 rounded-full overflow-hidden">
                    <Image
                      src={user.photoURL}
                      alt="User avatar"
                      className="object-cover"
                      width={32}
                      height={32}
                    />
                  </div>
                ) : (
                  <div className="h-8 w-8 rounded-full bg-amber-800 flex items-center justify-center text-white">
                    {user.displayName
                      ? user.displayName.charAt(0).toUpperCase()
                      : user.email
                      ? user.email.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-fit" align="end">
              <div className="space-y-2">
                <div className="font-medium">{user.displayName || "User"}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
                {user.emailVerified && (
                  <div className="text-xs text-green-600">Email verified</div>
                )}
                <div className="border-t pt-2 mt-2">
                  <button
                    className="text-sm text-red-500 hover:text-red-700 cursor-pointer border rounded p-1 hover:bg-red-50 hover:border-red-700 border-red-500"
                    onClick={() => signOutUser()}
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </header>
  );
}

export default Header;
