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
        "btn-editorial max-w-full break-words rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ease-out",
        active
          ? "bg-[#172033] text-white shadow-sm ring-1 ring-slate-900/10"
          : "bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-royal"
      )}
    >
      {label}
    </button>
  );
}
