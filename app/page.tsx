"use client";

import { useState } from "react";
import { Header } from "@/components/timber/header";
import { TabNavigation } from "@/components/timber/tab-navigation";
import { RawTimberTab } from "@/components/timber/raw-timber-tab";
import { FinishedProductsTab } from "@/components/timber/finished-products-tab";
import { LocationData } from "@/lib/timber-data";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"rst" | "finished">("finished");
  const [location, setLocation] = useState<LocationData>({
    wilayah: null,
    manager: null,
    unit: null,
  });

  return (
    <main className="min-h-screen bg-background">
      <Header
        location={location}
        setLocation={setLocation}
        activeTab={activeTab}
      />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="mt-8">
          {activeTab === "rst" && <RawTimberTab location={location} />}
          {activeTab === "finished" && (
            <FinishedProductsTab location={location} />
          )}
        </div>
      </div>
    </main>
  );
}
