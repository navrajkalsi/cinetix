import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import Bookings from "./pages/bookings/Bookings";
import { getBookings } from "./api/booking";

const router = createBrowserRouter([
  // redirect root to bookings
  { index: true, element: <Navigate replace to="/bookings" /> },

  {
    // get OPTIONAL year from path segment
    path: "/bookings/:year?",
    loader: async ({ params }) => {
      const { year } = params;

      // verify if year is a number, if not null
      if (year && !/^\d{4}$/.test(year)) {
        throw new Response("Invalid year", { status: 404 });
      }

      const yearNum = year ? Number(year) : null;
      const bookings = await getBookings(yearNum);

      return { yearNum, bookings };
    },
    Component: Bookings,
  },
  // {
  //   path: "/",
  //   Component: Root,
  //   children: [
  //     { index: true, Component: Home },
  //     { path: "about", Component: About },
  //     {
  //       path: "auth",
  //       Component: AuthLayout,
  //       children: [
  //         { path: "login", Component: Login },
  //         { path: "register", Component: Register },
  //       ],
  //     },
  //     {
  //       path: "concerts",
  //       children: [
  //         { index: true, Component: ConcertsHome },
  //         { path: ":city", Component: ConcertsCity },
  //         { path: "trending", Component: ConcertsTrending },
  //       ],
  //     },
  //   ],
  // },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
