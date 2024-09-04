import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Sign from "./components/pages/Sign";
import Home from "./components/pages/Home";
import Layout from "./components/Layout";
import { Toaster } from "react-hot-toast";
import Register from "./components/pages/Register";
import Verify from "./components/pages/Verify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import OnBoard from "./components/pages/OnBoard";

function App() {
  const Client = new QueryClient()
  const Router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Sign /> },

        {
          path: "/sign-up",
          element: <Register />,
        },
        {
          path: "/home",
          element: <Home />,
        },
        {
          path: "/verify",
          element: <Verify />,
        },
        {
          path: "/welcome/:auth",
          element: <OnBoard />,
        },
      ],
    },
  ]);

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          success: {
            style: {
              background: "#98d90b",
            },
          },
          error: {
            style: {
              background: "red",
            },
          },
          style: {
            textTransform: "capitalize",
            borderRadius: "10px",
            color: "#fff",
          },
        }}
      />
      <QueryClientProvider client={Client}>
      <RouterProvider router={Router} />
      </QueryClientProvider>
    </>
  );
}

export default App;
