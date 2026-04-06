"use client";

import { useState, useMemo } from "react";
import { FilterSidebar } from "./filter-sidebar";
import { ProductCard } from "./product-card";
import { LocationData, finishedProducts } from "@/lib/timber-data";

interface FinishedProductsTabProps {
  location: LocationData;
}

export function FinishedProductsTab({ location }: FinishedProductsTabProps) {
  const [filters, setFilters] = useState({
    woodType: [] as string[],
    grade: [] as string[],
  });

  const filteredProducts = useMemo(() => {
    let data = finishedProducts;

    // Optional location filter - only if unit is selected
    if (location.unit) {
      data = data.filter((p) => p.unit === location.unit);
    }

    if (filters.woodType.length > 0) {
      data = data.filter((p) => filters.woodType.includes(p.woodType));
    }

    if (filters.grade.length > 0) {
      data = data.filter((p) => filters.grade.includes(p.grade));
    }

    return data;
  }, [location.unit, filters]);

  return (
    <div className="grid grid-cols-4 gap-6">
      <FilterSidebar
        filters={filters}
        setFilters={setFilters}
        grades={["A", "B", "C"]}
      />

      <div className="col-span-3">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">
            Semua Produk Jadi ({filteredProducts.length})
            {location.unit && (
              <span className="text-primary ml-2 uppercase tracking-tight text-sm font-black">
                DI {location.unit}
              </span>
            )}
          </h2>
          <div className="flex gap-2">
            <select className="rounded border border-border bg-white px-3 py-2 text-sm text-foreground">
              <option>Urutkan: Relevansi</option>
              <option>Harga: Terendah ke Tertinggi</option>
              <option>Harga: Tertinggi ke Terendah</option>
              <option>Stok: Tertinggi ke Terendah</option>
            </select>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-gray-100 rounded-3xl bg-white/50 backdrop-blur-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <p className="text-gray-900 font-bold text-lg">
              Tidak ada produk ditemukan
            </p>
            <p className="text-sm text-gray-400 mt-1 max-w-[240px] text-center">
              Coba gunakan filter lain atau pilih lokasi yang berbeda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
