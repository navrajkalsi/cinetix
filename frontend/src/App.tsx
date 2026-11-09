import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import BookingNew from "./pages/bookings/BookingNew";
import { LookupsProvider } from "./context/LookupProvider";
import BookingPage from "./pages/bookings/Booking";
import Details from "./layouts/Details";
import FiltersLayout from "./layouts/FilterLayout";
import Bookings from "./pages/bookings/Bookings";
import {
  bookingLoader,
  bookingsLoader,
  formatLoader,
  locationLoader,
  movieLoader,
} from "./loaders";
import {
  BookingsFilters,
  BookingFilters,
  BookingNewFilters,
  FormatFilters,
  LocationFilters,
  MovieFilters,
} from "./filters";

export type Page = "bookings" | "movie" | "location" | "format";

const router = createBrowserRouter([
  {
    // provide the child routes filters and lookups
    path: "/",
    element: (
      <LookupsProvider>
        <FiltersLayout />
      </LookupsProvider>
    ),
    children: [
      // redirect root to bookings
      { index: true, element: <Navigate replace to="/bookings" /> },

      {
        path: "bookings",
        children: [
          {
            index: true,
            loader: bookingsLoader,
            Component: Bookings,
            handle: BookingsFilters,
          },
          {
            path: "new",
            Component: BookingNew,
            handle: BookingNewFilters,
          },
          {
            path: ":id",
            loader: bookingLoader,
            Component: BookingPage,
            handle: BookingFilters,
          },
        ],
      },

      {
        path: "movie/:id",
        loader: movieLoader,
        Component: Details,
        handle: MovieFilters,
      },

      {
        path: "location/:id",
        loader: locationLoader,
        Component: Details,
        handle: LocationFilters,
      },

      {
        path: "format/:id",
        loader: formatLoader,
        Component: Details,
        handle: FormatFilters,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
