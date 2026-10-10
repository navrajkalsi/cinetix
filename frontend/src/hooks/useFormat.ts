import type { Format } from "../models/Format";
import useLookupsContext from "./useLookupsContext";

export default function useFormat(id: number): Format {
  const { lookups } = useLookupsContext();
  const format = lookups.formats.get(id);

  if (!format) throw new Response("format id for a booking must exist");

  return format;
}
