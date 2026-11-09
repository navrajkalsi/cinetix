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
          },
          {
            path: "new",
            Component: BookingNew,
          },
          {
            path: ":id",
            loader: bookingLoader,
            Component: BookingPage,
          },
        ],
      },

      {
        path: "movies/:id",
        loader: movieLoader,
        Component: Details,
      },

      {
        path: "locations/:id",
        loader: locationLoader,
        Component: Details,
      },

      {
        path: "formats/:id",
        loader: formatLoader,
        Component: Details,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
