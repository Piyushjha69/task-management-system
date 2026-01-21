"use client";
import { getAccessToken } from "@/lib/auth";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function HomePage() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const getToken = getAccessToken();
    if (getToken) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8 text-center">
        <h1 className="text-4xl font-bold mb-3 text-black">Task Management App </h1>
        <p className="text-gray-600 mb-8">
          Manage your tasks easily with secure authentication, filtering,
          searching, and status tracking.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {
            !isLoggedIn ? (
              <div>
                <Link
                  href="/login"
                  className="px-6 py-3 rounded-xl bg-black text-white font-medium hover:opacity-90"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="px-6 py-3 rounded-xl border border-gray-300 font-medium hover:bg-gray-100 text-black ml-4"
                >
                  Register
                </Link>
              </div>
            ) :
              (

                <Link
                  href="/tasks"
                  className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:opacity-90"
                >
                  Go to Dashboard
                </Link>
              )
          }
        </div>

        <div className="mt-10 text-sm text-gray-500">
          <p>Built with Next.js + TypeScript + Prisma + JWT </p>
        </div>
      </div>
    </main>
  );
}
