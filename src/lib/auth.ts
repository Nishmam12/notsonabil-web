import { createClient } from "./supabase/server";

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "CONTRIBUTOR";

export const ADMIN_EMAIL = "notsonabil@gmail.com";

export async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getUserRole(email: string): Promise<UserRole | null> {
  const supabase = await createClient();
  const normalizedEmail = email.toLowerCase().trim();
  const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("email", normalizedEmail)
    .single();

  if (error || !data) {
    console.error(`[Auth] Failed to fetch role for ${normalizedEmail}`, error);
    return null;
  }

  return data.role as UserRole;
}

export async function isAdminAuthenticated() {
  const user = await getAuthUser();
  if (!user || !user.email) return false;

  const normalizedUserEmail = user.email.toLowerCase().trim();
  const normalizedAdminEmail = ADMIN_EMAIL.toLowerCase().trim();

  if (normalizedUserEmail !== normalizedAdminEmail) {
    return false;
  }

  const role = await getUserRole(normalizedUserEmail);
  return role === "SUPER_ADMIN";
}
