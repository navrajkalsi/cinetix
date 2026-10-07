import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import Bookings from "./pages/bookings/Bookings";
import getBookings from "./api/booking";
import getMovie from "./api/movie";
import getLocation from "./api/location";
import Movie from "./pages/movies/Movie";
import Location from "./pages/locations/Location";
import getFormat from "./api/format";
import Format from "./pages/formats/Format";
import BookingNew from "./pages/bookings/BookingNew";

const router = createBrowserRouter([
  // redirect root to bookings
  { index: true, element: <Navigate replace to="/bookings" /> },

  {
    // get OPTIONAL year from query params
    path: "/bookings",
    children: [
      {
        path: "new",
        Component: BookingNew,
      },

      {
        index: true,
        loader: async ({ request }) => {
          const url = new URL(request.url);
          const year = url.searchParams.get("year");

          // verify if year is a number, if not null
          if (year && !/^\d{4}$/.test(year)) {
            throw new Response("Invalid year", { status: 404 });
          }

          const yearNum = year ? Number(year) : new Date().getFullYear();
          const bookings = await getBookings({
            year: yearNum,
            includeFuture: year ? false : true,
          });

          return { yearNum, bookings };
        },
        Component: Bookings,
      },
    ],
  },

  {
    // get movie id from path segment (route param)
    path: "/movies/:id",
    loader: async ({ params }) => {
      const { id } = params;

      // no name provided
      if (!id) {
        throw new Response("No movie id provided", { status: 404 });
      }

      if (!/^\d+$/.test(id)) {
        throw new Response("Provided movie id is not a number", {
          status: 404,
        });
      }

      const movieId = Number(id);
      const movie = await getMovie(movieId);
      const bookings = await getBookings({ movieId: movieId });

      return { movie, bookings };
    },
    Component: Movie,
  },

  {
    // get location id from path segment (route param)
    path: "/locations/:id",
    loader: async ({ params }) => {
      const { id } = params;

      // no name provided
      if (!id) {
        throw new Response("No movie id provided", { status: 404 });
      }

      if (!/^\d+$/.test(id)) {
        throw new Response("Provided location id is not a number", {
          status: 404,
        });
      }

      const locationId = Number(id);
      const location = await getLocation(locationId);
      const bookings = await getBookings({ locationId: locationId });

      return { location, bookings };
    },
    Component: Location,
  },

  {
    // get format id from path segment (route param)
    path: "/formats/:id",
    loader: async ({ params }) => {
      const { id } = params;

      // no name provided
      if (!id) {
        throw new Response("No movie id provided", { status: 404 });
      }

      if (!/^\d+$/.test(id)) {
        throw new Response("Provided format id is not a number", {
          status: 404,
        });
      }

      const formatId = Number(id);
      const format = await getFormat(formatId);
      const bookings = await getBookings({ formatId: formatId });

      return { format, bookings };
    },
    Component: Format,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
