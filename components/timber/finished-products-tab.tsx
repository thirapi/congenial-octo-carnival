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
    sertifikat: [] as string[],
  });

  const [localLocation, setLocalLocation] = useState({
    wilayah: "" as string,
    unit: "" as string,
  });

  const [sortBy, setSortBy] = useState("relevance");

  const filteredProducts = useMemo(() => {
    let data = [...finishedProducts];

    // Global location filter from header
    const activeWilayah = localLocation.wilayah || location.manager;
    const activeUnit = localLocation.unit || location.unit;

    if (activeUnit) {
      data = data.filter((p) => p.unit === activeUnit);
    } else if (activeWilayah) {
      data = data.filter((p) => p.wilayah === activeWilayah);
    }

    if (filters.woodType.length > 0) {
      data = data.filter((p) => filters.woodType.includes(p.woodType));
    }

    if (filters.grade.length > 0) {
      data = data.filter((p) => filters.grade.includes(p.grade));
    }

    if (filters.sertifikat.length > 0) {
      data = data.filter((p) => filters.sertifikat.includes(p.sertifikat));
    }

    // Sorting
    if (sortBy === "price-low") {
      data.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      data.sort((a, b) => b.price - a.price);
    } else if (sortBy === "stock-high") {
      data.sort((a, b) => b.stock - a.stock);
    }

    return data;
  }, [location, filters, localLocation, sortBy]);

  const unitOptions = localLocation.wilayah === "Wilayah Jawa Timur" 
    ? ["PIK Gresik", "PIK Saradan", "PIK Ngawi", "PIK Jatirogo"]
    : localLocation.wilayah === "Wilayah Jawa Tengah"
    ? ["PIK Cepu", "PIK Randublatung"]
    : [];

  return (
    <div className="grid grid-cols-4 gap-6">
      <FilterSidebar
        filters={filters}
        setFilters={setFilters}
        grades={["A", "B", "C"]}
      />

      <div className="col-span-3">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <select 
            value={localLocation.wilayah}
            onChange={(e) => setLocalLocation({ wilayah: e.target.value, unit: "" })}
            className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 min-w-[140px] hover:border-primary/50 transition-colors"
          >
            <option value="">Semua Wilayah</option>
            <option value="Wilayah Jawa Timur">Jawa Timur</option>
            <option value="Wilayah Jawa Tengah">Jawa Tengah</option>
          </select>

          <select 
            value={localLocation.unit}
            onChange={(e) => setLocalLocation({ ...localLocation, unit: e.target.value })}
            disabled={!localLocation.wilayah}
            className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 min-w-[140px] hover:border-primary/50 transition-colors"
          >
            <option value="">Pilih Unit</option>
            {unitOptions.map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>

          <div className="flex-1" />

          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 min-w-[160px] hover:border-primary/50 transition-colors"
          >
            <option value="relevance">Urutkan: Relevansi</option>
            <option value="price-low">Harga: Terendah ke Tertinggi</option>
            <option value="price-high">Harga: Tertinggi ke Terendah</option>
            <option value="stock-high">Stok: Tertinggi ke Terendah</option>
          </select>
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
            <p className="text-gray-900 font-semibold text-lg">
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
