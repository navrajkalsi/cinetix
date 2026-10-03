import { createBrowserRouter } from "react-router";

function Root() {
  return <h1>Hello world</h1>;
}

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      {
        path: "auth",
        Component: AuthLayout,
        children: [
          { path: "login", Component: Login },
          { path: "register", Component: Register },
        ],
      },
      {
        path: "concerts",
        children: [
          { index: true, Component: ConcertsHome },
          { path: ":city", Component: ConcertsCity },
          { path: "trending", Component: ConcertsTrending },
        ],
      },
    ],
  },
]);
