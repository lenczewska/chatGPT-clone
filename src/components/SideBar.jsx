 import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import gpt_logo from "../../public/gpt_logo.png"
import gpt_logo_white from "../../public/gpt_logo_white.png"

const SideBar = () => {
  const { chats, setSelectedChat, theme, setTheme, user } = useAppContext();
  const [search, setSearch] = useState(""); 

  return (
    <div className="flex flex-col  h-screen min-w-72 bg-gray-50 dark:bg-gradient-to-b dark:from-[#242124]/30 dark:to-[#000000]/30 border-r border-[#80609F]/30 backdrop-blur-3xl transition-all duration-500 max-md:relative left-0 z-1 p-5">
      {/* Logo */}
      <img
        src={theme === "dark" ?  gpt_logo : gpt_logo_white }
        alt=""
        className="mx-auto w-[20px] "
      />

      {/* New Chat btn */}
      <button className="flex justify-center items-center w-full py-2 mt-8 text-white bg-gradient-to-r from-[#A456F7] to-[#3D81F6] text-sm rounded-md cursor-pointer " >
        <span className="mr-2 text-[25px]" >+</span>New Chat
      </button>

       <div className="flex items-center gap-2 p-3 mt-4 border border-gray-400 dark:border-white/20 rounded-md ">
       <img src={assets.search_icon} className="w-4 not-dark:invert" alt="" />
       <input type="text" placeholder="Search Conversation" className="outline-0" />

       </div>
    </div>
  );
};

export default SideBar;
