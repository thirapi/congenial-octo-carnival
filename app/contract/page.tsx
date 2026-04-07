"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/timber/header";
import { useRouter } from "next/navigation";
import {
  LocationData,
  WoodType,
  rstData,
  finishedProducts,
  RST_PRODUCT_TYPES_ARRAY,
  FINISHED_CATEGORIES_ARRAY,
} from "@/lib/timber-data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  CalendarIcon,
  ChevronRight,
  Package,
  MapPin,
  Ruler,
  TreeDeciduous,
  History,
  Info,
  BadgeCheck,
  Clock,
  ArrowRight,
  Download,
  ShieldCheck,
  TrendingUp,
  Truck,
  FileSearch,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const cascadeData = {
  "GM Wilayah": {
    "Manager IK Jawa Timur": [
      "PIK Gresik",
      "PIK Saradan",
      "PIK Ngawi",
      "PIK Jatirogo",
      "PPL",
    ],
    "Manager IK Jawa Tengah": ["PIK Cepu", "PIK Randublatung"],
  },
};

type Step = "form" | "offering" | "active";
type PageView = "landing" | "app";

interface RequestedGrade {
  id: string;
  name: string; // Detail description
  type: "rst" | "finished";
  category: string;
  subCategory?: string;
  grade: string;
  basePrice: number;
  quantity: number;
}

interface DeliveryLog {
  id: string;
  date: string;
  item: string;
  quantity: number;
  volume: number;
  driver: string;
  vehicleNo: string;
  status: "Delivered" | "In Transit";
}

const MOCK_DELIVERY_LOGS: DeliveryLog[] = [
  {
    id: "DO-00129",
    date: "2024-03-01",
    item: "Grade A (Mutu U)",
    quantity: 50,
    volume: 50.0,
    driver: "Bambang S.",
    vehicleNo: "L 9901 AB",
    status: "Delivered",
  },
  {
    id: "DO-00142",
    date: "2024-03-05",
    item: "Grade A (Mutu U)",
    quantity: 30,
    volume: 30.0,
    driver: "Supardi",
    vehicleNo: "L 8122 XY",
    status: "Delivered",
  },
  {
    id: "DO-00155",
    date: "2024-03-10",
    item: "Grade B (Mutu P)",
    quantity: 20,
    volume: 20.0,
    driver: "Agus T.",
    vehicleNo: "W 1012 OP",
    status: "In Transit",
  },
];

export default function ContractPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("form");
  const [showLogs, setShowLogs] = useState(false);
  const [productTab, setProductTab] = useState<"rst" | "finished">("rst");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [location, setLocation] = useState<LocationData>({
    wilayah: "GM Wilayah",
    manager: null,
    unit: null,
  });

  const [woodType, setWoodType] = useState<WoodType>("Jati");
  const [selectedGrades, setSelectedGrades] = useState<RequestedGrade[]>([]);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [errors, setErrors] = useState<{
    unit?: string;
    manager?: string;
    grades?: string;
    startDate?: string;
    endDate?: string;
  }>({});

  const [typeForm, setTypeForm] = useState<"rst" | "finished" | "">("");
  const [catForm, setCatForm] = useState("");
  const [subCatForm, setSubCatForm] = useState("");
  const [activeGrades, setActiveGrades] = useState<
    Record<string, number | string>
  >({});

  const [productNameForm, setProductNameForm] = useState("");

  const rstCategories = useMemo(() => {
    return RST_PRODUCT_TYPES_ARRAY;
  }, []);

  const fpCategories = useMemo(() => {
    return FINISHED_CATEGORIES_ARRAY;
  }, []);

  const fpSubcats = useMemo(() => {
    if (typeForm !== "finished" || !catForm) return [];
    // Unlink from woodType so all schematic subcategories for the category are shown
    const list = finishedProducts
      .filter((d) => d.category === catForm)
      .map((d) => d.subCategory);
    return Array.from(new Set(list));
  }, [typeForm, catForm]);

  const fpProductNames = useMemo(() => {
    if (typeForm !== "finished" || !subCatForm) return [];
    // Unlink from woodType so all schematic product names for the category/subcategory are shown
    const list = finishedProducts
      .filter((d) => d.category === catForm && d.subCategory === subCatForm)
      .map((d) => d.name);
    return Array.from(new Set(list));
  }, [typeForm, catForm, subCatForm]);

  const availableRstMutu = useMemo(() => {
    if (typeForm !== "rst" || !catForm) return [];
    // Provide all schematic mutu, attempt to find referential price if exists, else fallback
    const referentialItem = rstData.find((d) => d.productType === catForm);
    const baseP = referentialItem?.hargaAkhir || 10000000;

    return [
      { code: "U", name: "Mutu Utama (U)", price: baseP * 1.5 },
      { code: "P", name: "Mutu Pertama (P)", price: baseP * 1.2 },
      { code: "D", name: "Mutu Dua (D)", price: baseP },
      { code: "T", name: "Mutu Tiga (T)", price: baseP * 0.8 },
    ];
  }, [typeForm, catForm]);

  const availableFpGrades = useMemo(() => {
    if (typeForm !== "finished" || !productNameForm) return [];
    // Provide all schematic grades, attempt to find referential price if exists, else fallback
    const referentialItem = finishedProducts.find(
      (d) => d.name === productNameForm,
    );
    const baseP = referentialItem?.price || 5000000;

    return [
      { code: "A", name: "Grade A", price: baseP * 1.2 },
      { code: "B", name: "Grade B", price: baseP },
      { code: "C", name: "Grade C", price: baseP * 0.8 },
    ];
  }, [typeForm, productNameForm]);

  const handleAddGrade = () => {
    if (!typeForm || !catForm) return;
    if (typeForm === "finished" && (!subCatForm || !productNameForm)) return;

    const gradesToAdd = Object.entries(activeGrades)
      .map(([code, val]) => [code, Number(val)] as const)
      .filter(([_, qty]) => !isNaN(qty) && qty > 0);
    if (gradesToAdd.length === 0) return;

    const newSelected = [...selectedGrades];

    gradesToAdd.forEach(([gradeCode, qty]) => {
      const id = `${typeForm}-${catForm}-${subCatForm}-${productNameForm}-${gradeCode}`;
      const existsIndex = newSelected.findIndex((g) => g.id === id);

      if (existsIndex >= 0) {
        newSelected[existsIndex] = {
          ...newSelected[existsIndex],
          quantity: newSelected[existsIndex].quantity + qty,
        };
      } else {
        let displayName = catForm;
        if (typeForm === "finished") displayName = productNameForm;

        let basePrice = 0;
        let gradeName = gradeCode;
        if (typeForm === "rst") {
          const m = availableRstMutu.find((m) => m.code === gradeCode);
          basePrice = m?.price || 0;
          gradeName = m?.name || gradeCode;
        } else {
          const m = availableFpGrades.find((m) => m.code === gradeCode);
          basePrice = m?.price || 0;
          gradeName = m?.name || gradeCode;
        }

        newSelected.push({
          id,
          type: typeForm,
          category: catForm,
          subCategory: subCatForm,
          grade: gradeCode,
          name: `${displayName} (${gradeName})`,
          quantity: qty,
          basePrice,
        });
      }
    });

    setSelectedGrades(newSelected);
    setActiveGrades({});
    setErrors((prev) => ({ ...prev, grades: undefined }));
  };

  const handleRemoveGrade = (id: string) => {
    setSelectedGrades(selectedGrades.filter((g) => g.id !== id));
  };

  const totalVolume = useMemo(() => {
    return selectedGrades.reduce((acc, curr) => {
      // For RST we consider the input as cubic meters (M³)
      // For Finished Products we consider it as pieces (Pcs).
      // Since they are technically different units, we just sum up the raw quantity values
      // requested by the user, and define it generally as "Total Volume / Kuantitas" in the UI.
      return acc + curr.quantity;
    }, 0);
  }, [selectedGrades]);

  const estimatedTotalPrice = useMemo(() => {
    return selectedGrades.reduce((acc, curr) => {
      return acc + curr.quantity * curr.basePrice;
    }, 0);
  }, [selectedGrades]);

  const handleSubmit = () => {
    let newErrors: typeof errors = {};

    if (!location.manager) newErrors.manager = "Wajib pilih Manager IK";
    if (!location.unit) newErrors.unit = "Wajib pilih Unit/TPK";
    if (selectedGrades.length === 0)
      newErrors.grades = "Wajib memasukkan minimal satu pesanan";
    if (!startDate) newErrors.startDate = "Wajib diisi";
    if (!endDate) newErrors.endDate = "Wajib diisi";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStep("offering");
  };

  return (
      <div className="min-h-screen bg-white">
        <Header location={location} setLocation={setLocation} />

        {/* Hero Section with Video Background */}
        <section
          className="relative min-h-[85vh] flex items-center justify-center pt-44 pb-24 px-4 overflow-hidden"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {/* Video Background Container */}
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover scale-105"
            >
              <source
                src="/Indonesian_Forest_Ranger_Documentary_Film.mp4"
                type="video/mp4"
              />
            </video>
            {/* Dark Sharp Overlay */}
            <div className="absolute inset-0 bg-black/70" />
            {/* Subtle Gradient for Extra Depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#1B4332]/30 via-transparent to-black/80" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-1000">
            <h1 className="text-4xl md:text-7xl font-bold text-white leading-tight">
              Mengelola Hasil Hutan Secara{" "}
              <span className="text-[#84cc16]">Berkelanjutan</span> <br />
              untuk Masa Depan Indonesia
            </h1>
            <p className="text-white/90 max-w-3xl mx-auto text-xl leading-relaxed font-normal">
              Menjamin ketersediaan bahan baku kayu industri secara profesional
              dan bertanggung jawab untuk mendukung pertumbuhan ekonomi nasional
              yang lestari melalui pengelolaan hutan yang presisi.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
              <Button
                className="w-full sm:w-auto bg-[#FF7A00] hover:bg-[#E66E00] text-white font-semibold px-8 h-[44px] rounded-full shadow-xl shadow-orange-950/20 transition-all active:scale-95 border-0"
                onClick={() => router.push("/contract/draft")}
              >
                Mulai Draf Kontrak
              </Button>
              <Button
                variant="outline"
                className="w-full sm:w-auto bg-transparent border-[#84cc16] text-[#84cc16] hover:bg-[#84cc16]/10 hover:border-[#84cc16] hover:text-[#84cc16] font-normal px-8 h-[44px] rounded-full transition-all flex items-center justify-center group"
              >
                Jelajahi Hutan Kami{" "}
                <ChevronRight className="ml-1 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </section>

        {/* Finished Product Showcase Section */}
        <section className="py-24 px-4 bg-[#FBFBFB]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1B4332] mb-4">
                Produk Olahan <span className="text-[#FF7A00]">(Finished Product)</span>
              </h2>
              <p className="text-gray-500 max-w-lg mx-auto">
                Pilihan produk kayu olahan siap pakai dengan standar kualitas tinggi untuk kebutuhan dekorasi dan konstruksi.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {finishedProducts.slice(0, 4).map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col rounded-xl border border-border bg-white overflow-hidden hover:shadow-md transition-all duration-300 group cursor-default"
                >
                  {/* Product Image Area */}
                  <div className="relative aspect-square bg-muted overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 backdrop-blur-sm text-[#40916C] font-bold text-[10px] px-2.5 py-1 rounded-full shadow-sm border border-white/50">
                        {item.woodType}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-[#40916C] text-white border-none font-bold text-[10px]">
                        Grade {item.grade}
                      </Badge>
                    </div>
                  </div>

                  {/* Product Info Area */}
                  <div className="flex flex-col gap-2 p-4">
                    <div>
                      <div className="flex items-center text-[10px] text-muted-foreground/60 mb-1 font-medium italic">
                        <span>{item.category}</span>
                        <span className="mx-1.5 opacity-40">/</span>
                        <span>{item.subCategory}</span>
                      </div>
                      <h3 className="text-sm font-bold text-[#1B4332] leading-tight group-hover:text-[#40916C] transition-colors line-clamp-2 min-h-[2.5rem]">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-2 text-[11px] text-muted-foreground">
                        <Ruler className="w-3.5 h-3.5 opacity-70" />
                        <span className="text-[#1B4332]/80 font-medium">
                          {item.dimensions}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 mt-auto flex items-center justify-between">
                      <div className="text-lg font-extrabold text-[#40916C]">
                        Rp {item.price.toLocaleString("id-ID")}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                        <Package className="w-3.5 h-3.5" />
                        <span>Stok: {item.stock}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* RST Product Showcase Section */}
        <section className="py-24 px-4 bg-white border-t border-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1B4332] mb-4">
                Kayu Gergajian <span className="text-[#FF7A00]">(Raw Sawn Timber)</span>
              </h2>
              <p className="text-gray-500 max-w-lg mx-auto">
                Bahan baku komponen kayu industri dengan spesifikasi teknis presisi untuk kebutuhan manufaktur Anda.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {rstData.slice(0, 4).map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-gray-100 p-6 hover:border-[#40916C]/30 hover:shadow-lg hover:shadow-green-900/5 transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <Badge className="bg-[#40916C]/10 text-[#40916C] border-0 text-[10px] font-semibold px-2 py-0.5">
                      {item.jenisKayu}
                    </Badge>
                    <span className="text-[10px] font-bold text-[#1B4332] opacity-30">
                      #{item.noKapling}
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-[#1B4332] line-clamp-1 group-hover:text-[#40916C] transition-colors">
                        {item.productType}
                      </h3>
                      <p className="text-[10px] font-medium text-muted-foreground uppercase mt-0.5">
                        {item.sortimen}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-y-3 pt-4 border-t border-gray-50">
                      <div>
                        <p className="text-[9px] font-semibold text-muted-foreground opacity-40 mb-1">Grade</p>
                        <p className="text-xs font-semibold text-[#1B4332]">Mutu {item.mutu}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-semibold text-muted-foreground opacity-40 mb-1">Volume</p>
                        <p className="text-xs font-semibold text-[#1B4332]">{item.volume.toFixed(3)} m³</p>
                      </div>
                      <div className="col-span-2 pt-2 border-t border-gray-50">
                        <p className="text-[9px] font-semibold text-muted-foreground opacity-40 mb-1">Estimasi Harga Akhir</p>
                        <p className="text-base font-extrabold text-[#40916C]">
                          Rp {item.hargaAkhir.toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 px-4 bg-[#F8FDF5] border-t border-[#E8F3E1]">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1B4332]">
                Frequently <span className="text-[#FF7A00]">Asked</span>{" "}
                Question
              </h2>
              <p className="text-gray-500">
                Pertanyaan yang sering diajukan mengenai prosedur kontrak dan
                pengadaan kayu industri.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "Siapa yang dapat mengajukan pembelian secara kontrak?",
                  a: "Pembelian secara kontrak diperuntukkan bagi pelanggan industri atau perusahaan dengan volume pembelian di atas 200 m³.",
                },
                {
                  q: "Apa langkah awal untuk menjadi pembeli kontrak?",
                  a: "Langkah pertama adalah melakukan registrasi melalui sistem POTP (Toko Perhutani) dan mengunggah dokumen legalitas perusahaan untuk verifikasi.",
                },
                {
                  q: "Dokumen legalitas apa saja yang wajib disiapkan?",
                  a: "Dokumen yang diperlukan antara lain KTP pimpinan, NPWP Perusahaan, NIB, serta Izin Usaha Industri Primer Hasil Hutan Kayu (PBPHH).",
                },
                {
                  q: "Bagaimana sistem pembayaran untuk transaksi kontrak?",
                  a: "Pembayaran dilakukan melalui sistem deposit jaminan yang disimpan di rekening KBM Pemasaran Perum Perhutani terkait sesuai kesepakatan kontrak.",
                },
                {
                  q: "Kapan kayu dapat diambil setelah transaksi selesai?",
                  a: "Kayu dapat diambil di TPK yang ditentukan paling cepat H+1 setelah penerbitan kuitansi/invoice resmi, dengan mendaftarkan rencana angkutan melalui SIPUHH.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white border border-[#E8F3E1] rounded-xl overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() =>
                      setOpenFaqIndex(openFaqIndex === i ? null : i)
                    }
                    className="w-full flex items-center justify-between p-6 bg-white hover:bg-[#F0F7ED] transition-colors text-left group"
                  >
                    <span className="font-semibold text-[#1B4332] text-sm">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 text-[#40916C]/40 transition-transform duration-300",
                        openFaqIndex === i && "rotate-180 text-[#40916C]",
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300",
                      openFaqIndex === i ? "max-h-96" : "max-h-0",
                    )}
                  >
                    <div className="p-6 pt-0 text-sm text-gray-500 leading-relaxed border-t border-[#E8F3E1] bg-white">
                      {item.a}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
}
