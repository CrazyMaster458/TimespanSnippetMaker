import { Navigate, createBrowserRouter } from "react-router-dom";
import NotFound from "./pages/NotFound";
import GuestLayout from "./components/layouts/GuestLayout";
import Login from "./pages/authentication/Login";
import Signup from "./pages/authentication/Signup";
import DefaultLayout from "./components/layouts/DefaultLayout";
import VideoList from "./pages/lists/VideoList";
import SnippetList from "./pages/lists/SnippetList";
import InfluencerList from "./pages/lists/InfluencerList";
import VideoTypeList from "./pages/lists/VideoTypeList";
import TagList from "./pages/lists/TagList";
import Settings from "./pages/settings/Settings";
import { Account } from "./pages/settings/Account";
import { Preferences } from "./pages/settings/Preferences";
import VideoDetail from "./pages/details/VideoDetail";
import InfiniteScrollTest from "./pages/lists/__test__InfiniteScroll";
// import PublicList from "./pages/lists/PublicList";
// import Test from "./test";
// import Admin from "./pages/Admin";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/videos" />,
      },
      // {
      //   path: "/admin",
      //   element: <Admin />,
      // },
      {
        path: "/detail/:id",
        element: <VideoDetail />,
      },
      {
        path: "/infinite-scroll",
        element: <InfiniteScrollTest />,
      },
      // {
      //   path: "/public",
      //   element: <PublicList />,
      // },
      {
        path: "/videos",
        element: <VideoList />,
      },
      {
        path: "/snippets",
        element: <SnippetList />,
      },
      {
        path: "/influencers",
        element: <InfluencerList />,
      },
      {
        path: "/video-types",
        element: <VideoTypeList />,
      },
      {
        path: "/tags",
        element: <TagList />,
      },
      {
        path: "/settings",
        element: <Settings />,
        children: [
          {
            path: "account",
            element: <Account />,
          },
          {
            path: "preferences",
            element: <Preferences />,
          },
        ],
      },
    ],
  },
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/login" />,
      },
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
    path: "*",
    element: <NotFound />,
  },
  // {
  //   path: "/test",
  //   element: <Test />,
  // },
]);

export default router;
