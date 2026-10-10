import { useContext } from "react";
import {
  LookupsContext,
  type LookupsContextState,
} from "../context/LookupContext";

export default function useLookupsContext(): LookupsContextState {
  const ctx = useContext(LookupsContext);

  if (!ctx) throw new Response("context must be used within a provider");

  return ctx;
}
