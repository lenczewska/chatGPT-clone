// Projects.jsx
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ProjectFolders from "../components/ProjectFolders";
import Plus from "../components/ui/plus";
import NewProjectModal from "../components/NewProjectModal";
import { useAppContext } from "@/context/AppContext";
import { CiSearch } from "react-icons/ci";

const Projects = ({}) => {
  const { t } = useTranslation();
  const { theme, projects, setProjects } = useAppContext();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddProject = (project) => {
    setProjects((prev) => [...prev, { ...project, starred: false }]);
    navigate("/newProjectChat");
  };

  const handleDeleteProject = (projectId) => {
    setProjects((prev) => prev.filter((project) => project.id !== projectId));
  };

  const toggleStar = (projectId) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, starred: !p.starred } : p)),
    );
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const starredProjects = projects.filter((p) => p.starred);

  return (
    <div className="w-full max-w-6xl mx-auto px-3 py-6 sm:px-4 sm:py-8 md:px-6 lg:px-8">
      <div className="relative max-w-2xl">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            border: "1px solid #4A3A6B",
            color: theme === "dark" ? "white" : "black",
            paddingRight: "36px",
          }}
          className={theme === "dark" ? "placeholder:text-white" : "placeholder:text-black"}
          placeholder={t("project.placeholder")}
        />
        <CiSearch
          size={18}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#7B60B1",
            pointerEvents: "none",
          }}
        />
      </div>

      <div
        className="mt-6 inline-flex cursor-pointer items-center gap-1 rounded-[7px] px-3 py-2 sm:mt-8"
        style={{
          backgroundColor: theme === "dark" ? "transparent" : "#f3f4f6",
          border: theme === "dark" ? "1px solid #4A3A6B" : "none",
        }}
        onClick={() => setIsModalOpen(true)}
      >
        <Plus className="cursor-pointer" />
        <h2
          className="p-1 text-base sm:text-lg"
          style={{ color: theme === "dark" ? "white" : "black" }}
        >
          {t("projects.new")}
        </h2>
      </div>

      <NewProjectModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAdd={handleAddProject}
      />

      <div className="mt-4 sm:mt-6">
        <ProjectFolders
          projects={filteredProjects}
          onDelete={handleDeleteProject}
          onToggleStar={toggleStar}
        />
      </div>
    </div>
  );
};

export default Projects;
