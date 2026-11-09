import type { Database } from "@/integrations/supabase/types";

export type ReservationStatus = Database["public"]["Enums"]["reservation_status"];
export type TableCategory = Database["public"]["Enums"]["table_category"];
export type TableStatus = Database["public"]["Enums"]["table_status"];

/** Statuses that hold a table (block availability). */
export const ACTIVE_STATUSES: ReservationStatus[] = ["pending", "confirmed", "seated"];

export const STAFF_ROLES = ["admin", "manager", "staff"];

export const STATUS_LABEL: Record<ReservationStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  seated: "Seated",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No show",
};

export const STATUS_BADGE: Record<ReservationStatus, string> = {
  pending: "bg-status-reserved/20 text-status-reserved border-status-reserved/40",
  confirmed: "bg-status-available/20 text-status-available border-status-available/40",
  seated: "bg-primary/15 text-primary border-primary/30",
  completed: "bg-muted text-muted-foreground border-border",
  cancelled: "bg-destructive/10 text-destructive border-destructive/30",
  no_show: "bg-status-maintenance/20 text-status-maintenance border-status-maintenance/40",
};

export const CATEGORY_LABEL: Record<TableCategory, string> = {
  standard: "Standard",
  window: "Window",
  vip: "VIP",
  family: "Family",
  outdoor: "Outdoor",
};

export const TABLE_STATUS_LABEL: Record<TableStatus, string> = {
  available: "Available",
  reserved: "Reserved",
  occupied: "Occupied",
  cleaning: "Cleaning",
  maintenance: "Maintenance",
};

/** Dinner seating times offered by the restaurant. */
export const SEATING_SLOTS = ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"] as const;
export const DEFAULT_DURATION_HOURS = 2;

export type TableLike = {
  id: string;
  label: string;
  category: TableCategory;
  capacity: number;
  status: TableStatus;
};

export type BusyBooking = { table_id: string | null; starts_at: string; ends_at: string };

export function slotToDate(dateStr: string, slot: string): Date {
  return new Date(`${dateStr}T${slot}:00`);
}

export function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

export function isOverlapping(startA: Date, endA: Date, startB: Date, endB: Date): boolean {
  return startA < endB && startB < endA;
}

export function tableIsBusy(tableId: string, busy: BusyBooking[], start: Date, end: Date): boolean {
  return busy.some(
    (b) => b.table_id === tableId && isOverlapping(start, end, new Date(b.starts_at), new Date(b.ends_at))
  );
}

export function filterAvailableTables(
  tables: TableLike[],
  busy: BusyBooking[],
  start: Date,
  end: Date,
  partySize: number,
  category?: TableCategory | null
): TableLike[] {
  return tables.filter(
    (t) =>
      t.status !== "maintenance" &&
      t.capacity >= partySize &&
      (!category || t.category === category) &&
      !tableIsBusy(t.id, busy, start, end)
  );
}

/** Local datetime-local input value for a Date, minute precision. */
export function toLocalInputValue(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** yyyy-MM-dd for date inputs, in local time. */
export function toDateInputValue(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
