import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  ArrowDownLeftIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/solid";

import { Home, Profile, Tables, Notifications} from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import MentorMonitor from "./pages/dashboard/views/MentorMonitor";
import StudentTasks from "./pages/dashboard/views/StudentTasks";
import Room from "./pages/dashboard/room"
import Videocall from "./pages/dashboard/videocall"
import Chatbot from "./pages/dashboard/chatbot";
import Summary from "./pages/dashboard/summarybot";
import Scibot from "./pages/dashboard/scibot";
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
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "tables",
        path: "/tables",
        element: <Tables />,
      },
      {
        icon: <BellIcon {...icon} />,
        name: "notifications",
        path: "/notifactions",
        element: <Notifications />,
      },
      {
        icon: <BellIcon {...icon} />,
        name: "user-details",
        path: "/mentor/:id",
        element: <MentorMonitor />,
      },
      {
        icon: <BellIcon {...icon} />,
        name: "tasks",
        path: "/student",
        element: <StudentTasks />,
      },
      {
        icon: <BellIcon {...icon} />,
        name: "vc",
        path: "/videocall",
        element: <Videocall />,
      },
      {
        icon: <BellIcon {...icon} />,
        name: "vcRoom",
        path: "/room/:roomId",
        element: <Room />,
      },
      {
        icon: <BellIcon {...icon} />,
        name: "DocGPT",
        path: "/chatbot",
        element: <Chatbot />,
      },
      {
        icon: <BellIcon {...icon} />,
        name: "Summarization",
        path: "/summary",
        element: <Summary />,
      },
      {
        icon: <BellIcon {...icon} />,
        name: "Science Bot",
        path: "/scibot",
        element: <Scibot />,
      },
    ],
  },
  {
    title: "auth pages",
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
