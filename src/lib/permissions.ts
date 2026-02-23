import { createClient } from "./supabase/server";

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "CONTRIBUTOR";

export type AuthSession = {
  userId: string;
  role: UserRole;
  email?: string;
};

const ADMIN_EMAIL = "notsonabil@gmail.com";

export async function getAuthSession(): Promise<AuthSession | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const normalizedEmail = user.email?.toLowerCase().trim();
  const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("email", normalizedEmail)
    .single();

  if (error || !data) {
    console.error(`[Permissions] Failed to fetch role for ${normalizedEmail}`, error);
    return null;
  }

  return {
    userId: user.id,
    role: data.role as UserRole,
    email: normalizedEmail,
  };
}

export async function requireRole(
  allowed: UserRole[]
): Promise<AuthSession | null> {
  const session = await getAuthSession();
  if (!session) {
    return null;
  }

  const normalizedSessionEmail = session.email?.toLowerCase().trim();
  const normalizedAdminEmail = ADMIN_EMAIL.toLowerCase().trim();

  // Strict check for SUPER_ADMIN if email matches nabil's
  if (normalizedSessionEmail === normalizedAdminEmail && session.role !== "SUPER_ADMIN") {
    return null;
  }

  if (!allowed.includes(session.role)) {
    return null;
  }
  return session;
}

export async function requireAdmin(): Promise<boolean> {
  const session = await getAuthSession();
  if (!session) return false;

  if (session.email === ADMIN_EMAIL && session.role === "SUPER_ADMIN") {
    return true;
  }

  return ["SUPER_ADMIN", "ADMIN"].includes(session.role);
}
