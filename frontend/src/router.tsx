import { createBrowserRouter } from "react-router-dom";
import { SnippetCard } from "./components/SnippetCardOld";
import { VideoPlayer } from "./components/VideoPlayer";
import Detail from "./pages/Detail";
import ListView from "./pages/ListView";
import NotFound from "./pages/NotFound";
import GuestLayout from "./components/layouts/GuestLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DefaultLayout from "./components/layouts/DefaultLayout";
import VideoForm from "./pages/___tests___/videoform";
import SnippetForm from "./pages/___tests___/snippetform";
import TagForm from "./pages/___tests___/tagfrom";
import InfluencerForm from "./pages/___tests___/influencerform";
import VideoTypeForm from "./pages/___tests___/videotypeform";
import StatusForm from "./pages/___tests___/statusform";
import DetailForm from "./pages/___tests___/detailtext";
import UploadImg from "./pages/___tests___/upload";
import { CardWithForm } from "./components/VideoUploadCard";
import { SignupCard } from "./components/SignupCard";
import { LoginCard } from "./components/LoginCard";
import { Drawer } from "./components/Drawer";
import { YourComponent } from "./components/Stepper2";
import Whisper from "./components/whisper";
import Test from "./test";
import ListPage from "./pages/ListPage";
import VideoList from "./pages/VideoList";
import SnippetList from "./pages/SnippetList";
import InfluencerList from "./pages/InfluencerList";
import ChannelList from "./pages/ChannelList";
import TagList from "./pages/TagList";
import Settings from "./pages/Settings";

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
      {
        path: "/videoform",
        element: <VideoForm />,
      },
      {
        path: "/snippetform",
        element: <SnippetForm />,
      },
      {
        path: "/tagform",
        element: <TagForm />,
      },
      {
        path: "/influencerform",
        element: <InfluencerForm />,
      },
      {
        path: "/videotypeform",
        element: <VideoTypeForm />,
      },
      {
        path: "/statusform",
        element: <StatusForm />,
      },
      {
        path: "/detailform/:id",
        element: <DetailForm />,
      },
      {
        path: "/upload",
        element: <UploadImg />,
      },
      {
        path: "/cardform",
        element: <CardWithForm />,
      },
      {
        path: "/drawer",
        element: <Drawer />,
      },
      {
        path: "/stepper",
        element: <YourComponent/>,
      },
      {
        path: "/whisper",
        element: <Whisper/>,
      },
      {
        path: "/test",
        element: <Test/>,
      },
      {
        path: "/listpage",
        element: <ListPage/>,
      },
      {
        path: "/videos",
        element: <VideoList/>,
      },
      {
        path: "/snippets",
        element: <SnippetList/>,
      },
      {
        path: "/influencers",
        element: <InfluencerList/>,
      },
      {
        path: "/channels",
        element: <ChannelList/>,
      },
      {
        path: "/tags",
        element: <TagList/>,
      },
      {
        path: "/settings",
        element: <Settings/>,
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
      {
        path: "/signupcard",
        element: <SignupCard />,
      },
      {
        path: "/logincard",
        element: <LoginCard />,
      },
    ],
  },
  {
    path: "/videoplayer",
    element: <VideoPlayer />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
