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
    if (!location.unit) return [];

    let data = finishedProducts.filter((p) => p.unit === location.unit);

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
        {!location.unit ? (
          <div className="flex flex-col items-center justify-center py-32 bg-muted/10 rounded-xl border-2 border-dashed border-border">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Pilih Unit Terlebih Dahulu
            </h3>
            <p className="text-muted-foreground text-center max-w-md">
              Silakan gunakan dropdown di bagian atas untuk memilih Wilayah,
              Manager, dan Unit agar kami dapat menampilkan stok yang tersedia
              di lokasi Anda.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">
                Produk Jadi yang Tersedia ({filteredProducts.length})
                <span className="text-primary ml-2">di {location.unit}</span>
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
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded border border-dashed border-border">
                <p className="text-muted-foreground font-medium">
                  Tidak ada produk tersedia untuk unit ini.
                </p>
                <p className="text-sm text-muted-foreground">
                  Silakan pilih unit lain atau hubungi administrator.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
