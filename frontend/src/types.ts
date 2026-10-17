export type AppError = { reason: string; details?: unknown };

// taken from: https://www.youtube.com/watch?v=ovnyeq-Xxrc
export type Result<S, E extends { reason: string }> = [E, null] | [null, S];

export function ok<S>(data: S): Result<S, never> {
  return [null, data];
}

// const R gives us type safety on reason strings
export function err<const R extends string, E extends { reason: R }>(
  error: E,
): Result<never, E> {
  return [error, null];
}
