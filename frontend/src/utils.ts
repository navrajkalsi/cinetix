import { format, parse, parseISO } from "date-fns";
import { toast } from "./components/ui/toast";
import { err, ok } from "./types";

export async function resolve<S, const R extends string>(
  promise: Promise<S>,
  reason: R,
) {
  try {
    return ok(await promise);
  } catch (e) {
    return err({ reason: reason, details: e });
  }
}

export function showErrorToast(error: string) {
  toast.add({ description: error, type: "error", priority: "high" });
}

export function parseDate(date: string) {
  return format(parseISO(date), "E MMM d, y");
}

export function parseTime(time: string) {
  return format(parse(time, "HH:mm:ss", new Date()), "h:mm a");
}
