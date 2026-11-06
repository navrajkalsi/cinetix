import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  type RouteObject,
} from "react-router";
import { getBooking, getBookings } from "./api/bookings";
import BookingNew from "./pages/bookings/BookingNew";
import { LookupsProvider } from "./context/LookupProvider";
import BookingPage from "./pages/bookings/Booking";
import type { DetailsLoaderData, EntityType } from "./layouts/Details";
import Details from "./layouts/Details";
import FiltersLayout from "./layouts/FilterLayout";
import { Fragment } from "react/jsx-runtime";
import type { Booking } from "./models/Booking";

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
            Component: Fragment,
          },

          {
            path: ":id",
            loader: async ({ params }) => {
              const id = parseId("booking", params.id);
              const booking = await getBooking(id);
              return { booking };
            },
            Component: BookingPage,
          },
        ],
      },

      detailsRoute("movies/:id", "movie", (id) => getBookings({ movieId: id })),

      detailsRoute("locations/:id", "location", (id) =>
        getBookings({ locationId: id }),
      ),

      detailsRoute("formats/:id", "format", (id) =>
        getBookings({ formatId: id }),
      ),
    ],
  },

  {
    // does not require filters, provide only lookups
    path: "/bookings/new",
    element: (
      <LookupsProvider>
        <BookingNew />
      </LookupsProvider>
    ),
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}

function parseId(name: string, id?: string): number {
  if (!id) throw new Response(`No ${name} id found`, { status: 404 });
  if (!/^\d+$/.test(id))
    throw new Response(`Invalid ${name} id`, { status: 404 });

  return Number(id);
}

function detailsRoute(
  path: string,
  type: EntityType,
  fetchBookings: (id: number) => Promise<Booking[]>,
): RouteObject {
  const route: RouteObject = {
    path,
    loader: async ({ params }) => {
      const id = parseId(type, params.id);

      const data: DetailsLoaderData = {
        bookings: await fetchBookings(id),
        entityInfo: { type, id },
      };
      return data;
    },
    Component: Details,
  };

  return route;
}
