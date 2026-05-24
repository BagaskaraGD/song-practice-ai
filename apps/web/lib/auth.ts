export const TOKEN_KEY = "songpractice_token";
export const USER_KEY = "songpractice_user";

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  initials: string;
  role: string;
  plan: string;
  credits: number;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function isLoggedIn(): boolean {
  return getToken() !== null;
}

export function login(token: string, user: StoredUser): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser(): StoredUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

/** @deprecated kept for backwards compat with useAuth lazy init */
export function getStoredEmail(): string {
  return getStoredUser()?.email ?? "";
}
