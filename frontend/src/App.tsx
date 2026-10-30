import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import Bookings from "./pages/bookings/Bookings";
import { getBooking, getBookings } from "./api/bookings";
import BookingNew from "./pages/bookings/BookingNew";
import { LookupsProvider } from "./context/LookupProvider";
import Booking from "./pages/bookings/Booking";
import type { DetailsLoaderData } from "./layouts/Details";
import Details from "./layouts/Details";

const router = createBrowserRouter([
  // redirect root to bookings
  { index: true, element: <Navigate replace to="/bookings" /> },

  {
    // get OPTIONAL year from query params
    path: "/bookings",
    children: [
      {
        path: "new",

        element: (
          <LookupsProvider>
            <BookingNew />
          </LookupsProvider>
        ),
      },

      {
        path: ":id",

        loader: async ({ params }) => {
          const { id } = params;

          // no id provided
          if (!id) {
            throw new Response("No booking id provided", { status: 404 });
          }

          if (!/^\d+$/.test(id)) {
            throw new Response("Provided booking id is not a number", {
              status: 404,
            });
          }

          const bookingId = Number(id);
          const booking = await getBooking(bookingId);
          return { booking };
        },

        element: (
          <div className="w-full h-full">
            <LookupsProvider>
              <Booking />
            </LookupsProvider>
          </div>
        ),
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

        element: (
          <LookupsProvider>
            <Bookings />
          </LookupsProvider>
        ),
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
      const bookings = await getBookings({ movieId: movieId });

      const data: DetailsLoaderData = {
        bookings,
        entityInfo: { type: "movie", id: movieId },
      };
      return data;
    },

    element: (
      <LookupsProvider>
        <Details />
      </LookupsProvider>
    ),
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
      const bookings = await getBookings({ locationId: locationId });

      const data: DetailsLoaderData = {
        bookings,
        entityInfo: { type: "location", id: locationId },
      };
      return data;
    },

    element: (
      <LookupsProvider>
        <Details />
      </LookupsProvider>
    ),
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
      const bookings = await getBookings({ formatId: formatId });

      const data: DetailsLoaderData = {
        bookings,
        entityInfo: { type: "format", id: formatId },
      };
      return data;
    },

    element: (
      <LookupsProvider>
        <Details />
      </LookupsProvider>
    ),
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
