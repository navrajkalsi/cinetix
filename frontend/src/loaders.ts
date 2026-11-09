import type { LoaderFunctionArgs } from "react-router";
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
    filters: Omit<Filters, "movie" | "location" | "format">;
  }
  | {
    path: "booking";
    booking: Booking;
  }
  | {
    path: "movie";
    bookings: Booking[];
    filters: Omit<Filters, "movieId" | "year">; // no need to add year filter to movies
  }
  | {
    path: "location";
    bookings: Booking[];
    filters: Omit<Filters, "locationId">; // user might want to see per year bookings
  }
  | {
    path: "format";
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
  const bookings = await getBookings({
    year: filters.year ?? today.getFullYear(),
    includeFuture: filters.year ? false : true,
  });

  const data: BookingsData = { path: "bookings", bookings, filters };
  return data;
}

// single booking page loader
export async function bookingLoader({ params }: LoaderFunctionArgs) {
  const booking = await getBooking(parseId(params.id));
  const data: BookingData = { path: "booking", booking };
  return data;
}

// movie page loader
export async function movieLoader({ request, params }: LoaderFunctionArgs) {
  let filters: MovieData["filters"] = parseFilters(
    new URL(request.url).searchParams,
    MovieFilters,
  );
  // fetch based on filters
  const bookings = await getBookings({
    movieId: parseId(params.id),
    ...filters,
  });

  const data: MovieData = { path: "movie", bookings, filters };
  return data;
}

// location page loader
export async function locationLoader({ request, params }: LoaderFunctionArgs) {
  let filters: LocationData["filters"] = parseFilters(
    new URL(request.url).searchParams,
    LocationFilters,
  );
  // fetch based on filters
  const bookings = await getBookings({
    locationId: parseId(params.id),
    ...filters,
  });

  const data: LocationData = { path: "location", bookings, filters };
  return data;
}

// format page loader
export async function formatLoader({ request, params }: LoaderFunctionArgs) {
  let filters: FormatData["filters"] = parseFilters(
    new URL(request.url).searchParams,
    FormatFilters,
  );
  // fetch based on filters
  const bookings = await getBookings({
    formatId: parseId(params.id),
    ...filters,
  });

  const data: FormatData = { path: "format", bookings, filters };
  return data;
}

function parseId(id?: string): number {
  if (!id) throw new Response("No entity id found", { status: 404 });
  if (!/^\d+$/.test(id))
    throw new Response("Invalid entity id", { status: 404 });

  return Number(id);
}
