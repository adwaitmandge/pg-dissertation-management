import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import ChatPage from "./pages/chat/chat";
import { MaterialTailwindControllerProvider } from "./context";

function App() {
  return (
    <Routes>
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/" element={<Navigate to="/dashboard/home" />} />
    </Routes>
  );
}

export default App;
