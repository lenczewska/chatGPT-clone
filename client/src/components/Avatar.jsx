import { useAppContext } from "@/context/AppContext";
import React from "react";

const Avatar = ({ user, size = 20,  }) => {
  const {theme } = useAppContext();
  const firstLetter =
    user?.name?.charAt(0).toUpperCase() ||
    user?.email?.charAt(0).toUpperCase() ||
    "A";


  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-full flex items-center justify-center font-semibold text-xs ${
        theme === "dark" ? "bg-[#4A3A6B] text-white" : "bg-black text-white"
      }`}
    >
      {firstLetter}
    </div>
  );
};

export default Avatar;
