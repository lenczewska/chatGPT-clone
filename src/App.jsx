import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import Sidebar from "./components/SideBar";
import ChatBox from "./components/ChatBox";
import Credits from "./pages/Credits";
import Community from "./pages/Community";
import { Moon, Sun } from "lucide-react";

function App() {
  const [isDark, setIsDark] = useState(true);

  return (
    <div className={isDark ? "dark" : ""}>
      <SidebarProvider defaultOpen={true}>
        <Sidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-end gap-2 border-b px-4">
            {/* <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-foreground" />
              ) : (
                <Moon className="h-5 w-5 text-foreground" />
              )}
            </button> */}
          </header>
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