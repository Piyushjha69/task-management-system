const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";

export function setAccessToken(token: string) {
  localStorage.setItem(ACCESS_KEY, token);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY);
}

export function setRefreshToken(token: string) {
  localStorage.setItem(REFRESH_KEY, token);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}

export function logout() {
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(ACCESS_KEY);
  // Redirect to login page
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}
