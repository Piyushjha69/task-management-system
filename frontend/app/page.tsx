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
    <main className="min-h-screen bg-neutral-950">
      <div className="min-h-screen flex flex-col justify-between px-6 py-8">
        {/* Header */}
        <header className="flex justify-between items-center max-w-5xl mx-auto w-full">
          <span className="text-neutral-200 font-medium">taskflow</span>
          {!isLoggedIn && (
            <Link
              href="/login"
              className="text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              Sign in
            </Link>
          )}
        </header>

        {/* Hero */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-xl">
            <h1 className="text-4xl md:text-5xl font-semibold text-neutral-100 tracking-tight leading-tight">
              Manage tasks,
              <br />
              stay focused.
            </h1>
            <p className="mt-6 text-neutral-500 text-lg">
              A simple way to organize your work and track progress.
            </p>
            <div className="mt-10 flex gap-3 justify-center">
              {!isLoggedIn ? (
                <>
                  <Link
                    href="/register"
                    className="px-5 py-2.5 bg-neutral-100 text-neutral-900 text-sm font-medium rounded-lg hover:bg-white transition-colors"
                  >
                    Get started
                  </Link>
                  <Link
                    href="/login"
                    className="px-5 py-2.5 text-neutral-400 text-sm font-medium rounded-lg border border-neutral-800 hover:border-neutral-700 hover:text-neutral-300 transition-colors"
                  >
                    Sign in
                  </Link>
                </>
              ) : (
                <Link
                  href="/tasks"
                  className="px-5 py-2.5 bg-neutral-100 text-neutral-900 text-sm font-medium rounded-lg hover:bg-white transition-colors"
                >
                  Go to dashboard
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-neutral-600 text-xs">
          Built with Next.js & TypeScript
        </footer>
      </div>
    </main>
  );
}
