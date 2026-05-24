"use client";

import { useState, useCallback } from "react";
import { isLoggedIn, login as authLogin, logout as authLogout, getStoredUser, type StoredUser } from "@/lib/auth";

export function useAuth() {
  const [authed, setAuthed] = useState(() => isLoggedIn());
  const [user, setUser] = useState<StoredUser | null>(() => getStoredUser());

  const login = useCallback((token: string, userData: StoredUser) => {
    authLogin(token, userData);
    setAuthed(true);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    authLogout();
    setAuthed(false);
    setUser(null);
  }, []);

  return { authed, user, login, logout };
}
