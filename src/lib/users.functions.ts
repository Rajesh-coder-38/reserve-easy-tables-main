import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { STAFF_ROLES } from "@/lib/booking";

export type ManagedUser = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
  reservations: number;
};

/**
 * Staff-only directory of registered guests. Verifies the caller's role through
 * the user_roles own-read policy (RLS) before touching the admin client.
 */
export const listManagedUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ManagedUser[]> => {
    const { data: roles } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    const isStaff = (roles ?? []).some((r) => STAFF_ROLES.includes(r.role as string));
    if (!isStaff) throw new Error("Only staff can view the user directory.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [profilesRes, usersRes, reservationsRes] = await Promise.all([
      supabaseAdmin.from("profiles").select("id,full_name,phone,created_at").order("created_at", { ascending: false }),
      supabaseAdmin.auth.admin.listUsers({ perPage: 500, page: 1 }),
      supabaseAdmin.from("reservations").select("customer_id"),
    ]);

    const emailById = new Map<string, string>();
    for (const u of usersRes.data?.users ?? []) emailById.set(u.id, u.email ?? "");
    const counts = new Map<string, number>();
    for (const r of reservationsRes.data ?? []) counts.set(r.customer_id, (counts.get(r.customer_id) ?? 0) + 1);

    return (profilesRes.data ?? []).map((p) => ({
      id: p.id,
      full_name: p.full_name,
      email: emailById.get(p.id) || null,
      phone: p.phone,
      created_at: p.created_at,
      reservations: counts.get(p.id) ?? 0,
    }));
  });
