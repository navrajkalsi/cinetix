import type { Stats } from "@/models/Stats";

export async function getStats(
  year?: number,
  signal?: AbortSignal,
): Promise<Stats> {
  const response = await fetch(`/api/stats/?${year ? `year=${year}&` : ""}`, {
    signal,
  });

  if (!response.ok)
    throw new Error(`Failed to fetch stats: ${response.statusText}`);

  return response.json();
}
