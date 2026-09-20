import type Format from "../models/Format";

export async function getFormats(): Promise<Format[]> {
  const response = await fetch("/api/formats");

  if (!response.ok) {
    throw new Error(`Failed to fetch formats: ${response.statusText}`);
  }

  return response.json();
}
