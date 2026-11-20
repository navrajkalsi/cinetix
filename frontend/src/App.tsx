import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import BookingNew from "./pages/bookings/BookingNew";
import { LookupsProvider } from "./context/LookupProvider";
import BookingPage from "./pages/bookings/Booking";
import Details from "./layouts/DetailsLayout";
import FiltersLayout from "./layouts/SidebarLayout";
import Bookings from "./pages/bookings/Bookings";
import {
  bookingLoader,
  bookingsLoader,
  formatLoader,
  locationLoader,
  movieLoader,
  statsLoader,
} from "./loaders";
import Backdrop from "./components/Backdrop";
import Stats from "./components/Stats";

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
        path: "backdrop",
        Component: Backdrop,
      },

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

      { path: "stats", loader: statsLoader, Component: Stats },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
