import { type Format } from "../models/Format";

export default async function getFormat(
  id: number,
  signal?: AbortSignal,
): Promise<Format> {
  const response = await fetch(`/api/formats/${id}`, { signal });

  if (!response.ok) {
    throw new Error(`Failed to fetch format: ${response.statusText}`);
  }

  return response.json();
}

export async function getFormats(signal?: AbortSignal): Promise<Format[]> {
  const response = await fetch(`/api/formats/`, { signal });

  if (!response.ok) {
    throw new Error(`Failed to fetch formats: ${response.statusText}`);
  }

  return response.json();
}
