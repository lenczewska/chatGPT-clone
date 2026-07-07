import React, { useEffect } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import Sidebar from "./components/SideBar";
import ChatBox from "./components/ChatBox";
import Community from "./pages/Community";
import Projects from "./pages/Projects";
import NewProjectChat from "./pages/NewProjectChat";
import { useAppContext } from "@/context/AppContext";
import "./assets/prism.css";
import Loading from "./pages/Loading";
import Login from "./pages/Login";

function App() {
  const { theme, user } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;

  useEffect(() => {
    if (pathname === "/loading") return;
    if (!user && pathname !== "/login") {
      navigate("/login", { replace: true });
    }
  }, [user, pathname, navigate]);

  if (pathname === "/loading") return <Loading />;

  if (!user && pathname !== "/login") {
    return <Navigate to="/login" replace />;
  }

  if (pathname === "/login") {
    return <Login />;
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <SidebarProvider defaultOpen={true}>
        <Sidebar />
        <SidebarInset className="min-w-0 flex-1">
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-3 sm:px-4">
            <SidebarTrigger className="md:hidden" />
            <div className="ml-auto" />
          </header>
          <main className="flex-1 overflow-x-hidden">
            <div className="w-full max-w-7xl mx-auto p-2 sm:p-4 md:p-6 xl:p-8">
              <Routes>
                <Route
                  path="/chatBox"
                  element={<ChatBox key={location.key} />}
                />
                <Route path="/community" element={<Community />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/newProjectChat" element={<NewProjectChat />} />
              </Routes>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

export default App;