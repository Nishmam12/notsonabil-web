import { supabaseServer } from "@/lib/supabase-server";

type LogLevel = "debug" | "info" | "warn" | "error";

const log = (level: LogLevel, message: string, meta?: unknown) => {
  const payload = meta ? [message, meta] : [message];
  if (level === "debug") {
    console.debug(...payload);
  } else if (level === "info") {
    console.info(...payload);
  } else if (level === "warn") {
    console.warn(...payload);
  } else {
    console.error(...payload);
  }
};

export const logger = {
  debug: (message: string, meta?: unknown) => log("debug", message, meta),
  info: (message: string, meta?: unknown) => log("info", message, meta),
  warn: (message: string, meta?: unknown) => log("warn", message, meta),
  error: (message: string, meta?: unknown) => log("error", message, meta),
};

type ActivityAction = "create" | "update" | "delete";

export const logActivity = async (params: {
  userId: string | null;
  action: ActivityAction;
  entityType: string;
  entityId: string;
  ipAddress?: string | null;
}) => {
  const { userId, action, entityType, entityId, ipAddress } = params;
  const { error } = await supabaseServer.from("activity_logs").insert({
    user_id: userId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    ip_address: ipAddress ?? null,
  });
  if (error) {
    log("error", "Failed to insert activity log", error);
  }
};
