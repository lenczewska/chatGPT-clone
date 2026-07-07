import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { useTranslation } from "react-i18next";

const NewProjectModal = ({ open, onOpenChange, onAdd, onEdit, initialProject = null }) => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!open) return;

    if (initialProject) {
      setName(initialProject.name || "");
      setDescription(initialProject.description || "");
    } else {
      setName("");
      setDescription("");
    }
  }, [open, initialProject]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      name: name.trim(),
      description: description.trim(),
    };

    if (initialProject?.id) {
      onEdit?.({ ...initialProject, ...payload });
    } else {
      onAdd?.({
        ...payload,
        id: Date.now(),
        createdAt: new Date().toLocaleDateString(),
      });
    }

    setName("");
    setDescription("");
    onOpenChange(false);
  };

  const isEditMode = Boolean(initialProject);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/50 backdrop-blur-sm" />
      <DialogContent className="max-w-[95vw] sm:max-w-125">
        <form className="modalContent" onSubmit={handleSubmit}>
          <h2 className="text-xl">
            {isEditMode ? "Edit project" : t("modal.newProject")}
          </h2>

          <div className="mt-2">
            <p className="mb-2">{t("modal.projectName")}</p>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="mt-3">
            <p className="mb-2">{t("modal.describeProject")}</p>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="btns flex justify-end mt-5">
            <button
              type="submit"
              className="crtBtn bg-gray-200 p-1.5 cursor-pointer rounded-lg text-black"
            >
              {isEditMode ? "Save changes" : t("modal.button")}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectModal;