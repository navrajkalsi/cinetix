import { useMatches, type LoaderFunctionArgs } from "react-router";
import {
  BookingsFilters,
  FormatFilters,
  LocationFilters,
  MovieFilters,
  parseFilters,
  type Filters,
} from "./filters";
import { getBooking, getBookings } from "./api/bookings";
import type { Booking } from "./models/Booking";
import type { BookingsData } from "./pages/bookings/Bookings";
import type { BookingData } from "./pages/bookings/Booking";
import type { FormatData, LocationData, MovieData } from "./layouts/Details";

export type LoaderData =
  | {
    path: "bookings";
    bookings: Booking[];
    filters: Omit<Filters, "movieId">;
    // do the bookings also contain bookings for following years
    // this will be only true for current year
    future: boolean;
  }
  | {
    path: "booking";
    booking: Booking;
    filters: null;
  }
  | {
    path: "movie";
    id: number;
    bookings: Booking[];
    filters: Omit<Filters, "movieId" | "year">; // no need to add year filter to movies
  }
  | {
    path: "location";
    id: number;
    bookings: Booking[];
    filters: Omit<Filters, "locationId">; // user might want to see per year bookings
  }
  | {
    path: "format";
    id: number;
    bookings: Booking[];
    filters: Omit<Filters, "formatId">; // user might want to see per year bookings
  };

// bookings list route loader
export async function bookingsLoader({ request }: LoaderFunctionArgs) {
  const today = new Date();

  let filters = parseFilters(
    new URL(request.url).searchParams,
    BookingsFilters,
  );

  // if no year is requested, show future bookings with current year
  // no future bookings are shown if the year is requested specifically
  const future = filters.year ? false : true;

  const bookings = await getBookings({
    ...filters,
    includeFuture: future,
    year: filters.year ?? today.getFullYear(),
  });

  const data: BookingsData = {
    path: "bookings",
    bookings,
    filters,
    future,
  };
  return data;
}

// single booking page loader
export async function bookingLoader({ params }: LoaderFunctionArgs) {
  const booking = await getBooking(parseId(params.id));
  const data: BookingData = { path: "booking", booking, filters: null };
  return data;
}

// movie page loader
export async function movieLoader({ request, params }: LoaderFunctionArgs) {
  let filters: MovieData["filters"] = parseFilters(
    new URL(request.url).searchParams,
    MovieFilters,
  );
  const id = parseId(params.id);
  const bookings = await getBookings({ movieId: id, ...filters }); // fetch based on filters

  const data: MovieData = { path: "movie", id, bookings, filters };
  return data;
}

// location page loader
export async function locationLoader({ request, params }: LoaderFunctionArgs) {
  let filters: LocationData["filters"] = parseFilters(
    new URL(request.url).searchParams,
    LocationFilters,
  );
  const id = parseId(params.id);
  const bookings = await getBookings({ locationId: id, ...filters }); // fetch based on filters

  const data: LocationData = {
    path: "location",
    id,
    bookings,
    filters,
  };
  return data;
}

// format page loader
export async function formatLoader({ request, params }: LoaderFunctionArgs) {
  let filters: FormatData["filters"] = parseFilters(
    new URL(request.url).searchParams,
    FormatFilters,
  );
  const id = parseId(params.id);
  const bookings = await getBookings({ formatId: id, ...filters }); // fetch based on filters

  const data: FormatData = { path: "format", id, bookings, filters };
  return data;
}

function parseId(id?: string): number {
  if (!id) throw new Response("No entity id found", { status: 404 });
  if (!/^\d+$/.test(id))
    throw new Response("Invalid entity id", { status: 404 });

  return Number(id);
}

export function useLoaderFilters(): LoaderData["filters"] {
  const match = useMatches().at(-1);
  if (!match || !match.loaderData) return null; // some pages may not have loader data

  const data = match.loaderData as LoaderData;
  return data.filters;
}
