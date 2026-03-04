"use client";

import { useState } from "react";
import { FilterSidebar } from "./filter-sidebar";
import { RSTTable } from "./rst-table";
import { LocationData } from "@/lib/timber-data";

interface RawTimberTabProps {
  location: LocationData;
}

export function RawTimberTab({ location }: RawTimberTabProps) {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [filters, setFilters] = useState({
    woodType: [] as string[],
    grade: [] as string[],
  });

  return (
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
  );
}
