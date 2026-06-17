import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { HiDotsVertical } from "react-icons/hi";
import { useAppContext } from "../context/AppContext";
import { FaRegStar, FaStar } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaPen } from "react-icons/fa";

const ProjectFolders = ({ projects = [], onDelete, onToggleStar, onEdit }) => {
  const { theme } = useAppContext();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState(null);
  const menuRef = useRef(null);
  const buttonRefs = useRef({});

  useEffect(() => {
    const handleClickOutside = (e) => {
      const clickedButton = Object.values(buttonRefs.current).some(
        (btn) => btn && btn.contains(e.target),
      );
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !clickedButton
      ) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-wrap gap-4 mt-5">
      {projects.map((project) => (
        <div
          key={project.id}
          className="group relative border border-[#4A3A6B] w-67.5 h-30 rounded-lg shadow-lg transition-all p-4 flex flex-col justify-between cursor-pointer"
          style={{ boxShadow: "0 2px 10px 0 rgba(74, 58, 107, 0.45)" }}
          onClick={() => navigate("/newProjectChat")}
        >
          <div>
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-medium truncate">{project.name}</h3>

              <button
                type="button"
                ref={(el) => (buttonRefs.current[project.id] = el)}
                className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMenu((prev) =>
                    prev === project.id ? null : project.id,
                  );
                }}
                aria-label="Toggle menu"
              >
                <HiDotsVertical
                  className={`w-6 h-7 rounded-[3px] pl-0.5 pr-0.5  cursor-pointer  ${
                    theme === "dark" ? "hover:bg-gray-900" : "hover:bg-gray-200"
                  }`}
                />
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-1">{project.description}</p>
          </div>

          <p className="text-xs text-gray-400">{project.createdAt}</p>

          {activeMenu === project.id && (
            <div
              ref={menuRef}
              className={`absolute right-0 top-10 left-45 mt-2 w-30 rounded-lg border shadow-lg z-20 ${
                theme === "dark"
                  ? "border-gray-800 bg-black"
                  : "border-gray-200 bg-white"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Star toggle */}
              <button
                type="button"
                className={`w-full flex items-center gap-1 px-4 py-2 text-left text-sm border-b rounded-t-lg cursor-pointer transition-colors duration-150 ${
                  theme === "dark"
                    ? "border-gray-800 bg-black text-white hover:bg-gray-950"
                    : "border-gray-200 bg-white text-black hover:bg-gray-100"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStar?.(project.id);
                }}
              >
                {project.starred ? (
                  <FaStar className="w-5 text-[#8e6ad4]" />
                ) : (
                  <FaRegStar className="w-5 text-gray-400" />
                )}
                Star
              </button>

              {/* Edit */}
              <button
                type="button"
                className={`w-full flex gap-2 items-center px-4 py-2 text-left text-sm border-b cursor-pointer transition-colors duration-150 ${
                  theme === "dark"
                    ? "border-gray-800 bg-black text-white hover:bg-gray-950"
                    : "border-gray-200 bg-white text-black hover:bg-gray-100"
                }`}
                onClick={() => {
                  setActiveMenu(null);
                  onEdit?.(project.id);
                }}
              >
                <FaPen />
                Edit
              </button>

              {/* Delete */}
              <button
                type="button"
                className={`w-full flex items-center gap-1 px-4 py-2 text-left text-sm rounded-b-lg cursor-pointer transition-colors duration-150 ${
                  theme === "dark"
                    ? "border-gray-800 bg-black text-white hover:bg-gray-950"
                    : "border-gray-200 bg-white text-black hover:bg-gray-100"
                }`}
                onClick={() => {
                  setActiveMenu(null);
                  onDelete?.(project.id);
                }}
              >
                <MdOutlineDeleteOutline />
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProjectFolders;
