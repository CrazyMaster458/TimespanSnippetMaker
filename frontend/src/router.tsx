import { createBrowserRouter } from "react-router-dom";
import NotFound from "./pages/NotFound";
import GuestLayout from "./components/layouts/GuestLayout";
import Login from "./pages/authentication/Login";
import Signup from "./pages/authentication/Signup";
import DefaultLayout from "./components/layouts/DefaultLayout";
import { CardWithForm } from "./components/VideoUploadCard";
import VideoList from "./pages/lists/VideoList";
import SnippetList from "./pages/lists/SnippetList";
import InfluencerList from "./pages/lists/InfluencerList";
import ChannelList from "./pages/lists/ChannelList";
import TagList from "./pages/lists/TagList";
import Settings from "./pages/settings/Settings";
import { Account } from "./pages/settings/Account";
import { Preferences } from "./pages/settings/Preferences";
import VideoDetail from "./pages/details/VideoDetail";
import { error } from "./utils/error";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "/detail/:id",
        element: <VideoDetail />,
      },
      {
        path: "/cardform",
        element: <CardWithForm />,
      },
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
        path: "/channels",
        element: <ChannelList />,
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
]);

export default router;
