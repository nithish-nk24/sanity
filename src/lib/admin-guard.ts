"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

type SessionLike = any;

function getRole(session: SessionLike): string | undefined {
  return session?.role || session?.user?.role;
}

export async function requireAdminOrRedirect(redirectTo: string = "/") {
  const session = await auth();
  const role = getRole(session);

  if (!session || role !== "admin") {
    redirect(redirectTo);
  }

  return session;
}

export async function requireAdminOr401(): Promise<{ ok: true; session: any } | { ok: false; response: NextResponse }> {
  const session = await auth();
  const role = getRole(session);

  if (!session) {
    return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (role !== "admin") {
    return { ok: false, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { ok: true, session };
}

