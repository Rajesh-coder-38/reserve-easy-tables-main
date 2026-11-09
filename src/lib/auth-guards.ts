import { redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { STAFF_ROLES } from "@/lib/booking";

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

/** Roles of the signed-in user, read through the user_roles own-read policy. */
export async function getMyRoles(userId: string): Promise<string[]> {
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  return (data ?? []).map((r) => r.role as string);
}

export async function isStaffUser(userId: string): Promise<boolean> {
  const roles = await getMyRoles(userId);
  return roles.some((r) => STAFF_ROLES.includes(r));
}

/** beforeLoad guard for staff/admin routes. Redirects guests to their reservations. */
export async function requireStaffRoute() {
  const user = await getCurrentUser();
  if (!user) throw redirect({ to: "/auth" });
  if (!(await isStaffUser(user.id))) throw redirect({ to: "/my-reservations" });
  return { user };
}

/** beforeLoad guard for signed-in pages (guest or staff). */
export async function requireUserRoute() {
  const user = await getCurrentUser();
  if (!user) throw redirect({ to: "/auth" });
  return { user };
}
