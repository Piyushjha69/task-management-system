import { getAccessToken, setAccessToken, getRefreshToken, logout } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is missing in .env.local");
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  try {
    const token = getAccessToken();

    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
      credentials: "include",
    });

    // refresh if access expired
    if (res.status === 401) {
      // Only attempt refresh if we had a token (user was logged in)
      if (!token) {
        // No token means user isn't logged in, redirect to login
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        throw new Error("Please login to continue.");
      }

      const refreshed = await refreshAccessToken();
      if (!refreshed) {
        logout();
        throw new Error("Session expired. Please login again.");
      }

      const newToken = getAccessToken();
      return fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(newToken ? { Authorization: `Bearer ${newToken}` } : {}),
          ...(options.headers || {}),
        },
        credentials: "include",
      });
    }

    return res;
  } catch (err) {
    throw new Error("Failed to fetch (Backend not reachable / CORS issue)");
  }
}

async function refreshAccessToken() {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;

    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
      credentials: "include",
    });

    if (!res.ok) return false;

    const data = await res.json();
    if (data.success && data.data) {
      setAccessToken(data.data.accessToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
