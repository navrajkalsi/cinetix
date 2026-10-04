import type Format from "../models/Format";

export default async function getFormat(id: number): Promise<Format> {
  const response = await fetch(`/api/formats/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch format: ${response.statusText}`);
  }

  return response.json();
}
