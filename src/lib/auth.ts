"use server";

import { auth, signIn, signOut } from "@/auth";
import { UserSession } from "./types";

export const login = async (userId: string, password: string) => {
  if (userId == "cyfotokTeam" && password == "Cyfotok/24") {
    await signIn("github", { redirectTo: "/admin/dashboard" });
  } else {
    return false;
  }
};

export const logout = async () => {
  return await signOut({ redirectTo: "/admin" });
};

export const authSession = async (): Promise<UserSession | null> => {
  try {
    const session = await auth();
    return session as UserSession | null;
  } catch (error) {
    console.error("Failed to authenticate session", error);
    return null;
  }
};
