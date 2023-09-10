import { UserState } from "@/context/UserProvider";
import React from "react";
import MentorView from "./views/MentorView";
import StudentView from "./views/StudentView";

const Dashboard = () => {
  const { user } = UserState();

  if (user?.role == "Mentor") {
    return <MentorView />;
  } else if (user?.role == "Student") {
    return <StudentView />;
  }
};

export default Dashboard;
export * from "@/pages/dashboard/home";
export * from "@/pages/dashboard/profile";
export * from "@/pages/dashboard/tables";
export * from "@/pages/dashboard/notifications";
