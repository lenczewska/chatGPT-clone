import React from "react";
import { Route, Routes } from "react-router-dom";
import SideBar from "./components/SideBar";
import ChatBox from "../src/components/ChatBox";
import Credits from "./pages/Credits";
import Community from "./pages/Community";

function App() {
  return (
    <>
      <div className="dark:bg-linear-to-b from-[#242124] to-[#000000] dark:text-white ">
        <div className="flex h-screen w-screen ">
          <SideBar />
          <Routes>
            <Route path="/" element={<ChatBox />} />
            <Route path="/credits" element={<Credits />} />

            <Route path="/community" element={<Community />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
