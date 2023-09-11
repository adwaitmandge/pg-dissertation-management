import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  ClipboardIcon,
  ChatBubbleLeftRightIcon,
  VideoCameraIcon,
  ArrowLeftOnRectangleIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/solid";

import { Home, Profile, Tables, Notifications } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import MentorMonitor from "./pages/dashboard/views/MentorMonitor";
import StudentTasks from "./pages/dashboard/views/StudentTasks";
import ChatPage from "./pages/chat/chat";
import Room from "./pages/dashboard/room";
import Videocall from "./pages/dashboard/videocall";
import Chatbot from "./pages/dashboard/chatbot";
import Summary from "./pages/dashboard/summarybot";
const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "profile",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "tables",
        path: "tables",
        element: <Tables />,
      },
      {
        icon: <BellIcon {...icon} />,
        name: "notifications",
        path: "notifications",
        element: <Notifications />,
      },
      {
        icon: <BellIcon {...icon} />,
        name: "user-details",
        path: "/mentor/:id",
        element: <MentorMonitor />,
      },
      {
        icon: <ClipboardDocumentListIcon {...icon} />,
        name: "tasks",
        path: "/student",
        element: <StudentTasks />,
      },
      {
        icon: <VideoCameraIcon {...icon} />,
        name: "Video Call",
        path: "/videocall",
        element: <Videocall />,
      },
      {
        icon: <VideoCameraIcon {...icon} />,
        name: "vcRoom",
        path: "/room/:roomId",
        element: <Room />,
      },
      {
        icon: <ClipboardIcon {...icon} />,
        name: "DocGPT",
        path: "/chatbot",
        element: <Chatbot />,
      },
      {
        icon: <ClipboardDocumentListIcon {...icon} />,
        name: "Summarization",
        path: "/summary",
        element: <Summary />,
      },
      // {
      //   icon: <ChatBubbleLeftRightIcon {...icon} />,
      //   name: "chat",
      //   path: "/chat",
      //   element: <ChatPage />,
      // },
    ],
  },
  {
    layout: "chat",
    pages: [
      {
        icon: <ChatBubbleLeftRightIcon {...icon} />,
        name: "chat",
        path: "",
        element: <ChatPage />,
      },
    ],
  },
  {
    layout: "auth",
    pages: [
      {
        icon: <ArrowRightOnRectangleIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <UserPlusIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      },
      {
        icon: <ArrowLeftOnRectangleIcon {...icon} />,
        name: "logout",
        path: "/sign-in",
        element: <SignIn />,
      },
    ],
  },
];

export default routes;
