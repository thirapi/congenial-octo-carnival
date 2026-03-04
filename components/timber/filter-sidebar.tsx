"use client";

interface FilterSidebarProps {
  filters: {
    woodType: string[];
    grade: string[];
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
  const toggleFilter = (category: keyof typeof filters, value: string) => {
    setFilters({
      ...filters,
      [category]: filters[category].includes(value)
        ? filters[category].filter((item) => item !== value)
        : [...filters[category], value],
    });
  };

  const FilterSection = ({
    title,
    items,
    category,
  }: {
    title: string;
    items: string[];
    category: keyof typeof filters;
  }) => (
    <div className="border-b border-border pb-4 last:border-0 border-dashed">
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      <div className="space-y-2">
        {items.map((item) => (
          <label
            key={item}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <input
              type="checkbox"
              checked={filters[category].includes(item)}
              onChange={() => toggleFilter(category, item)}
              className="h-4 w-4 rounded border-border transition-colors group-hover:border-primary"
            />
            <span className="text-sm text-foreground group-hover:text-primary transition-colors">
              {item}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <aside className="col-span-1">
      <div className="sticky top-4 rounded-lg border border-border bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-sm font-bold uppercase text-primary border-b border-border pb-2">
          Filter Inventaris
        </h2>

        <div className="space-y-6">
          <FilterSection
            title="Jenis Kayu"
            items={woodTypes}
            category="woodType"
          />

          <FilterSection title="Grade / Mutu" items={grades} category="grade" />
        </div>

        <button
          onClick={() =>
            setFilters({
              woodType: [],
              grade: [],
            })
          }
          className="mt-6 w-full rounded border border-border bg-muted/50 px-3 py-2 text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all uppercase tracking-wider"
        >
          Hapus Semua Filter
        </button>
      </div>
    </aside>
  );
}
