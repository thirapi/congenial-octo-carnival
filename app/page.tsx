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
      
      {/* Hero Section */}
      <div className="relative w-full h-[380px] bg-[#1a2e1d] flex items-center justify-center pt-20">
        <div 
          className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?q=80&w=2000&auto=format&fit=crop")' }}
        />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Katalog Produk Perhutani</h1>
          <p className="text-lg text-white/80 font-medium">Temukan dan pesan produk kayu berkualitas tinggi langsung dari sumbernya dengan antarmuka yang transparan.</p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-12 relative z-20">
        <div className="mt-2">
          <FinishedProductsTab location={location} />
        </div>
      </div>
    </main>
  );
}
