"use client";

import { useState, useRef, useEffect } from "react";
import { Check, X } from "lucide-react";

type Props = {
  onAdd: (name: string) => void;
  onCancel: () => void;
};

export function AddCategoryInput({ onAdd, onCancel }: Props) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  const commit = () => {
    if (value.trim()) onAdd(value.trim());
    else onCancel();
  };

  return (
    <div className="flex items-center gap-2 mb-6">
      <input
        ref={ref}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") onCancel();
        }}
        placeholder="Kategoriename..."
        className="px-3 py-1.5 text-sm bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
      />
      <button
        onClick={commit}
        className="p-1.5 text-green-400 hover:text-green-300 transition-colors"
        title="Bestätigen"
      >
        <Check size={16} />
      </button>
      <button
        onClick={onCancel}
        className="p-1.5 text-gray-400 hover:text-white transition-colors"
        title="Abbrechen"
      >
        <X size={16} />
      </button>
    </div>
  );
}
