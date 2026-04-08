"use client";

import { useCart } from "@/lib/cart-store";
import { Header } from "@/components/timber/header";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  CreditCard,
  Truck,
  ChevronRight,
  Package,
  CheckCircle2,
  Building2,
  Info,
  MapPin,
  Clock,
} from "lucide-react";
import { LocationData } from "@/lib/timber-data";

import { Suspense } from "react";

interface CheckoutItem {
  id: number;
  name: string;
  unit: string;
  quantity: number;
  price: number;
  volume: number | null;
  details: string;
}

function CheckoutContent() {
  const { finishedItems, rstItems } = useCart();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "rst";

  const [location, setLocation] = useState<LocationData>({
    wilayah: null,
    manager: null,
    unit: null,
  });

  const [selectedPayment, setSelectedPayment] = useState<string>("bri");
  const [selectedCourier, setSelectedCourier] = useState<string>("perhutani");

  // Filter items based on checkout type
  const items: CheckoutItem[] = useMemo(() => {
    if (type === "finished") {
      return finishedItems.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        unit: item.product.unit,
        quantity: item.quantity,
        price: item.product.price,
        volume: null,
        details: `${item.product.woodType} • ${item.product.dimensions}`,
      }));
    } else {
      return rstItems.map((item) => ({
        id: item.id,
        name: item.noKapling,
        unit: item.tpk,
        quantity: item.jumlah,
        price: item.hargaAkhir,
        volume: item.volume,
        details: `${item.jenisKayu} • ${item.productType}`,
      }));
    }
  }, [type, finishedItems, rstItems]);

  // Group items by Unit/TPK
  const groupedItems = useMemo(() => {
    const groups: { [key: string]: typeof items } = {};
    items.forEach((item) => {
      if (!groups[item.unit]) groups[item.unit] = [];
      groups[item.unit].push(item);
    });
    return groups;
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce(
      (acc, item) => acc + item.price * (item.quantity || 1),
      0,
    );
  }, [items]);

  const ppn = subtotal * 0.11;
  const total = subtotal + ppn;

  const paymentChannels = [
    {
      id: "bri",
      name: "BANK BRI",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/BANK_BRI_logo.svg/1200px-BANK_BRI_logo.svg.png",
    },
    {
      id: "mandiri",
      name: "mandiri",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Bank_Mandiri_logo_2016.svg/1200px-Bank_Mandiri_logo_2016.svg.png",
    },
    {
      id: "bni",
      name: "BNI",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Bank_Negara_Indonesia_logo_%282004%29.svg/1200px-Bank_Negara_Indonesia_logo_%282004%29.svg.png",
    },
    {
      id: "bca",
      name: "BCA",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_Central_Asia.svg/1200px-Bank_Central_Asia.svg.png",
    },
  ];

  const couriers = [
    {
      id: "perhutani",
      name: "Logistik Perhutani",
      desc: "Estimasi 3-5 hari kerja",
      price: 0,
      icon: Building2,
    },
    {
      id: "jne",
      name: "JNE Logistics",
      desc: "Estimasi 2-4 hari kerja",
      price: 50000,
      icon: Truck,
    },
    {
      id: "self",
      name: "Ambil Sendiri (Pickup)",
      desc: "Dari TPK/Unit terpilih",
      price: 0,
      icon: Package,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFB]">
      <Header location={location} setLocation={setLocation} />

      <main className="max-w-7xl mx-auto px-4 pt-40 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Checkout Details & Courier */}
          <div className="space-y-10">
            <div>
              <h1 className="text-3xl font-semibold text-[#1B4332] mb-8">
                Checkout
              </h1>

              <div className="space-y-6">
                {Object.entries(groupedItems).map(([unit, unitItems]) => (
                  <div
                    key={unit}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden"
                  >
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-50">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-[#1B4332]" />
                        <span className="font-semibold text-[#1B4332]">
                          {unit}
                        </span>
                      </div>
                      <button className="text-[10px] font-semibold text-[#40916C] hover:underline">
                        Detail
                      </button>
                    </div>

                    <div className="space-y-6">
                      {unitItems.map((item) => (
                        <div key={item.id} className="space-y-4">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#1B4332]" />
                            <span className="text-sm font-bold text-[#1B4332]">
                              {item.name}
                            </span>
                            <span className="text-xs text-muted-foreground ml-auto">
                              {item.details}
                            </span>
                          </div>

                           <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                              <span className="text-[10px] text-muted-foreground font-semibold leading-none mb-1.5">
                                Volume
                              </span>
                              <span className="font-semibold text-[#1B4332] text-sm">
                                {item.volume ? item.volume.toFixed(4) : "-"}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] text-muted-foreground font-semibold leading-none mb-1.5">
                                Jumlah
                              </span>
                              <span className="font-semibold text-[#1B4332] text-sm">
                                {item.quantity}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-50 space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground font-medium text-xs">
                          Subtotal
                        </span>
                        <span className="font-bold text-[#1B4332]">
                          Rp {subtotal.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground font-medium text-xs">
                          PPN (11%)
                        </span>
                        <span className="font-bold text-[#1B4332]">
                          Rp {ppn.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-dashed border-gray-100">
                        <span className="font-semibold text-[#1B4332] text-lg">
                          Order Total
                        </span>
                        <span className="text-xl font-semibold text-[#1B4332]">
                          Rp {total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Courier Selection Section */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Truck className="w-6 h-6 text-[#1B4332]" />
                <h2 className="text-xl font-semibold text-[#1B4332]">
                  Pilih Jasa Pengiriman
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {couriers.map((courier) => (
                  <button
                    key={courier.id}
                    onClick={() => setSelectedCourier(courier.id)}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                      selectedCourier === courier.id
                        ? "border-[#40916C] bg-[#F8FDF5]"
                        : "border-gray-100 bg-white hover:border-gray-200"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-lg ${selectedCourier === courier.id ? "bg-[#1B4332] text-white" : "bg-gray-100 text-gray-400"}`}
                    >
                      <courier.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-[#1B4332]">
                          {courier.name}
                        </p>
                        <p className="text-sm font-semibold text-[#1B4332]">
                          {courier.price === 0
                            ? "Gratis"
                            : `Rp ${courier.price.toLocaleString()}`}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {courier.desc}
                      </p>
                    </div>
                    {selectedCourier === courier.id && (
                      <CheckCircle2 className="w-5 h-5 text-[#40916C]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Payment Channels */}
          <div className="lg:sticky lg:top-40 space-y-8">
            <h2 className="text-xl font-semibold text-[#1B4332]">
              Pilih Channel Pembayaran
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {paymentChannels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedPayment(channel.id)}
                  className={`group relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all h-32 ${
                    selectedPayment === channel.id
                      ? "border-[#CC3F0C] bg-white ring-4 ring-[#CC3F0C]/5"
                      : "border-gray-100 bg-white hover:border-gray-200"
                  }`}
                >
                  <img
                    src={channel.logo}
                    alt={channel.name}
                    className={`h-8 w-auto object-contain transition-all ${
                      selectedPayment === channel.id
                        ? "grayscale-0 opacity-100 scale-105"
                        : "grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100"
                    }`}
                  />

                  {selectedPayment === channel.id && (
                    <div className="absolute -top-2 -right-2 bg-[#CC3F0C] text-white p-1 rounded-full border-2 border-white shadow-sm">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="bg-[#F8FDF5] rounded-xl p-4 border border-[#E8F3E1] flex gap-3">
              <Info className="w-5 h-5 text-[#1B4332] shrink-0" />
              <p className="text-xs text-[#1B4332]/70 leading-relaxed">
                Pastikan pilihan pengiriman dan metode pembayaran Anda sudah
                sesuai sebelum melanjutkan proses konfirmasi pesanan.
              </p>
            </div>

            <Button className="w-full bg-[#1B4332] hover:bg-[#2D6A4F] text-white h-12 rounded-xl font-semibold text-sm shadow-lg shadow-green-900/20 transition-all active:scale-[0.98]">
              Konfirmasi Pesanan
            </Button>
          </div>
        </div>
      </main>

      {/* Mini Footer / Breadcrumb-like */}
      <div className="bg-white border-t border-gray-100 py-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#40916C]/10 flex items-center justify-center text-[#40916C] font-semibold text-sm">
                1
              </div>
              <span className="text-sm font-semibold text-[#1B4332]">
                Pilih Produk
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#40916C]/10 flex items-center justify-center text-[#40916C] font-semibold text-sm">
                2
              </div>
              <span className="text-sm font-semibold text-[#1B4332]">
                Pembayaran
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
            <div className="flex items-center gap-2 opacity-30">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-semibold text-sm">
                3
              </div>
              <span className="text-sm font-semibold text-gray-400">Selesai</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            © 2026 Perum Perhutani. Seluruh hak cipta dilindungi undang-undang.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading checkout...
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
