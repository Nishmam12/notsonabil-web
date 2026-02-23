import { cookies } from "next/headers";
import AdminLayout from "@/components/admin/AdminLayout";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { UserRole } from "@/lib/permissions";

type ActivityLogRow = {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string;
  ip_address: string | null;
  created_at: string;
};

const ACCESS_TOKEN_COOKIE = "sb_access_token";
const USER_ROLE_COOKIE = "sb_user_role";

const formatDateTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString();
};

export default async function AdminLogsPage() {
  const store = await cookies();
  const token = store.get(ACCESS_TOKEN_COOKIE)?.value ?? "";
  const role = store.get(USER_ROLE_COOKIE)?.value as UserRole | undefined;

  if (!token || !role || (role !== "SUPER_ADMIN" && role !== "ADMIN")) {
    return null;
  }

  const supabase = createSupabaseServerClient(token);
  const { data, error } = await supabase
    .from("activity_logs")
    .select(
      "id, user_id, action, entity_type, entity_id, ip_address, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  const logs: ActivityLogRow[] = data ?? [];

  return (
    <AdminLayout
      title="Activity logs"
      description="Audit trail of recent actions across the admin dashboard."
    >
      <div className="rounded-3xl border border-neutral-200 bg-white px-6 py-6 text-xs text-neutral-700 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
        {error ? (
          <div className="text-red-600 dark:text-red-400">
            Failed to load activity logs.
          </div>
        ) : logs.length === 0 ? (
          <div className="text-neutral-500 dark:text-neutral-400">
            No activity has been recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-200 text-[11px] uppercase tracking-wide text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                  <th className="px-2 py-2 text-left">Time</th>
                  <th className="px-2 py-2 text-left">User</th>
                  <th className="px-2 py-2 text-left">Action</th>
                  <th className="px-2 py-2 text-left">Entity</th>
                  <th className="px-2 py-2 text-left">ID</th>
                  <th className="px-2 py-2 text-left">IP</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-neutral-100 last:border-b-0 dark:border-neutral-800/60"
                  >
                    <td className="whitespace-nowrap px-2 py-2 align-top">
                      {formatDateTime(log.created_at)}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 align-top">
                      {log.user_id ?? "Unknown"}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 align-top">
                      {log.action}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 align-top">
                      {log.entity_type}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 align-top">
                      {log.entity_id}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 align-top">
                      {log.ip_address ?? "–"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
