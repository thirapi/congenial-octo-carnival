"use client";

import { cn } from "@/lib/utils";
import { LocationData } from "@/lib/timber-data";
import { useCart } from "@/lib/cart-store";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  FileText,
  LogOut,
  ShoppingBag,
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

  const managerOptions = Object.keys(cascadeData["GM Wilayah"]);
  const unitOptions = location.manager
      ? (cascadeData["GM Wilayah"] as Record<string, string[]>)[
          location.manager
        ] ?? []
      : [];

  const handleManagerChange = (value: string) => {
    setLocation({ ...location, wilayah: "GM Wilayah", manager: value, unit: null });
  };

  const handleUnitChange = (value: string) => {
    setLocation({ ...location, unit: value });
  };

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHeroTransparent = (pathname === "/contract") && !isScrolled;

  return (
    <div className={cn("flex flex-col w-full fixed top-0 z-50 transition-colors duration-300", isHeroTransparent ? "bg-transparent" : "bg-black/95 shadow-md shadow-black/10")}>
      <header className="w-full">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex-shrink-0 flex items-center relative z-10 w-[160px]">
            <a href="/" className="hover:opacity-80 transition-opacity block w-full">
              <img
                src="/image.png"
                alt="Perhutani Logo"
                className="w-[110px] h-auto object-contain brightness-0 invert" 
              />
            </a>
          </div>

          <div className="flex-1 flex flex-col justify-center ml-12">
            {/* Top Row */}
            <div className="flex items-center justify-between pb-3 relative">
              <div className="flex items-center">
                <button className="px-5 py-1.5 rounded-full border border-white/60 text-[11px] font-semibold text-white hover:bg-white hover:text-black transition-colors">
                  Unduh Katalog
                </button>
              </div>
              
              <div className="flex items-center gap-6 text-[13px] font-medium pr-1">
                <a href="#" className="text-white hover:opacity-80 transition-opacity">Tentang</a>
                <a href="#" className="text-white hover:opacity-80 transition-opacity">Keberlanjutan</a>
                <a href="#" className="text-white hover:opacity-80 transition-opacity">Berita</a>
                <a href="#" className="text-white hover:opacity-80 transition-opacity">Hubungi</a>
                <a href="#" className="text-white hover:opacity-80 transition-opacity">Bantuan</a>
                
                {/* Lang Toggle */}
                <div className="flex items-center border border-white/30 rounded-full overflow-hidden p-0.5 ml-2 bg-white/5">
                  <button className="px-2.5 py-0.5 bg-white text-black text-[11px] font-bold rounded-full">ID</button>
                  <button className="px-2.5 py-0.5 text-white text-[11px] font-bold hover:text-white/80 transition-colors">EN</button>
                </div>
              </div>

              {/* Separator Line */}
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/30"></div>
            </div>

            {/* Bottom Row */}
            <div className="flex items-center justify-between pt-3">
              <div className="flex items-center gap-8">
                <a href="/" className={cn("text-[15px] font-bold text-white hover:opacity-80 transition-all tracking-wide", pathname === "/" && "text-[#84cc16]")}>Produk Jadi</a>
                <a href="/rst" className={cn("text-[15px] font-bold text-white hover:opacity-80 transition-all tracking-wide", pathname === "/rst" && "text-[#84cc16]")}>Kayu Gergajian Mentah (RST)</a>
                <a href="/contract" className={cn("text-[15px] font-bold text-white hover:opacity-80 transition-all tracking-wide", pathname.includes("/contract") && "text-[#84cc16]")}>Pesanan Korporat</a>
              </div>
              
              <div className="flex items-center gap-6 pr-1">
                 <button className="w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform focus:outline-none">
                   <Search className="w-5 h-5 text-white" strokeWidth={2.5} />
                 </button>
                 
                 <Dialog>
                   <DialogTrigger asChild>
                     <button className="relative w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform focus:outline-none">
                       <ShoppingCart className="w-5 h-5 text-white" strokeWidth={2.5} />
                       {totalCartItems > 0 && (
                         <span className="absolute -top-1 -right-1 bg-[#84cc16] text-[#1B4332] text-[9px] min-w-[16px] h-[16px] flex items-center justify-center rounded-full font-bold shadow-sm">
                           {totalCartItems}
                         </span>
                       )}
                     </button>
                   </DialogTrigger>
                   <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl z-[100]">
                     <DialogHeader className="p-6 bg-[#F8FDF5] border-b">
                       <DialogTitle className="text-xl font-black text-[#1B4332] flex items-center gap-3">
                         <div className="p-2 bg-[#1B4332]/5 rounded-lg w-9 h-9 flex items-center justify-center">
                           <ShoppingCart className="w-5 h-5 text-[#1B4332]" strokeWidth={2.5} />
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
                 
                 <DropdownMenu>
                   <DropdownMenuTrigger asChild>
                     <button className="w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform focus:outline-none">
                       <User className="w-5 h-5 text-white" strokeWidth={2.5} />
                     </button>
                   </DropdownMenuTrigger>
                   <DropdownMenuContent align="end" className="w-56 mt-2 border-0 shadow-xl rounded-xl bg-white text-[#1B4332]">
                     <DropdownMenuLabel className="font-bold">Akun Saya</DropdownMenuLabel>
                     <DropdownMenuSeparator className="bg-gray-100" />
                     <DropdownMenuItem className="font-medium py-2.5 focus:bg-gray-50 focus:text-[#40916C]">
                       <ShoppingBag className="mr-2 h-4 w-4 opacity-70" />
                       Pesanan Saya
                     </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => router.push("/user/contract")} className="cursor-pointer font-medium py-2.5 focus:bg-gray-50 focus:text-[#40916C]">
                       <FileText className="mr-2 h-4 w-4 opacity-70" />
                       Kontrak Saya
                     </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => router.push("/")} className="cursor-pointer font-medium py-2.5 text-red-600 focus:text-red-700 focus:bg-red-50">
                       <LogOut className="mr-2 h-4 w-4 opacity-80" />
                       Keluar
                     </DropdownMenuItem>
                   </DropdownMenuContent>
                 </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Cascading Dropdown Selection - Smooth Vertical Deployment */}
      <div
        style={{ transitionProperty: 'max-height, opacity, padding' }}
        className={cn(
          "bg-white border-b border-border overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
          pathname === "/rst"
            ? "max-h-[600px] opacity-100 py-8"
            : "max-h-0 opacity-0 py-0 invisible"
        )}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 gap-4">

            {/* Manager Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-2">
                Pilih Wilayah / Kota
              </label>
              <select
                value={location.manager || ""}
                onChange={(e) => handleManagerChange(e.target.value)}
                className="w-full rounded border border-border bg-white px-3 py-2 text-sm text-foreground hover:border-primary focus:border-primary focus:outline-none"
              >
                <option value="">-- Pilih Wilayah --</option>
                {managerOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Unit Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-2">
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
              {/* <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  Wilayah
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {location.wilayah}
                </p>
              </div> */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground">
                  Wilayah
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {location.manager}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">
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
