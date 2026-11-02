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

export function shuffle<T>(arr: T[]): T[] {
  const indices = Array.from(Array(arr.length).keys());

  // active view in the indices array to pick the next index from
  let viewLen = arr.length;
  const ret: T[] = [];

  while (viewLen > 0) {
    // index of the number to target in indices
    // that number will then be the index to remove from arr
    const indicesIndex = Math.floor(Math.random() * viewLen);

    // index to remove from arr
    const arrIndex = indices[indicesIndex];

    ret.push(arr[arrIndex]);

    indices[indicesIndex] = indices[--viewLen];
    indices[viewLen] = arrIndex;
  }

  return ret;
}
