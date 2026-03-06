"use client";

import { useState, useRef, useEffect } from "react";
import { Pencil, Trash2, Check, X, ChevronUp, ChevronDown } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { ServiceCard } from "./ServiceCard";
import type { Service, Category } from "@/types/service";

type Props = {
  category: Category | null; // null = Unkategorisiert
  services: Service[];
  editMode: boolean;
  openInNewTab: boolean;
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
  onToggleHide: (service: Service) => void;
  onRenameCategory: (id: number, newName: string) => void;
  onDeleteCategory: (id: number) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
};

export function CategorySection({
  category,
  services,
  editMode,
  openInNewTab,
  onEdit,
  onDelete,
  onToggleHide,
  onRenameCategory,
  onDeleteCategory,
  onMoveUp,
  onMoveDown,
}: Props) {
  const droppableId = category ? `cat-${category.id}` : "uncategorized";
  const { setNodeRef, isOver } = useDroppable({ id: droppableId });

  const [renaming, setRenaming] = useState(false);
  const [nameInput, setNameInput] = useState(category?.name ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (renaming) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [renaming]);

  // Reset rename state when category name changes externally
  useEffect(() => {
    setNameInput(category?.name ?? "");
  }, [category?.name]);

  const commitRename = () => {
    if (category && nameInput.trim()) {
      onRenameCategory(category.id, nameInput.trim());
    }
    setRenaming(false);
  };

  const cancelRename = () => {
    setNameInput(category?.name ?? "");
    setRenaming(false);
  };

  // Leere unkategorisierte Sektion im Nicht-Edit-Modus nicht rendern
  if (!category && services.length === 0 && !editMode) return null;

  return (
    <div className="mb-6">
      {/* Kategorie-Header — nur bei benannten Kategorien */}
      {category !== null && (
        <div className="flex items-center gap-2 mb-3">
          {renaming ? (
            <>
              <input
                ref={inputRef}
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitRename();
                  if (e.key === "Escape") cancelRename();
                }}
                className="text-sm font-semibold bg-gray-800 border border-gray-600 rounded px-2 py-0.5 text-white focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={commitRename}
                className="p-1 text-green-400 hover:text-green-300 transition-colors"
                title="Bestätigen"
              >
                <Check size={14} />
              </button>
              <button
                onClick={cancelRename}
                className="p-1 text-gray-400 hover:text-white transition-colors"
                title="Abbrechen"
              >
                <X size={14} />
              </button>
            </>
          ) : (
            <>
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                {category.name}
              </h2>
              {editMode && (
                <>
                  <button
                    onClick={() => { setNameInput(category.name); setRenaming(true); }}
                    className="p-1 text-gray-500 hover:text-gray-300 transition-colors"
                    title="Umbenennen"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => onDeleteCategory(category.id)}
                    className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                    title="Kategorie löschen"
                  >
                    <Trash2 size={13} />
                  </button>
                  {onMoveUp && (
                    <button
                      onClick={onMoveUp}
                      className="p-1 text-gray-500 hover:text-gray-300 transition-colors"
                      title="Nach oben"
                    >
                      <ChevronUp size={13} />
                    </button>
                  )}
                  {onMoveDown && (
                    <button
                      onClick={onMoveDown}
                      className="p-1 text-gray-500 hover:text-gray-300 transition-colors"
                      title="Nach unten"
                    >
                      <ChevronDown size={13} />
                    </button>
                  )}
                </>
              )}
            </>
          )}
          <div className="flex-1 h-px bg-gray-700/60" />
        </div>
      )}

      {/* Drop-Zone mit Karten-Grid */}
      <div
        ref={setNodeRef}
        className={`w-full min-h-[100px] rounded-xl transition-colors ${
          isOver && editMode ? "bg-blue-900/20 ring-1 ring-blue-500/40" : ""
        }`}
      >
        <SortableContext
          items={services.map((s) => s.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                editMode={editMode}
                openInNewTab={openInNewTab}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleHide={onToggleHide}
              />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}
