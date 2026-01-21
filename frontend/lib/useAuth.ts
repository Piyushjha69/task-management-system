"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getAccessToken } from "./auth";

const PUBLIC_ROUTES = ["/login", "/register"];

export function useAuth(requireAuth: boolean = true) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    const hasToken = !!token;

    setIsAuthenticated(hasToken);

    if (requireAuth && !hasToken) {
      // User needs to be authenticated but isn't
      router.replace("/login");
    } else if (!requireAuth && hasToken && PUBLIC_ROUTES.includes(pathname)) {
      // User is authenticated but on a public route (login/register)
      router.replace("/tasks");
    } else {
      setIsLoading(false);
    }
  }, [requireAuth, router, pathname]);

  return { isLoading, isAuthenticated };
}
