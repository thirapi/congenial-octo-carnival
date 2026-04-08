"use client";

import { useState } from "react";
import { Header } from "@/components/timber/header";
import { RawTimberTab } from "@/components/timber/raw-timber-tab";
import { LocationData } from "@/lib/timber-data";

export default function RstPage() {
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
      
      <div className="mx-auto w-full max-w-7xl px-4 pt-32 pb-12 relative z-20">
        <div className="mt-2">
          <RawTimberTab location={location} setLocation={setLocation} />
        </div>
      </div>
    </main>
  );
}
