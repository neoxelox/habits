import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import Desktop from "./pages/Desktop.tsx";
import Error from "./pages/Error.tsx";
import Home from "./pages/Home.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={/Android|iPhone/i.test(navigator.userAgent) ? <Home /> : <Desktop />} />
      {/* The 404 page must be the last route */}
      <Route path="*" element={<Error />} />
    </Route>,
  ),
);

export default function Router() {
  return <RouterProvider router={router} />;
}
