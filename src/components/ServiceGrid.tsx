"use client";

import { useState } from "react";
import { ServerOff } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { ServiceCard } from "./ServiceCard";
import { CategorySection } from "./CategorySection";
import { DashboardHeader } from "./DashboardHeader";
import { ServiceDialog } from "./ServiceDialog";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { DeleteCategoryDialog } from "./DeleteCategoryDialog";
import { AddCategoryInput } from "./AddCategoryInput";
import { SettingsDialog } from "./SettingsDialog";
import type { Service, ServiceFormData, Category } from "@/types/service";

type Props = {
  initialServices: Service[];
  initialCategories: Category[];
  initialBg: string;
  initialBgOpacity: number;
  initialOpenInNewTab: boolean;
};

export function ServiceGrid({
  initialServices,
  initialCategories,
  initialBg,
  initialBgOpacity,
  initialOpenInNewTab,
}: Props) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [editMode, setEditMode] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingService, setDeletingService] = useState<Service | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [addingCategory, setAddingCategory] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [bgUrl, setBgUrl] = useState(initialBg);
  const [bgOpacity, setBgOpacity] = useState(initialBgOpacity ?? 1);
  const [openInNewTab, setOpenInNewTab] = useState(initialOpenInNewTab);
  const [activeService, setActiveService] = useState<Service | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const visibleServices = services.filter((s) => editMode || !s.hidden);

  // ─── Service CRUD ────────────────────────────────────────────────────────────

  const handleAdd = () => {
    setEditingService(null);
    setDialogOpen(true);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setDialogOpen(true);
  };

  const handleSave = async (data: ServiceFormData) => {
    if (editingService) {
      const res = await fetch(`/api/services/${editingService.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const updated: Service = await res.json();
        setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      }
    } else {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const created: Service = await res.json();
        setServices((prev) => [...prev, created]);
      }
    }
    setDialogOpen(false);
    setEditingService(null);
  };

  const handleDelete = async () => {
    if (!deletingService) return;
    const res = await fetch(`/api/services/${deletingService.id}`, { method: "DELETE" });
    if (res.ok) {
      setServices((prev) => prev.filter((s) => s.id !== deletingService.id));
    }
    setDeletingService(null);
  };

  const handleToggleHide = async (service: Service) => {
    const newHidden = service.hidden ? 0 : 1;
    const res = await fetch(`/api/services/${service.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: service.name,
        url: service.url,
        icon: service.icon,
        color: service.color,
        hidden: newHidden,
        glassEffect: service.glassEffect,
      }),
    });
    if (res.ok) {
      const updated: Service = await res.json();
      setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    }
  };

  // ─── Kategorie CRUD ──────────────────────────────────────────────────────────

  const handleAddCategory = async (name: string) => {
    setAddingCategory(false);
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) {
      const created: Category = await res.json();
      setCategories((prev) => [...prev, created]);
    }
  };

  const handleRenameCategory = async (id: number, newName: string) => {
    const res = await fetch(`/api/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });
    if (res.ok) {
      const updated: Category = await res.json();
      setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    }
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return;
    const res = await fetch(`/api/categories/${deletingCategory.id}`, { method: "DELETE" });
    if (res.ok) {
      setCategories((prev) => prev.filter((c) => c.id !== deletingCategory.id));
      setServices((prev) =>
        prev.map((s) =>
          s.categoryId === deletingCategory.id ? { ...s, categoryId: null } : s
        )
      );
    }
    setDeletingCategory(null);
  };

  const handleMoveCategory = async (id: number, direction: "up" | "down") => {
    const sorted = [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
    const idx = sorted.findIndex((c) => c.id === id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    // Reihenfolge tauschen
    const reordered = [...sorted];
    [reordered[idx], reordered[swapIdx]] = [reordered[swapIdx], reordered[idx]];
    const updated = reordered.map((c, i) => ({ ...c, sortOrder: i }));

    // Optimistisches Update
    setCategories(updated);

    // Persistieren
    await fetch("/api/categories/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated.map((c) => ({ id: c.id, sortOrder: c.sortOrder }))),
    });
  };

  // ─── Settings ────────────────────────────────────────────────────────────────

  const handleSaveSettings = async (url: string, opacity: number, newOpenInNewTab: boolean) => {
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ backgroundImage: url, bgOpacity: opacity, openInNewTab: newOpenInNewTab ? 1 : 0 }),
    });
    if (res.ok) {
      setBgUrl(url);
      setBgOpacity(opacity);
      setOpenInNewTab(newOpenInNewTab);
    }
    setSettingsOpen(false);
  };

  // ─── Drag & Drop ─────────────────────────────────────────────────────────────

  const handleDragStart = (event: DragStartEvent) => {
    const dragged = services.find((s) => s.id === event.active.id);
    setActiveService(dragged ?? null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveService(null);
    if (!over) return;

    const activeServiceItem = services.find((s) => s.id === active.id);
    if (!activeServiceItem) return;

    // Ziel-Kategorie ermitteln
    let destCategoryId: number | null;
    if (typeof over.id === "string") {
      // Drop direkt auf eine Kategorie-Zone
      destCategoryId = over.id === "uncategorized"
        ? null
        : parseInt(over.id.replace("cat-", ""));
    } else {
      // Drop auf eine andere Service-Karte → deren Kategorie übernehmen
      const overService = services.find((s) => s.id === over.id);
      destCategoryId = overService?.categoryId ?? null;
    }

    const sourceCategoryId = activeServiceItem.categoryId ?? null;
    const isCrossCategory = sourceCategoryId !== destCategoryId;

    if (isCrossCategory) {
      // ── Cross-Category: categoryId wechseln ──────────────────────────────
      const updatedService = { ...activeServiceItem, categoryId: destCategoryId };

      // Optimistisches Update
      setServices((prev) => {
        const without = prev.filter((s) => s.id !== activeServiceItem.id);
        return [...without, updatedService];
      });

      // Persistieren: categoryId
      await fetch(`/api/services/${activeServiceItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: activeServiceItem.name,
          url: activeServiceItem.url,
          icon: activeServiceItem.icon,
          color: activeServiceItem.color,
          hidden: activeServiceItem.hidden,
          glassEffect: activeServiceItem.glassEffect,
          categoryId: destCategoryId,
        }),
      });

      // Reihenfolge der Ziel-Kategorie neu persistieren
      const destServices = services.filter(
        (s) => (s.categoryId ?? null) === destCategoryId && s.id !== activeServiceItem.id
      );
      await fetch("/api/services/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([
          ...destServices.map((s, i) => ({ id: s.id, sortOrder: i })),
          { id: activeServiceItem.id, sortOrder: destServices.length },
        ]),
      });
    } else {
      // ── Same-Category: Reihenfolge innerhalb Kategorie ───────────────────
      if (active.id === over.id) return;

      const categoryServices = services.filter(
        (s) => (s.categoryId ?? null) === sourceCategoryId
      );
      const oldIndex = categoryServices.findIndex((s) => s.id === active.id);
      const newIndex = categoryServices.findIndex((s) => s.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      const reordered = arrayMove(categoryServices, oldIndex, newIndex);

      // Optimistisches Update
      setServices((prev) => {
        const others = prev.filter((s) => (s.categoryId ?? null) !== sourceCategoryId);
        return [...others, ...reordered];
      });

      // Persistieren
      await fetch("/api/services/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reordered.map((s, i) => ({ id: s.id, sortOrder: i }))),
      });
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────────

  const sortedCategories = [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
  const uncategorized = visibleServices.filter((s) => s.categoryId == null);
  const isEmpty = services.length === 0 && categories.length === 0;

  return (
    <>
      {bgUrl && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: -1,
            backgroundImage: `url("${bgUrl}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: bgOpacity,
          }}
        />
      )}

      <DashboardHeader
        editMode={editMode}
        onToggleEditMode={() => setEditMode(!editMode)}
        onAddService={handleAdd}
        onOpenSettings={() => setSettingsOpen(true)}
        onAddCategory={() => setAddingCategory(true)}
      />

      {editMode && addingCategory && (
        <AddCategoryInput
          onAdd={handleAddCategory}
          onCancel={() => setAddingCategory(false)}
        />
      )}

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-500">
          <ServerOff size={48} className="mb-4 text-gray-600" />
          <p className="text-lg font-medium text-gray-400">Noch keine Dienste</p>
          <p className="text-sm mt-1">
            Klicke auf &ldquo;Dienst hinzufügen&rdquo; um loszulegen.
          </p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {/* Unkategorisierte Dienste oben ohne Header */}
          <CategorySection
            category={null}
            services={uncategorized}
            editMode={editMode}
            openInNewTab={openInNewTab}
            onEdit={handleEdit}
            onDelete={setDeletingService}
            onToggleHide={handleToggleHide}
            onRenameCategory={handleRenameCategory}
            onDeleteCategory={(id) =>
              setDeletingCategory(categories.find((c) => c.id === id) ?? null)
            }
          />

          {/* Benannte Kategorien */}
          {sortedCategories.map((cat, idx) => (
            <CategorySection
              key={cat.id}
              category={cat}
              services={visibleServices.filter((s) => s.categoryId === cat.id)}
              editMode={editMode}
              openInNewTab={openInNewTab}
              onEdit={handleEdit}
              onDelete={setDeletingService}
              onToggleHide={handleToggleHide}
              onRenameCategory={handleRenameCategory}
              onDeleteCategory={(id) =>
                setDeletingCategory(categories.find((c) => c.id === id) ?? null)
              }
              onMoveUp={idx > 0 ? () => handleMoveCategory(cat.id, "up") : undefined}
              onMoveDown={idx < sortedCategories.length - 1 ? () => handleMoveCategory(cat.id, "down") : undefined}
            />
          ))}

          {/* Ghost-Karte beim Drag */}
          <DragOverlay>
            {activeService && (
              <ServiceCard
                service={activeService}
                editMode={false}
                openInNewTab={openInNewTab}
                onEdit={() => {}}
                onDelete={() => {}}
                onToggleHide={() => {}}
              />
            )}
          </DragOverlay>
        </DndContext>
      )}

      <ServiceDialog
        open={dialogOpen}
        service={editingService}
        onSave={handleSave}
        onClose={() => {
          setDialogOpen(false);
          setEditingService(null);
        }}
      />

      <DeleteConfirmDialog
        open={!!deletingService}
        service={deletingService}
        onConfirm={handleDelete}
        onClose={() => setDeletingService(null)}
      />

      <DeleteCategoryDialog
        open={!!deletingCategory}
        category={deletingCategory}
        onConfirm={handleDeleteCategory}
        onClose={() => setDeletingCategory(null)}
      />

      <SettingsDialog
        open={settingsOpen}
        currentBg={bgUrl}
        currentBgOpacity={bgOpacity}
        currentOpenInNewTab={openInNewTab}
        onSave={handleSaveSettings}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
}
