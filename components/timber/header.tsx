"use client";

import { cn } from "@/lib/utils";
import { LocationData } from "@/lib/timber-data";
import { useCart } from "@/lib/cart-store";
import { useRouter, usePathname } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trash2,
  Logs,
  Package,
  ShoppingCart,
  User,
  Search,
  HelpCircle,
  Globe,
  ChevronDown,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const cascadeData = {
  "GM Wilayah": {
    "Wilayah Jawa Timur": [
      "PIK Gresik",
      "PIK Saradan",
      "PIK Ngawi",
      "PIK Jatirogo",
      "PPL",
    ],
    "Wilayah Jawa Tengah": ["PIK Cepu", "PIK Randublatung"],
  },
};

interface HeaderProps {
  location: LocationData;
  setLocation: (location: LocationData) => void;
  activeTab?: string;
}

export function Header({ location, setLocation, activeTab }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { finishedItems, removeFinishedItem, rstItems, removeRSTItem } =
    useCart();

  const totalFinishedQuantity = finishedItems.reduce(
    (acc: number, curr) => acc + curr.quantity,
    0,
  );
  const totalRSTQuantity = rstItems.length;
  const totalCartItems = totalFinishedQuantity + totalRSTQuantity;

  const wilayahOptions = ["GM Wilayah"];
  const managerOptions = location.wilayah
    ? Object.keys(cascadeData[location.wilayah as keyof typeof cascadeData])
    : [];
  const unitOptions =
    location.wilayah && location.manager
      ? (cascadeData[location.wilayah as keyof typeof cascadeData] as Record<string, string[]>)[
          location.manager
        ] ?? []
      : [];

  const handleWilayahChange = (value: string) => {
    setLocation({ wilayah: value, manager: null, unit: null });
  };

  const handleManagerChange = (value: string) => {
    setLocation({ ...location, manager: value, unit: null });
  };

  const handleUnitChange = (value: string) => {
    setLocation({ ...location, unit: value });
  };

  return (
    <div className="flex flex-col w-full sticky top-0 z-50">
      {/* Top Bar - Gradient Green */}
      <div className="bg-gradient-to-r from-[#23521C] to-[#268C48] text-white py-2.5 text-[11px] font-medium tracking-wide shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4 text-white/90">
            <a href="#" className="hover:text-white transition-colors">
              Guidlines
            </a>
            <span className="opacity-30">|</span>
            <a href="#" className="hover:text-white transition-colors">
              Kebijakan Privasi
            </a>
            <span className="opacity-30">|</span>
            <a href="#" className="hover:text-white transition-colors">
              FAQ
            </a>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 font-bold tracking-[0.15em] uppercase text-white">
            TOKO INDUSTRI PERHUTANI
          </div>

          <div className="flex items-center gap-6">
            <a
              href="#"
              className="flex items-center gap-2 hover:text-white transition-colors text-white/90"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Bantuan
            </a>
            <a
              href="#"
              className="flex items-center gap-2 hover:text-white transition-colors text-white/90"
            >
              <Globe className="w-3.5 h-3.5" />
              Bahasa Indonesia
            </a>
          </div>
        </div>
      </div>

      {/* Main Header - Light Cream/Green */}
      <header className="bg-[#F8FDF5] border-b border-[#E8F3E1] py-3 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center">
            <a href="/" className="hover:opacity-90 transition-opacity flex items-center">
              <img
                src="/image.png"
                alt="Perhutani Logo"
                className="h-14 w-32 object-contain" // Fixed width instead of w-auto
              />
            </a>
          </div>

          {/* Navigation Menu */}
          <nav className="flex items-center gap-10">
            <a
              href="#"
              className="text-[13px] font-bold text-[#1B4332] hover:opacity-70 transition-all uppercase tracking-widest"
            >
              Home
            </a>
            <a
              href="#"
              className="text-[13px] font-bold text-[#1B4332] hover:opacity-70 transition-all uppercase tracking-widest"
            >
              About
            </a>
            <a
              href="#"
              className="text-[13px] font-bold text-[#1B4332] hover:opacity-70 transition-all uppercase tracking-widest"
            >
              News
            </a>
            <a
              href="#"
              className="text-[13px] font-bold text-[#1B4332] hover:opacity-70 transition-all uppercase tracking-widest"
            >
              Contact
            </a>
            <a
              href="/contract"
              className={cn(
                "text-[13px] font-bold text-[#1B4332] hover:opacity-70 transition-all uppercase tracking-widest relative py-1",
                pathname === "/contract" && "font-black",
              )}
            >
              Contract
              {pathname === "/contract" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1B4332]" />
              )}
            </a>
            <a
              href="/"
              className={cn(
                "text-[13px] font-bold text-[#1B4332] hover:opacity-70 transition-all uppercase tracking-widest relative py-1 inline-flex flex-col items-center",
                pathname === "/" && "font-black",
              )}
            >
              <span className="flex items-center justify-center h-5">Shop</span>
              {/* Invisible spacer for bold text stability */}
              <span className="font-black h-0 overflow-hidden invisible select-none pointer-events-none">Shop</span>
              {pathname === "/" && (
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#1B4332]" />
              )}
            </a>
          </nav>

          {/* Action Icons - Using Individual Image Files */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => router.push("/login")}
              className="w-10 h-10 flex items-center justify-center hover:scale-110 transition-transform focus:outline-none"
            >
              <img
                src="/user.png"
                alt="User"
                className="w-7 h-7 object-contain"
              />
            </button>
            <button className="w-10 h-10 flex items-center justify-center hover:scale-110 transition-transform focus:outline-none">
              <img
                src="/search.png"
                alt="Search"
                className="w-7 h-7 object-contain"
              />
            </button>
            <Dialog>
              <DialogTrigger asChild>
                <button className="relative hover:scale-110 transition-transform focus:outline-none">
                  <img
                    src="/cart.png"
                    alt="Cart"
                    className="w-7 h-7 object-contain"
                  />
                  {totalCartItems > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-[#CC3F0C] text-white text-[9px] min-w-[16px] h-[16px] flex items-center justify-center rounded-full font-bold shadow-sm">
                      {totalCartItems}
                    </span>
                  )}
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl">
                <DialogHeader className="p-6 bg-[#F8FDF5] border-b">
                  <DialogTitle className="text-xl font-black text-[#1B4332] flex items-center gap-3">
                    <div className="p-2 bg-[#1B4332]/5 rounded-lg w-9 h-9 flex items-center justify-center">
                      <img
                        src="/cart.png"
                        alt="Cart"
                        className="w-5 h-5 object-contain"
                      />
                    </div>
                    Keranjang Belanja
                  </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="finished" className="w-full">
                  <div className="px-6 py-4 bg-white border-b">
                    <TabsList className="grid w-full grid-cols-2 h-11 p-1 bg-muted/50 rounded-xl">
                      <TabsTrigger
                        value="finished"
                        className="rounded-lg font-bold"
                      >
                        Finished Product ({totalFinishedQuantity})
                      </TabsTrigger>
                      <TabsTrigger value="rst" className="rounded-lg font-bold">
                        RST ({totalRSTQuantity})
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent
                    value="finished"
                    className="outline-none h-[400px] flex flex-col"
                  >
                    <div className="flex-1 overflow-auto px-6 py-2">
                      {finishedItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground/40">
                          <Package className="w-16 h-16 mb-4 opacity-10" />
                          <p className="text-sm font-bold">
                            Belum ada produk di keranjang
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {finishedItems.map((item) => (
                            <div
                              key={item.product.id}
                              className="flex items-center gap-4 p-3 bg-[#F8FDF5]/50 border border-[#E8F3E1] rounded-xl hover:border-[#1B4332]/20 transition-all"
                            >
                              <img
                                src={item.product.image}
                                className="w-16 h-16 rounded-lg object-cover border"
                                alt=""
                              />
                              <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-bold text-[#1B4332] truncate">
                                  {item.product.name}
                                </p>
                                <p className="text-xs text-muted-foreground font-medium">
                                  {item.quantity} Unit x Rp{" "}
                                  {item.product.price.toLocaleString()}
                                </p>
                              </div>
                              <button
                                onClick={() =>
                                  removeFinishedItem(item.product.id)
                                }
                                className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 pressed:scale-95 transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {finishedItems.length > 0 && (
                      <div className="p-6 bg-[#F8FDF5] border-t border-[#E8F3E1] space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                            Total Pembayaran
                          </span>
                          <span className="text-2xl font-black text-[#1B4332]">
                            Rp{" "}
                            {finishedItems
                              .reduce(
                                (acc: number, curr) =>
                                  acc + curr.product.price * curr.quantity,
                                0,
                              )
                              .toLocaleString()}
                          </span>
                        </div>
                        <Button
                          onClick={() => router.push("/checkout?type=finished")}
                          className="w-full bg-[#1B4332] hover:bg-[#2D6A4F] text-white h-12 rounded-xl font-bold shadow-lg shadow-green-900/20"
                        >
                          Lanjutkan Checkout
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent
                    value="rst"
                    className="outline-none h-[400px] flex flex-col"
                  >
                    <div className="flex-1 overflow-auto px-6 py-2">
                      {rstItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground/40">
                          <Logs className="w-16 h-16 mb-4 opacity-10" />
                          <p className="text-sm font-bold">
                            Belum ada RST dipilih
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {rstItems.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between p-3 bg-[#F8FDF5]/50 border border-[#E8F3E1] rounded-xl hover:border-[#1B4332]/20 transition-all"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#1B4332]" />
                                  <p className="text-sm font-bold text-[#1B4332] truncate">
                                    {item.noKapling}
                                  </p>
                                </div>
                                <p className="text-[11px] text-muted-foreground font-medium pl-3.5">
                                  {item.jenisKayu} • {item.productType}
                                </p>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-xs font-bold text-[#1B4332]">
                                  Rp {item.hargaAkhir.toLocaleString()}
                                </span>
                                <button
                                  onClick={() => removeRSTItem(item.id)}
                                  className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-all"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {rstItems.length > 0 && (
                      <div className="p-6 bg-[#F8FDF5] border-t border-[#E8F3E1] space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                            Estimasi Harga RST
                          </span>
                          <span className="text-2xl font-black text-[#1B4332]">
                            Rp{" "}
                            {rstItems
                              .reduce(
                                (acc: number, curr) => acc + curr.hargaAkhir,
                                0,
                              )
                              .toLocaleString()}
                          </span>
                        </div>
                        <Button
                          onClick={() => router.push("/checkout?type=rst")}
                          className="w-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white h-12 rounded-xl font-bold shadow-lg shadow-green-900/20"
                        >
                          Lanjutkan Checkout
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Cascading Dropdown Selection - Smooth Vertical Deployment */}
      <div
        style={{ transitionProperty: 'max-height, opacity, padding' }}
        className={cn(
          "bg-white border-b border-border overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
          pathname === "/" && activeTab !== "finished"
            ? "max-h-[600px] opacity-100 py-8"
            : "max-h-0 opacity-0 py-0 invisible"
        )}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-4">
            {/* Wilayah Dropdown */}
            <div>
              <label className="block text-xs font-semibold uppercase text-muted-foreground mb-2">
                Pilih Wilayah
              </label>
              <select
                value={location.wilayah || ""}
                onChange={(e) => handleWilayahChange(e.target.value)}
                className="w-full rounded border border-border bg-white px-3 py-2 text-sm text-foreground hover:border-primary focus:border-primary focus:outline-none"
              >
                <option value="">-- Pilih Wilayah --</option>
                {wilayahOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Manager Dropdown */}
            <div>
              <label className="block text-xs font-semibold uppercase text-muted-foreground mb-2">
                Pilih Manager / Kota
              </label>
              <select
                value={location.manager || ""}
                onChange={(e) => handleManagerChange(e.target.value)}
                disabled={!location.wilayah}
                className="w-full rounded border border-border bg-white px-3 py-2 text-sm text-foreground disabled:bg-muted disabled:text-muted-foreground hover:border-primary focus:border-primary focus:outline-none disabled:cursor-not-allowed"
              >
                <option value="">-- Pilih Manager --</option>
                {managerOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Unit Dropdown */}
            <div>
              <label className="block text-xs font-semibold uppercase text-muted-foreground mb-2">
                Pilih Unit / Lokasi
              </label>
              <select
                value={location.unit || ""}
                onChange={(e) => handleUnitChange(e.target.value)}
                disabled={!location.manager}
                className="w-full rounded border border-border bg-white px-3 py-2 text-sm text-foreground disabled:bg-muted disabled:text-muted-foreground hover:border-primary focus:border-primary focus:outline-none disabled:cursor-not-allowed"
              >
                <option value="">-- Pilih Unit --</option>
                {unitOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Selected Location Summary */}
          {location.unit && (
            <div className="mt-6 grid grid-cols-3 gap-4 bg-muted/30 rounded p-4 border border-border transition-all duration-300">
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  Wilayah
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {location.wilayah}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  Manager
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {location.manager}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  Unit / Lokasi
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {location.unit}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
