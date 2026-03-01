"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";
import type { Service } from "@/types/service";

type Props = {
  open: boolean;
  service: Service | null;
  onConfirm: () => void;
  onClose: () => void;
};

export function DeleteConfirmDialog({
  open,
  service,
  onConfirm,
  onClose,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-0 w-full max-w-sm backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500/10 rounded-xl">
            <AlertTriangle size={24} className="text-red-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              Dienst entfernen
            </h2>
            <p className="text-sm text-gray-400">
              &ldquo;{service?.name}&rdquo; wirklich löschen?
            </p>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Abbrechen
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors"
          >
            Löschen
          </button>
        </div>
      </div>
    </dialog>
  );
}
