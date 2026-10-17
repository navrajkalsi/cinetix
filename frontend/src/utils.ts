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
