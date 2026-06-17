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
    <div className="form pl-18 pr-18 pt-10">
      <div style={{ position: "relative" }}>
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

      {/* Новый проект */}
      <div
        className="inline-flex items-center gap-1 pl-2 pr-2 rounded-[7px] mt-10 cursor-pointer"
        style={{
          backgroundColor: theme === "dark" ? "transparent" : "#f3f4f6",
          border: theme === "dark" ? "1px solid #4A3A6B" : "none",
        }}
        onClick={() => setIsModalOpen(true)}
      >
        <Plus className="cursor-pointer" />
        <h2
          className="text-lg p-1"
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

      <ProjectFolders
        projects={filteredProjects}
        onDelete={handleDeleteProject}
        onToggleStar={toggleStar}
      />

     
    </div>
  );
};

export default Projects;
