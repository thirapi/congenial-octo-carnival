"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/timber/header";
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
  "GM KBM IK": {
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
  const [step, setStep] = useState<Step>("form");
  const [showLogs, setShowLogs] = useState(false);
  const [location, setLocation] = useState<LocationData>({
    wilayah: "GM KBM IK",
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
    <div className="min-h-screen bg-[#FBFBFB]">
      <Header location={location} setLocation={setLocation} />

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-[#1B4332] mb-1">Kontrak</h1>
          <p className="text-sm text-muted-foreground font-medium">
            Layanan pengadaan kayu melalui sistem kontrak.
          </p>
        </div>

        {/* Navigation Stepper - Aligned with checkout step style */}
        <div className="flex flex-wrap items-center gap-6 mb-12 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <button
            onClick={() => setStep("form")}
            className={cn(
              "flex items-center gap-3 transition-opacity",
              step !== "form" && "opacity-40",
            )}
          >
            <div className="w-8 h-8 rounded-full bg-[#40916C]/10 flex items-center justify-center text-[#40916C] font-semibold text-sm">
              1
            </div>
            <span className="text-sm font-medium text-[#1B4332]">
              Form Permohonan Kontrak
            </span>
          </button>

          <ChevronRight className="w-4 h-4 text-gray-200" />

          <button
            disabled={selectedGrades.length === 0}
            onClick={() => setStep("offering")}
            className={cn(
              "flex items-center gap-3 transition-opacity",
              step !== "offering" && "opacity-40",
            )}
          >
            <div className="w-8 h-8 rounded-full bg-[#40916C]/10 flex items-center justify-center text-[#40916C] font-semibold text-sm">
              2
            </div>
            <span className="text-sm font-medium text-[#1B4332]">
              Penawaran Harga Permintaan Kontrak
            </span>
          </button>

          <ChevronRight className="w-4 h-4 text-gray-200" />

          <button
            onClick={() => setStep("active")}
            className={cn(
              "flex items-center gap-3 transition-opacity",
              step !== "active" && "opacity-40",
            )}
          >
            <div className="w-8 h-8 rounded-full bg-[#40916C]/10 flex items-center justify-center text-[#40916C] font-semibold text-sm">
              3
            </div>
            <span className="text-sm font-medium text-[#1B4332]">
              Kontrak Khusus Aktif
            </span>
          </button>
        </div>

        {step === "form" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Selections Section - Simplified Native Style */}
              <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Jenis Kayu */}
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-2">
                      Jenis Kayu
                    </label>
                    <select
                      value={woodType}
                      onChange={(e) => setWoodType(e.target.value as WoodType)}
                      className="w-full rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm text-[#1B4332] hover:border-[#40916C] focus:border-[#40916C] focus:outline-none transition-all cursor-pointer shadow-sm appearance-none"
                    >
                      <option value="">-- Pilih Jenis Kayu --</option>
                      <option value="Jati">Kayu Jati</option>
                      <option value="Rimba">Kayu Rimba</option>
                    </select>
                  </div>

                  {/* Manager IK */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-semibold text-muted-foreground">
                        Manager IK
                      </label>
                      {errors.manager && (
                        <span className="text-[10px] font-semibold text-red-500">
                          {errors.manager}
                        </span>
                      )}
                    </div>
                    <select
                      value={location.manager || ""}
                      onChange={(e) => {
                        setLocation({
                          ...location,
                          manager: e.target.value,
                          unit: null,
                        });
                        setErrors((prev) => ({ ...prev, manager: undefined }));
                      }}
                      disabled={!woodType}
                      className={cn(
                        "w-full rounded-xl border bg-white px-4 py-3 text-sm hover:border-[#40916C] focus:border-[#40916C] focus:outline-none transition-all cursor-pointer shadow-sm appearance-none disabled:bg-gray-50 disabled:cursor-not-allowed",
                        errors.manager
                          ? "border-red-500"
                          : "border-gray-100 text-[#1B4332]",
                      )}
                    >
                      <option value="">-- Pilih Manager --</option>
                      {Object.keys(cascadeData["GM KBM IK"]).map((mgr) => (
                        <option key={mgr} value={mgr}>
                          {mgr}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Unit / TPK */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-semibold text-muted-foreground">
                        Unit / TPK
                      </label>
                      {errors.unit && (
                        <span className="text-[10px] font-semibold text-red-500">
                          {errors.unit}
                        </span>
                      )}
                    </div>
                    <select
                      value={location.unit || ""}
                      onChange={(e) => {
                        setLocation({ ...location, unit: e.target.value });
                        setErrors((prev) => ({ ...prev, unit: undefined }));
                      }}
                      disabled={!location.manager}
                      className={cn(
                        "w-full rounded-xl border bg-white px-4 py-3 text-sm hover:border-[#40916C] focus:border-[#40916C] focus:outline-none transition-all cursor-pointer shadow-sm appearance-none disabled:bg-gray-50 disabled:cursor-not-allowed",
                        errors.unit
                          ? "border-red-500"
                          : "border-gray-100 text-[#1B4332]",
                      )}
                    >
                      <option value="">-- Pilih Unit --</option>
                      {location.manager &&
                        cascadeData["GM KBM IK"][
                          location.manager as keyof (typeof cascadeData)["GM KBM IK"]
                        ].map((unit) => (
                          <option key={unit} value={unit}>
                            {unit}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Sortimen Selection Section */}
              <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product Type */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-muted-foreground mb-2">
                      Tipe Produk
                    </label>
                    <select
                      className="w-full rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm text-[#1B4332] shadow-sm hover:border-[#40916C] focus:border-[#40916C] focus:outline-none appearance-none transition-all cursor-pointer"
                      value={typeForm}
                      onChange={(e) => {
                        setTypeForm(e.target.value as any);
                        setCatForm("");
                        setSubCatForm("");
                        setProductNameForm("");
                        setActiveGrades({});
                      }}
                    >
                      <option value="">-- Pilih Tipe Produk --</option>
                      <option value="rst">Raw Sawn Timber (RST)</option>
                      <option value="finished">Finished Product</option>
                    </select>
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-muted-foreground mb-2">
                      Kategori
                    </label>
                    <select
                      className="w-full rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm text-[#1B4332] shadow-sm hover:border-[#40916C] focus:border-[#40916C] focus:outline-none appearance-none transition-all cursor-pointer disabled:bg-gray-50 disabled:cursor-not-allowed"
                      disabled={!typeForm}
                      value={catForm}
                      onChange={(e) => {
                        setCatForm(e.target.value);
                        setSubCatForm("");
                        setProductNameForm("");
                        setActiveGrades({});
                      }}
                    >
                      <option value="">-- Pilih Kategori --</option>
                      {typeForm === "rst" &&
                        rstCategories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      {typeForm === "finished" &&
                        fpCategories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Sub Category (Finished Only) */}
                  {typeForm === "finished" && (
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-muted-foreground mb-2">
                        Sub-Kategori
                      </label>
                      <select
                        className="w-full rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm text-[#1B4332] shadow-sm hover:border-[#40916C] focus:border-[#40916C] focus:outline-none appearance-none transition-all cursor-pointer disabled:bg-gray-50 disabled:cursor-not-allowed"
                        disabled={!catForm}
                        value={subCatForm}
                        onChange={(e) => {
                          setSubCatForm(e.target.value);
                          setProductNameForm("");
                          setActiveGrades({});
                        }}
                      >
                        <option value="">-- Pilih Sub-Kategori --</option>
                        {catForm &&
                          fpSubcats.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}

                  {/* Product Name (Finished Only) */}
                  {typeForm === "finished" && (
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-muted-foreground mb-2">
                        Nama Produk
                      </label>
                      <select
                        className="w-full rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm text-[#1B4332] shadow-sm hover:border-[#40916C] focus:border-[#40916C] focus:outline-none appearance-none transition-all cursor-pointer disabled:bg-gray-50 disabled:cursor-not-allowed"
                        disabled={!subCatForm}
                        value={productNameForm}
                        onChange={(e) => {
                          setProductNameForm(e.target.value);
                          setActiveGrades({});
                        }}
                      >
                        <option value="">-- Pilih Produk --</option>
                        {fpProductNames.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Variables for Checkbox Selection Grid */}
                  {catForm && (typeForm !== "finished" || productNameForm) && (
                    <div className="col-span-1 md:col-span-2 space-y-4 pt-4 border-t border-gray-100 mt-2">
                      <label className="block text-xs font-semibold text-muted-foreground mb-2">
                        Pilih Mutu / Grade & Kuantitas (
                        {typeForm === "rst" ? "M³" : "Pcs"})
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {(typeForm === "rst"
                          ? availableRstMutu
                          : availableFpGrades
                        ).map((m) => {
                          const isSelected = activeGrades[m.code] !== undefined;
                          return (
                            <div
                              key={m.code}
                              className={cn(
                                "flex items-center justify-between p-4 rounded-xl border transition-all",
                                isSelected
                                  ? "bg-[#F8FDF5] border-[#40916C]/30 shadow-sm"
                                  : "bg-white border-gray-100",
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <Checkbox
                                  id={`grade-${m.code}`}
                                  checked={isSelected}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setActiveGrades((prev) => ({
                                        ...prev,
                                        [m.code]: 1,
                                      }));
                                    } else {
                                      const next = { ...activeGrades };
                                      delete next[m.code];
                                      setActiveGrades(next);
                                    }
                                  }}
                                />
                                <Label
                                  htmlFor={`grade-${m.code}`}
                                  className="text-sm font-semibold text-[#1B4332] cursor-pointer"
                                >
                                  {m.name}
                                </Label>
                              </div>
                              {isSelected && (
                                <div className="flex items-center gap-2 animate-in fade-in zoom-in slide-in-from-left-2 duration-200">
                                  <Input
                                    type="number"
                                    min="1"
                                    step={typeForm === "rst" ? "0.01" : "1"}
                                    className="w-20 h-9 text-right font-semibold text-xs border-gray-100 rounded-lg focus:border-[#40916C] shadow-sm"
                                    value={activeGrades[m.code]}
                                    onChange={(e) => {
                                      let val: string | number = e.target.value;
                                      if (val !== "") {
                                        val =
                                          typeForm === "rst"
                                            ? parseFloat(val)
                                            : parseInt(val);
                                        if (isNaN(val)) val = "";
                                      }
                                      setActiveGrades((prev) => ({
                                        ...prev,
                                        [m.code]: val,
                                      }));
                                    }}
                                  />
                                  <span className="text-xs font-semibold text-muted-foreground mr-1">
                                    {typeForm === "rst" ? "M³" : "Pcs"}
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Submit Button */}
                      <div className="flex justify-end pt-2">
                        <Button
                          type="button"
                          disabled={
                            Object.values(activeGrades).filter(
                              (v) => Number(v) > 0,
                            ).length === 0
                          }
                          onClick={handleAddGrade}
                          className="w-full md:w-auto rounded-xl bg-[#40916C] hover:bg-[#2D6A4F] text-white font-semibold h-[46px] px-8 shadow-sm transition-all"
                        >
                          + Masukkan ke Daftar Pesanan
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* List of picked items */}
                {(selectedGrades.length > 0 || errors.grades) && (
                  <div className="space-y-4 pt-8 mt-8 border-t border-gray-50">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-[#1B4332] uppercase">
                        Daftar Pesanan Sortimen
                      </h4>
                      {errors.grades && (
                        <span className="text-red-500 font-semibold text-[10px] bg-red-50 px-2 py-1 rounded-md">
                          {errors.grades}
                        </span>
                      )}
                    </div>
                    {selectedGrades.length > 0 && (
                      <div className="space-y-3">
                        {selectedGrades.map((g) => (
                          <div
                            key={g.id}
                            className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-5 bg-[#FBFDFB] border border-gray-100 rounded-xl shadow-sm"
                          >
                            <div>
                              <p className="text-sm font-semibold text-[#1B4332]">
                                {g.name}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {g.type === "rst"
                                  ? "Raw Sawn Timber"
                                  : "Finished Product"}{" "}
                                • {woodType}
                              </p>
                            </div>
                            <div className="flex items-center gap-6 justify-between sm:justify-end">
                              <div className="text-right">
                                <p className="text-base font-semibold text-[#1B4332]">
                                  {g.quantity}{" "}
                                  <span className="text-xs opacity-60 font-medium">
                                    {g.type === "rst" ? "M³" : "Pcs"}
                                  </span>
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveGrade(g.id)}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 h-9 px-4 rounded-lg font-medium text-xs"
                              >
                                Hapus
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Execution */}
            <div className="space-y-6 lg:sticky lg:top-10">
              <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm flex flex-col gap-8">
                <div>
                  <h2 className="text-lg font-bold text-[#1B4332] mb-1">
                    Ringkasan Kontrak
                  </h2>
                  <p className="text-xs text-muted-foreground font-medium">
                    Estimasi total nilai dasar & volume pesanan Anda.
                  </p>
                </div>

                <div className="space-y-4 bg-[#F8FDF5] p-5 rounded-xl border border-[#E8F3E1]">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-semibold text-muted-foreground">
                      Total Volume / Kuantitas
                    </span>
                    <span className="text-2xl font-bold text-[#1B4332] leading-none tracking-tight">
                      {totalVolume.toFixed(2)}{" "}
                      <span className="text-sm font-semibold opacity-50">
                        m³ / pcs
                      </span>
                    </span>
                  </div>
                  <div className="h-px bg-[#E8F3E1] w-full my-4" />
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-muted-foreground">
                      Est. Nilai Dasar
                    </span>
                    <span className="text-xl font-bold text-[#1B4332] tracking-tight">
                      Rp {estimatedTotalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-5 pt-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-semibold text-muted-foreground">
                        Mulai Kontrak
                      </label>
                      {errors.startDate && (
                        <span className="text-[10px] font-semibold text-red-500">
                          {errors.startDate}
                        </span>
                      )}
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start px-4 py-3 h-[46px] rounded-xl border bg-white text-sm font-semibold text-[#1B4332] shadow-sm hover:border-[#40916C] focus:border-[#40916C] transition-all",
                            errors.startDate
                              ? "border-red-500"
                              : "border-gray-100",
                          )}
                        >
                          <CalendarIcon
                            className={cn(
                              "mr-3 h-4 w-4",
                              errors.startDate
                                ? "text-red-500"
                                : "opacity-50 text-[#1B4332]",
                            )}
                          />
                          {startDate
                            ? format(startDate, "dd MMM yyyy")
                            : "Pilih Tanggal"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-2xl border-gray-100 shadow-xl">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={(v) => {
                            setStartDate(v);
                            setErrors((prev) => ({
                              ...prev,
                              startDate: undefined,
                            }));
                          }}
                          initialFocus
                          className="rounded-2xl"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-semibold text-muted-foreground">
                        Selesai Kontrak
                      </label>
                      {errors.endDate && (
                        <span className="text-[10px] font-semibold text-red-500">
                          {errors.endDate}
                        </span>
                      )}
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start px-4 py-3 h-[46px] rounded-xl border bg-white text-sm font-semibold text-[#1B4332] shadow-sm hover:border-[#40916C] focus:border-[#40916C] transition-all",
                            errors.endDate
                              ? "border-red-500"
                              : "border-gray-100",
                          )}
                        >
                          <CalendarIcon
                            className={cn(
                              "mr-3 h-4 w-4",
                              errors.endDate
                                ? "text-red-500"
                                : "opacity-50 text-[#1B4332]",
                            )}
                          />
                          {endDate
                            ? format(endDate, "dd MMM yyyy")
                            : "Pilih Tanggal"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-2xl border-gray-100 shadow-xl">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={(v) => {
                            setEndDate(v);
                            setErrors((prev) => ({
                              ...prev,
                              endDate: undefined,
                            }));
                          }}
                          initialFocus
                          className="rounded-2xl"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* <div className="bg-orange-50 rounded-xl p-4 border border-orange-100 flex gap-3">
                  <Info className="w-5 h-5 text-orange-600 shrink-0" />
                  <p className="text-xs text-orange-800 leading-relaxed font-medium">
                    Setelah pengiriman form, unit kerja akan melakukan
                    verifikasi stok fisik dan ketersediaan logistik di TPK yang
                    Anda pilih di atas.
                  </p>
                </div> */}

                <Button
                  onClick={handleSubmit}
                  className="w-full rounded-xl bg-[#40916C] hover:bg-[#2D6A4F] text-white font-semibold h-[52px] shadow-sm transition-all text-sm mt-4"
                >
                  Kirim Pesanan Kontrak
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === "offering" && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
            <Card className="rounded-2xl border-gray-100 shadow-sm overflow-hidden p-8 md:p-12">
              <div className="flex flex-col md:flex-row justify-between items-start mb-12 border-b border-gray-50 pb-8 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-[#40916C] text-white border-0 font-semibold text-[9px] uppercase">
                      Permohonan Aktif
                    </Badge>
                    <span className="text-[10px] text-muted-foreground font-medium uppercase opacity-30">
                      #9122-2024
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-[#1B4332]">
                    Draf Penawaran Harga
                  </h2>
                  <p className="text-xs text-muted-foreground font-medium mt-1">
                    Diajukan pada {format(new Date(), "dd MMMM yyyy")}
                  </p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 opacity-40">
                    Lokasi Penawaran
                  </p>
                  <p className="font-bold text-[#1B4332] text-sm uppercase">
                    {location.unit} – {location.manager}
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <table className="w-full">
                  <thead className="text-left border-b border-gray-100">
                    <tr>
                      <th className="pb-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        Sortimen Item
                      </th>
                      <th className="pb-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">
                        Jumlah
                      </th>
                      <th className="pb-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">
                        Total Dasar
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {selectedGrades.map((grade) => {
                      const total = grade.quantity * grade.basePrice;
                      return (
                        <tr key={grade.id}>
                          <td className="py-6">
                            <p className="font-bold text-[#1B4332] text-[15px]">
                              {grade.name}
                            </p>
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest opacity-40 mt-1">
                              {woodType} Timber Grade
                            </p>
                          </td>
                          <td className="py-6 text-center text-sm font-black text-[#1B4332]">
                            {grade.quantity}{" "}
                            {grade.type === "rst" ? "M³" : "Pcs"}
                          </td>
                          <td className="py-6 text-right font-semibold text-[#1B4332]">
                            Rp {total.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div className="bg-[#FBFDFB] rounded-2xl p-8 space-y-4 border border-gray-50 shadow-inner">
                  <div className="flex justify-between items-center text-sm font-semibold text-[#1B4332]/60 uppercase">
                    <span className="text-[10px]">Subtotal DPP</span>
                    <span>Rp {estimatedTotalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-semibold text-[#1B4332]/60 uppercase">
                    <span className="text-[10px]">PPN 11%</span>
                    <span>
                      Rp {(estimatedTotalPrice * 0.11).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-5 border-t border-dashed border-gray-200">
                    <span className="text-lg font-semibold text-[#1B4332] uppercase tracking-tight">
                      Total Nilai Kontrak
                    </span>
                    <span className="text-2xl font-semibold text-[#1B4332] tracking-tighter">
                      Rp {(estimatedTotalPrice * 1.11).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button
                    className="flex-1 bg-[#1B4332] hover:bg-[#2D6A4F] text-white h-14 rounded-xl font-black text-sm shadow-xl shadow-green-900/10"
                    onClick={() => setStep("active")}
                  >
                    Konfirmasi & Aktifkan Kontrak
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-gray-200 h-14 rounded-xl font-bold text-sm text-[#1B4332]"
                  >
                    <Download className="w-4 h-4 mr-2 opacity-40" />
                    Cetak Draf Penawaran (.pdf)
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {step === "active" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
            {/* Active Header - Simple & Clean */}
            <div className="bg-[#1B4332] rounded-2xl p-8 md:p-12 text-white flex flex-col md:flex-row justify-between items-end gap-10">
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full w-fit">
                  <div className="w-2 h-2 rounded-full bg-[#40916C] animate-pulse" />
                  <span className="text-[9px] font-semibold uppercase opacity-80">
                    Monitoring Live
                  </span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold tracking-tight leading-none uppercase">
                    Dashboard Kontrak
                  </h2>
                  <p className="text-sm font-medium opacity-60 mt-2 max-w-md">
                    Pantau realisasi volume pengambilan kayu industrial untuk
                    setiap kontrak yang berjalan.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex-1 md:w-36 text-center">
                  <p className="text-[9px] font-semibold uppercase opacity-30 mb-1">
                    Berjalan
                  </p>
                  <p className="text-3xl font-semibold italic tracking-tighter">
                    02
                  </p>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex-1 md:w-44 text-center">
                  <p className="text-[9px] font-semibold uppercase opacity-30 mb-1">
                    Outstanding
                  </p>
                  <p className="text-3xl font-semibold italic tracking-tighter">
                    412{" "}
                    <span className="text-xs font-medium opacity-40">m³</span>
                  </p>
                </div>
              </div>
            </div>

            <Card className="rounded-2xl border-gray-100 shadow-sm overflow-hidden bg-white">
              <div className="flex flex-col lg:flex-row min-h-[400px]">
                <div className="p-10 lg:w-[45%] bg-[#FBFDFB] border-r border-gray-50 flex flex-col justify-between">
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <Badge className="bg-[#40916C]/10 text-[#40916C] border-0 text-[9px] font-bold px-3">
                        VERIFIED
                      </Badge>
                      <h3 className="text-3xl font-bold text-[#1B4332] tracking-tighter uppercase leading-none">
                        CTR-IND-24-99X
                      </h3>
                      <p className="text-[11px] font-semibold text-[#1B4332]/40 uppercase">
                        Jati Utama – PIK GRESIK
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-1">
                        <p className="text-[9px] font-semibold text-muted-foreground uppercase opacity-40">
                          Masa Kontrak
                        </p>
                        <p className="text-xs font-semibold text-[#1B4332]">
                          2024 — 2025
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] font-semibold text-muted-foreground uppercase opacity-40">
                          Alokasi Per Bulan
                        </p>
                        <div className="flex items-center gap-1 font-semibold text-[#1B4332]">
                          <TrendingUp className="w-3 h-3 text-[#40916C]" />
                          120 m³
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-12 bg-white p-4 rounded-xl border border-gray-50">
                    <Button
                      className="flex-1 bg-[#1B4332] hover:bg-[#2D6A4F] text-white h-14 rounded-xl font-semibold text-xs uppercase"
                      onClick={() => setShowLogs(true)}
                    >
                      <FileSearch className="w-4 h-4 mr-2" />
                      Log Realisasi
                    </Button>
                    <Button
                      variant="outline"
                      className="w-14 h-14 rounded-xl border-gray-100 flex items-center justify-center hover:bg-gray-50 shadow-sm"
                    >
                      <Download className="w-5 h-5 text-[#1B4332] opacity-40" />
                    </Button>
                  </div>
                </div>

                <div className="p-10 flex-1 flex flex-col justify-center space-y-10">
                  <div className="flex justify-between items-end border-b border-gray-50 pb-8">
                    <div className="space-y-1">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase opacity-40">
                        Total Progress Realisasi
                      </p>
                      <h4 className="text-4xl font-semibold text-[#1B4332] tracking-tighter">
                        72.4%
                      </h4>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100">
                      <Truck className="w-7 h-7 text-[#1B4332] opacity-20" />
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-3">
                      <div className="flex justify-between text-[11px] font-semibold text-[#1B4332] uppercase px-1">
                        <span>Grade A (Mutu Utama)</span>
                        <span className="opacity-40">432 / 600 m³</span>
                      </div>
                      <div className="h-2.5 w-full bg-gray-50 rounded-full overflow-hidden p-0.5 border border-gray-100 shadow-inner">
                        <div
                          className="h-full bg-gradient-to-r from-[#1B4332] to-[#40916C] rounded-full transition-all duration-1000"
                          style={{ width: "72%" }}
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-[11px] font-bold text-[#CC3F0C] uppercase tracking-wide px-1">
                        <span>Grade B (Mutu Pertama)</span>
                        <span className="opacity-40">88 / 200 m³</span>
                      </div>
                      <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden p-0.5 border border-gray-100 shadow-inner">
                        <div
                          className="h-full bg-gradient-to-r from-[#CC3F0C] to-[#E85D04] rounded-full transition-all duration-1000"
                          style={{ width: "44%" }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-6 border-t border-dashed border-gray-100">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    <p className="text-[10px] font-semibold text-muted-foreground italic uppercase opacity-50">
                      Data diperbarui otomatis setiap pengambilan Surat Jalan di
                      TPK.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex justify-center pb-12">
              <Button
                variant="outline"
                className="rounded-full px-12 h-14 border-gray-200 font-semibold text-xs text-[#1B4332] transition-all hover:bg-white shadow-sm"
                onClick={() => setStep("form")}
              >
                + Buat Kontrak Baru
              </Button>
            </div>
          </div>
        )}

        {/* Unified Realisasi Log Dialog */}
        <Dialog open={showLogs} onOpenChange={setShowLogs}>
          <DialogContent className="max-w-4xl p-0 rounded-2xl border-0 overflow-hidden shadow-2xl">
            <DialogHeader className="bg-[#1B4332] p-10 text-white space-y-2">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="inline-flex px-3 py-1 bg-white/10 rounded-full text-[9px] font-semibold uppercase">
                    Logs History
                  </div>
                  <DialogTitle className="text-3xl font-bold uppercase tracking-tight">
                    Detail Realisasi Pasokan
                  </DialogTitle>
                </div>
                <Truck className="w-10 h-10 opacity-20" />
              </div>
            </DialogHeader>
            <div className="max-h-[50vh] overflow-y-auto">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-white border-b border-gray-100">
                  <tr className="bg-gray-50">
                    <th className="px-10 py-5 text-[10px] font-semibold text-muted-foreground uppercase italic">
                      No. Surat Jalan
                    </th>
                    <th className="px-6 py-5 text-[10px] font-semibold text-muted-foreground uppercase italic">
                      Sortimen
                    </th>
                    <th className="px-6 py-5 text-[10px] font-semibold text-muted-foreground uppercase italic text-center">
                      Volume
                    </th>
                    <th className="px-10 py-5 text-[10px] font-semibold text-muted-foreground uppercase italic text-right">
                      Driver/Truck
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {MOCK_DELIVERY_LOGS.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-[#FBFDFB] transition-colors group"
                    >
                      <td className="px-10 py-6">
                        <p className="font-semibold text-[#1B4332] text-sm">
                          {log.id}
                        </p>
                        <p className="text-[9px] font-semibold text-muted-foreground mt-0.5 italic">
                          {format(new Date(log.date), "dd MMM yyyy")}
                        </p>
                      </td>
                      <td className="px-6 py-6 font-semibold text-[#1B4332] text-[13px]">
                        {log.item}
                      </td>
                      <td className="px-6 py-6 text-center">
                        <Badge className="bg-[#1B4332]/5 text-[#1B4332] border-0 font-semibold text-[11px] px-2">
                          {log.volume} m³
                        </Badge>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <p className="text-xs font-semibold text-[#1B4332] uppercase">
                          {log.driver}
                        </p>
                        <p className="text-[9px] font-semibold text-muted-foreground opacity-40 mt-0.5">
                          {log.vehicleNo}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-10 bg-gray-50/50 border-t border-gray-100 flex justify-end">
              <Button
                onClick={() => setShowLogs(false)}
                className="bg-[#1B4332] h-14 px-12 rounded-xl font-semibold uppercase text-xs transition-transform active:scale-95 shadow-lg shadow-green-900/10"
              >
                Tutup Log
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
