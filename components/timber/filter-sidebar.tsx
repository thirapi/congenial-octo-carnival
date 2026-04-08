"use client";

import { cn } from "@/lib/utils";

interface FilterSidebarProps {
  filters: {
    woodType: string[];
    grade: string[];
    sertifikat: string[];
  };
  setFilters: (filters: any) => void;
  woodTypes?: string[];
  grades?: string[];
}

export function FilterSidebar({
  filters,
  setFilters,
  woodTypes = ["Jati", "Rimba"],
  grades = ["A", "B", "C"],
}: FilterSidebarProps) {
  const toggleFilter = (category: string, value: string) => {
    setFilters({
      ...filters,
      [category]: (filters as any)[category].includes(value)
        ? (filters as any)[category].filter((item: string) => item !== value)
        : [...(filters as any)[category], value],
    });
  };

  const FilterSection = ({
    title,
    items,
    category,
    compact = false,
  }: {
    title: string;
    items: string[];
    category: string;
    compact?: boolean;
  }) => (
    <div className="border-b border-border pb-4 last:border-0 border-dashed">
      <h3 className="mb-3 text-sm font-semibold text-foreground/70">
        {title}
      </h3>
      <div className={compact ? "grid grid-cols-2 gap-2" : "space-y-2"}>
        {items.map((item) => (
          <label
            key={item}
            className={cn(
              "flex items-center gap-2 cursor-pointer group transition-all",
              compact && "bg-muted/30 hover:bg-muted p-2 rounded-lg border border-transparent hover:border-border"
            )}
          >
            <input
              type="checkbox"
              checked={(filters as any)[category].includes(item)}
              onChange={() => toggleFilter(category, item)}
              className="h-4 w-4 rounded border-border transition-colors accent-primary"
            />
            <span className={cn(
              "text-sm font-medium transition-colors",
              (filters as any)[category].includes(item) ? "text-primary" : "text-foreground group-hover:text-primary"
            )}>
              {item}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <aside className="col-span-1">
      <div className="sticky top-[120px] rounded-xl border border-border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
          <h2 className="text-base font-semibold text-foreground">
            Filter Inventaris
          </h2>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 pt-2">
            <FilterSection
              title="Jenis Kayu"
              items={woodTypes}
              category="woodType"
              compact
            />

            <FilterSection 
              title="Grade Produk" 
              items={grades} 
              category="grade" 
              compact
            />
          </div>

          <FilterSection 
            title="Sertifikasi" 
            items={["FSC-PURE", "FSC-MIX", "SVLK"]} 
            category="sertifikat" 
            compact
          />
        </div>

        <button
          onClick={() =>
            setFilters({
              woodType: [],
              grade: [],
              sertifikat: [],
            })
          }
          className="mt-8 w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all border-dashed"
        >
          Hapus Semua Filter
        </button>
      </div>
    </aside>
  );
}
