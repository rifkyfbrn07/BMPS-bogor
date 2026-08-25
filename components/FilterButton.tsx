"use client";

import { cn } from "@/lib/utils";

interface FilterButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export default function FilterButton({
  label,
  active,
  onClick,
}: FilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "max-w-full break-words rounded-full px-4 py-2 text-sm font-medium transition",
        active
          ? "bg-navy text-white shadow-sm"
          : "bg-gray-light text-slate-600 hover:bg-blue-light hover:text-blue-royal"
      )}
    >
      {label}
    </button>
  );
}
