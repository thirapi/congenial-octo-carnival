"use client";

import { useState } from "react";
import { FilterSidebar } from "./filter-sidebar";
import { RSTTable } from "./rst-table";
import { LocationData } from "@/lib/timber-data";

interface RawTimberTabProps {
  location: LocationData;
  setLocation: (loc: LocationData) => void;
}

export function RawTimberTab({ location, setLocation }: RawTimberTabProps) {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [filters, setFilters] = useState({
    woodType: [] as string[],
    grade: [] as string[],
    sertifikat: [] as string[],
  });

  const unitOptions =
    location.manager === "Wilayah Jawa Timur"
      ? ["PIK Gresik", "PIK Saradan", "PIK Ngawi", "PIK Jatirogo"]
      : location.manager === "Wilayah Jawa Tengah"
        ? ["PIK Cepu", "PIK Randublatung"]
        : [];

  return (
    <div className="flex flex-col gap-6">
      {/* Compact Location Filter Bar */}
      <div className="flex items-center gap-3 p-2 px-3 bg-white border border-border rounded-xl shadow-sm w-fit">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">Wilayah:</span>
          <select 
            value={location.manager || ""}
            onChange={(e) => setLocation({ ...location, manager: e.target.value, unit: null })}
            className="rounded-lg border-none bg-muted/50 px-3 py-1.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 min-w-[140px]"
          >
            <option value="">Pilih Wilayah</option>
            <option value="Wilayah Jawa Timur">Jawa Timur</option>
            <option value="Wilayah Jawa Tengah">Jawa Tengah</option>
          </select>
        </div>

        <div className="w-px h-6 bg-border mx-1" />

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">Unit Produksi:</span>
          <select 
            value={location.unit || ""}
            onChange={(e) => setLocation({ ...location, unit: e.target.value })}
            disabled={!location.manager}
            className="rounded-lg border-none bg-muted/50 px-3 py-1.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 min-w-[140px]"
          >
            <option value="">Pilih Unit</option>
            {unitOptions.map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          grades={["U", "P", "D", "T"]}
        />

        <div className="col-span-3">
          <RSTTable
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            location={location}
            filters={filters}
          />
        </div>
      </div>
    </div>
  );
}
