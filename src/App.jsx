import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import Sidebar from "./components/SideBar";
import ChatBox from "./components/ChatBox";
import Credits from "./pages/Credits";
import Community from "./pages/Community";
import { useAppContext } from "@/context/AppContext";
import "./assets/prism.css";
import Loading from "./pages/Loading";

function App() {
  const { theme } = useAppContext();
  const { pathname } = useLocation();

  if (pathname === "/loading") return <Loading />;

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <SidebarProvider defaultOpen={true}>
        <Sidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-end gap-2 border-b px-4"></header>
          <div className="flex flex-1 flex-col gap-4 p-4">
            <Routes>
              <Route path="/" element={<ChatBox />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="/community" element={<Community />} />
            </Routes>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

export default App;
