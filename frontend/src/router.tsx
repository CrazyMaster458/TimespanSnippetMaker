import { createBrowserRouter } from "react-router-dom";
import { SnippetCard } from "./components/SnippetCard";
import { VideoPlayer } from "./components/VideoPlayer";
import Detail from "./pages/Detail";
import ListView from "./pages/ListView";
import NotFound from "./pages/NotFound";
import GuestLayout from "./components/layouts/GuestLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DefaultLayout from "./components/layouts/DefaultLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "/listview",
        element: <ListView />,
      },
      {
        path: "/detail",
        element: <Detail />,
      },
    ],
  },
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
    ],
  },
  {
    path: "/videoplayer",
    element: <VideoPlayer />,
  },
  {
    path: "/snippetcard",
    element: <SnippetCard />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
