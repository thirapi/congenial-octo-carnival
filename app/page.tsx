"use client";

import { useState } from "react";
import { Header } from "@/components/timber/header";
import { FinishedProductsTab } from "@/components/timber/finished-products-tab";
import { LocationData } from "@/lib/timber-data";

export default function Home() {
  const [location, setLocation] = useState<LocationData>({
    wilayah: null,
    manager: null,
    unit: null,
  });

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header
        location={location}
        setLocation={setLocation}
      />
      
      <div className="mx-auto w-full max-w-7xl px-4 pt-[140px] pb-12 relative z-20">
        <div className="mt-2">
          <FinishedProductsTab location={location} />
        </div>
      </div>
    </main>
  );
}
