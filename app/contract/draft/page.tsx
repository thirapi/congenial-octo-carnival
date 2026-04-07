"use client";

import { useState, useMemo, useRef } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { FileText, UploadCloud, X } from "lucide-react";

const cascadeData = {
  "GM KBM IK": {
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

interface RequestedGrade {
  id: string;
  name: string;
  type: "rst" | "finished" | "custom";
  category: string;
  subCategory?: string;
  grade: string;
  basePrice: number;
  quantity: number;
  detail: string;
  files: File[];
}

export default function DraftContractPage() {
  const [location, setLocation] = useState<LocationData>({
    wilayah: "GM KBM IK",
    manager: null,
    unit: null,
  });
  const [woodType, setWoodType] = useState<WoodType>("Jati");
  const [selectedGrades, setSelectedGrades] = useState<RequestedGrade[]>([]);
  const [errors, setErrors] = useState<{
    unit?: string;
    manager?: string;
    grades?: string;
  }>({});

  // typeForm: "rst" | "finished" | "custom" | ""
  const [typeForm, setTypeForm] = useState<"rst" | "finished" | "custom" | "">("");
  const [catForm, setCatForm] = useState("");
  const [subCatForm, setSubCatForm] = useState("");
  const [activeGrades, setActiveGrades] = useState<Record<string, number | string>>({});
  const [productNameForm, setProductNameForm] = useState("");

  const rstCategories = useMemo(() => RST_PRODUCT_TYPES_ARRAY, []);
  const fpCategories = useMemo(() => FINISHED_CATEGORIES_ARRAY, []);

  const fpSubcats = useMemo(() => {
    if (typeForm !== "finished" || !catForm) return [];
    const list = finishedProducts.filter((d) => d.category === catForm).map((d) => d.subCategory);
    return Array.from(new Set(list));
  }, [typeForm, catForm]);

  const fpProductNames = useMemo(() => {
    if (typeForm !== "finished" || !subCatForm) return [];
    const list = finishedProducts
      .filter((d) => d.category === catForm && d.subCategory === subCatForm)
      .map((d) => d.name);
    return Array.from(new Set(list));
  }, [typeForm, catForm, subCatForm]);

  const availableRstMutu = useMemo(() => {
    if (typeForm !== "rst" || !catForm) return [];
    const ref = rstData.find((d) => d.productType === catForm);
    const baseP = ref?.hargaAkhir || 10000000;
    return [
      { code: "U", name: "Mutu Utama (U)", price: baseP * 1.5 },
      { code: "P", name: "Mutu Pertama (P)", price: baseP * 1.2 },
      { code: "D", name: "Mutu Dua (D)", price: baseP },
      { code: "T", name: "Mutu Tiga (T)", price: baseP * 0.8 },
    ];
  }, [typeForm, catForm]);

  const availableFpGrades = useMemo(() => {
    if (typeForm !== "finished" || !productNameForm) return [];
    const ref = finishedProducts.find((d) => d.name === productNameForm);
    const baseP = ref?.price || 5000000;
    return [
      { code: "A", name: "Grade A", price: baseP * 1.2 },
      { code: "B", name: "Grade B", price: baseP },
      { code: "C", name: "Grade C", price: baseP * 0.8 },
    ];
  }, [typeForm, productNameForm]);

  const handleAddGrade = () => {
    if (!typeForm || typeForm === "custom") return;
    if (!catForm) return;
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
        const displayName = typeForm === "finished" ? productNameForm : catForm;
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
        newSelected.unshift({
          id,
          type: typeForm as "rst" | "finished",
          category: catForm,
          subCategory: subCatForm,
          grade: gradeCode,
          name: `${displayName} (${gradeName})`,
          quantity: qty,
          basePrice,
          detail: "",
          files: [],
        });
      }
    });

    setSelectedGrades(newSelected);
    setActiveGrades({});
    setErrors((prev) => ({ ...prev, grades: undefined }));
  };

  const handleAddCustom = () => {
    const newSelected = [...selectedGrades];
    newSelected.unshift({
      id: `custom-${Date.now()}`,
      type: "custom",
      category: "Permintaan Khusus",
      grade: "-",
      name: "Produk Custom",
      quantity: 1, // Default quantity for custom
      basePrice: 0,
      detail: "",
      files: [],
    });
    setSelectedGrades(newSelected);
    setErrors((prev) => ({ ...prev, grades: undefined }));
    setTypeForm("");
  };

  const handleRemoveGrade = (id: string) => {
    setSelectedGrades(selectedGrades.filter((g) => g.id !== id));
  };

  const handleItemDetailChange = (id: string, detail: string) => {
    setSelectedGrades((prev) =>
      prev.map((g) => (g.id === id ? { ...g, detail } : g))
    );
  };

  const handleItemFilesChange = (id: string, newFiles: FileList | null) => {
    if (!newFiles) return;
    const filesArray = Array.from(newFiles);
    setSelectedGrades((prev) =>
      prev.map((g) => (g.id === id ? { ...g, files: [...g.files, ...filesArray] } : g))
    );
  };

  const handleItemRemoveFile = (id: string, fileIndex: number) => {
    setSelectedGrades((prev) =>
      prev.map((g) =>
        g.id === id
          ? { ...g, files: g.files.filter((_, i) => i !== fileIndex) }
          : g
      )
    );
  };

  // Submit logic updates to check if detail per item is filled
  const canSubmit =
    location.manager !== null &&
    location.unit !== null &&
    selectedGrades.length > 0 &&
    selectedGrades.every((g) => g.detail.trim() !== "");

  const handleSubmit = () => {
    const newErrors: typeof errors = {};
    if (!location.manager) newErrors.manager = "Wajib pilih Wilayah";
    if (!location.unit) newErrors.unit = "Wajib pilih Unit/TPK";
    if (selectedGrades.length === 0) newErrors.grades = "Wajib memasukkan minimal satu pesanan";
    
    // Check if any items are missing detail
    const missingDetails = selectedGrades.some((g) => !g.detail.trim());
    if (missingDetails && selectedGrades.length > 0) {
      newErrors.grades = "Detail permintaan wajib diisi untuk semua pesanan di daftar";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    alert("Draft kontrak berhasil ditambahkan!");
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB]">
      <Header location={location} setLocation={setLocation} />

      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-[#1B4332] mb-1">Form Permohonan Kontrak</h1>
          <p className="text-sm text-muted-foreground">
            Isi detail sortimen kayu yang ingin Anda ajukan sebagai kontrak pengadaan.
          </p>
        </div>

        <div className="space-y-6">

          {/* ── 1. Lokasi & Jenis Kayu ── */}
          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Jenis Kayu */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-2">Jenis Kayu</label>
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

              {/* Wilayah */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-muted-foreground">Wilayah</label>
                  {errors.manager && <span className="text-[10px] font-semibold text-red-500">{errors.manager}</span>}
                </div>
                <select
                  value={location.manager || ""}
                  onChange={(e) => {
                    setLocation({ ...location, manager: e.target.value, unit: null });
                    setErrors((prev) => ({ ...prev, manager: undefined }));
                  }}
                  disabled={!woodType}
                  className={cn(
                    "w-full rounded-xl border bg-white px-4 py-3 text-sm hover:border-[#40916C] focus:border-[#40916C] focus:outline-none transition-all cursor-pointer shadow-sm appearance-none disabled:bg-gray-50 disabled:cursor-not-allowed",
                    errors.manager ? "border-red-500" : "border-gray-100 text-[#1B4332]"
                  )}
                >
                  <option value="">-- Pilih Wilayah --</option>
                  {Object.keys(cascadeData["GM KBM IK"]).map((mgr) => (
                    <option key={mgr} value={mgr}>{mgr}</option>
                  ))}
                </select>
              </div>

              {/* Unit / TPK */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-muted-foreground">Unit / TPK</label>
                  {errors.unit && <span className="text-[10px] font-semibold text-red-500">{errors.unit}</span>}
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
                    errors.unit ? "border-red-500" : "border-gray-100 text-[#1B4332]"
                  )}
                >
                  <option value="">-- Pilih Unit --</option>
                  {location.manager &&
                    ((cascadeData["GM KBM IK"] as Record<string, string[]>)[location.manager] ?? []).map((unit) => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          {/* ── 2. Sortimen Selection ── */}
          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-50">
              <h2 className="text-sm font-bold text-[#1B4332] uppercase tracking-wide">Pilih Sortimen</h2>
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => {
                  setTypeForm("");
                  setCatForm("");
                  setSubCatForm("");
                  setProductNameForm("");
                  setActiveGrades({});
                }}
                className="text-muted-foreground hover:text-red-500 hover:bg-red-50 h-8 px-3 rounded-lg text-xs font-semibold disabled:opacity-50"
                disabled={!typeForm}
              >
                Reset Pilihan
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Tipe Produk */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-2">Tipe Produk</label>
                <select
                  value={typeForm}
                  disabled={!location.unit}
                  onChange={(e) => {
                    setTypeForm(e.target.value as any);
                    setCatForm(""); setSubCatForm(""); setProductNameForm(""); setActiveGrades({});
                  }}
                  className={cn(
                    "w-full rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm text-[#1B4332] shadow-sm hover:border-[#40916C] focus:border-[#40916C] focus:outline-none appearance-none transition-all cursor-pointer",
                    "disabled:bg-gray-50 disabled:cursor-not-allowed"
                  )}
                >
                  <option value="">-- Pilih Tipe Produk --</option>
                  <option value="rst">Raw Sawn Timber (RST)</option>
                  <option value="finished">Finished Product</option>
                  <option value="custom">Custom / Permintaan Khusus</option>
                </select>
              </div>

              {/* Kategori — hanya RST / Finished */}
              {(typeForm === "rst" || typeForm === "finished") && (
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-2">Kategori</label>
                  <select
                    disabled={!typeForm}
                    value={catForm}
                    onChange={(e) => { setCatForm(e.target.value); setSubCatForm(""); setProductNameForm(""); setActiveGrades({}); }}
                    className="w-full rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm text-[#1B4332] shadow-sm hover:border-[#40916C] focus:border-[#40916C] focus:outline-none appearance-none transition-all cursor-pointer disabled:bg-gray-50 disabled:cursor-not-allowed"
                  >
                    <option value="">-- Pilih Kategori --</option>
                    {typeForm === "rst" && rstCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                    {typeForm === "finished" && fpCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              )}

              {/* Sub-Kategori (Finished only) */}
              {typeForm === "finished" && catForm && (
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-2">Sub-Kategori</label>
                  <select
                    disabled={!catForm}
                    value={subCatForm}
                    onChange={(e) => { setSubCatForm(e.target.value); setProductNameForm(""); setActiveGrades({}); }}
                    className="w-full rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm text-[#1B4332] shadow-sm hover:border-[#40916C] focus:border-[#40916C] focus:outline-none appearance-none transition-all cursor-pointer disabled:bg-gray-50 disabled:cursor-not-allowed"
                  >
                    <option value="">-- Pilih Sub-Kategori --</option>
                    {fpSubcats.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              )}

              {/* Nama Produk (Finished only) */}
              {typeForm === "finished" && subCatForm && (
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-2">Nama Produk</label>
                  <select
                    disabled={!subCatForm}
                    value={productNameForm}
                    onChange={(e) => { setProductNameForm(e.target.value); setActiveGrades({}); }}
                    className="w-full rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm text-[#1B4332] shadow-sm hover:border-[#40916C] focus:border-[#40916C] focus:outline-none appearance-none transition-all cursor-pointer disabled:bg-gray-50 disabled:cursor-not-allowed"
                  >
                    <option value="">-- Pilih Produk --</option>
                    {fpProductNames.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              )}

              {/* Grade / Mutu selection (RST/Finished only, not Custom) */}
              {catForm && typeForm !== "custom" && (typeForm !== "finished" || productNameForm) && (
                <div className="col-span-1 md:col-span-2 pt-4 border-t border-gray-100 mt-2 space-y-4">
                  <label className="block text-xs font-semibold text-muted-foreground">
                    Pilih Mutu / Grade & Kuantitas ({typeForm === "rst" ? "M³" : "Pcs"})
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(typeForm === "rst" ? availableRstMutu : availableFpGrades).map((m) => {
                      const isSelected = activeGrades[m.code] !== undefined;
                      return (
                        <div
                          key={m.code}
                          className={cn(
                            "flex items-center justify-between p-4 rounded-xl border transition-all",
                            isSelected ? "bg-[#F8FDF5] border-[#40916C]/30 shadow-sm" : "bg-white border-gray-100"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox
                              id={`grade-${m.code}`}
                              checked={isSelected}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setActiveGrades((prev) => ({ ...prev, [m.code]: 1 }));
                                } else {
                                  const next = { ...activeGrades };
                                  delete next[m.code];
                                  setActiveGrades(next);
                                }
                              }}
                            />
                            <Label htmlFor={`grade-${m.code}`} className="text-sm font-semibold text-[#1B4332] cursor-pointer">
                              {m.name}
                            </Label>
                          </div>
                          {isSelected && (
                            <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-200">
                              <Input
                                type="number"
                                min="1"
                                step={typeForm === "rst" ? "0.01" : "1"}
                                className="w-20 h-9 text-right font-semibold text-xs border-gray-100 rounded-lg focus:border-[#40916C] shadow-sm"
                                value={activeGrades[m.code]}
                                onChange={(e) => {
                                  let val: string | number = e.target.value;
                                  if (val !== "") {
                                    val = typeForm === "rst" ? parseFloat(val) : parseInt(val);
                                    if (isNaN(val as number)) val = "";
                                  }
                                  setActiveGrades((prev) => ({ ...prev, [m.code]: val }));
                                }}
                              />
                              <span className="text-xs font-semibold text-muted-foreground">{typeForm === "rst" ? "M³" : "Pcs"}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button
                      type="button"
                      disabled={Object.values(activeGrades).filter((v) => Number(v) > 0).length === 0}
                      onClick={handleAddGrade}
                      className="rounded-xl bg-[#40916C] hover:bg-[#2D6A4F] text-white font-semibold h-[44px] px-8 shadow-sm transition-all"
                    >
                      + Masukkan ke Daftar Pesanan
                    </Button>
                  </div>
                </div>
              )}

              {/* Custom Action Button */}
              {typeForm === "custom" && (
                <div className="col-span-1 md:col-span-2 pt-4 border-t border-gray-100 mt-2">
                  <div className="rounded-xl p-5 border border-amber-100 text-amber-800 text-sm mb-4">
                    <p className="font-semibold mb-1">Permintaan Khusus (Custom)</p>
                    <p className="text-amber-700/80">Silakan tambahkan pesanan custom ke daftar di bawah, lalu Anda dapat mengisi spesifikasi detail dan lampiran untuk tim perhutani mereview.</p>
                  </div>
                  <div className="flex justify-start">
                    <Button
                      type="button"
                      onClick={handleAddCustom}
                      className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold h-[44px] px-8 shadow-sm transition-all"
                    >
                      Masukkan Pesanan Custom
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Selected grades list (Cart) — now with detail & file inputs per item */}
            {selectedGrades.length > 0 && (
              <div className="space-y-6 pt-8 mt-8 border-t border-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-[#1B4332] tracking-wide">Daftar Pesanan Sortimen</h4>
                  {errors.grades && (
                    <span className="text-red-500 font-semibold text-[10px] bg-red-50 px-2 py-1 rounded-md">{errors.grades}</span>
                  )}
                </div>
                <div className="max-h-[600px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                  {selectedGrades.map((g) => (
                    <div key={g.id} className="flex flex-col gap-4 p-5 bg-[#FBFDFB] border border-gray-100 rounded-xl shadow-sm">
                      {/* Item Header */}
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-100 pb-4">
                        <div>
                          {g.type === "custom" ? (
                            <p className="text-sm font-bold text-amber-700">{g.name}</p>
                          ) : (
                            <p className="text-sm font-semibold text-[#1B4332]">{g.name}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {g.type === "custom" ? "Custom Request" : g.type === "rst" ? "Raw Sawn Timber" : "Finished Product"} • {g.category}
                          </p>
                        </div>
                        <div className="flex items-center gap-6 justify-between sm:justify-end">
                          {g.type !== "custom" && (
                            <p className="text-sm font-semibold text-[#1B4332]">
                              {g.quantity} <span className="text-xs opacity-50 font-medium">{g.type === "rst" ? "M³" : "Pcs"}</span>
                            </p>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveGrade(g.id)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 px-3 rounded-lg font-medium text-xs"
                          >
                            Hapus
                          </Button>
                        </div>
                      </div>

                      {/* Item Detail Input */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-[11px] font-semibold text-muted-foreground uppercase">
                            Detail Permintaan <span className="text-red-500">*</span>
                          </label>
                          {errors.grades && !g.detail.trim() && (
                            <span className="text-[10px] font-semibold text-red-500">Wajib Diisi</span>
                          )}
                        </div>
                        <Textarea
                          value={g.detail}
                          onChange={(e) => handleItemDetailChange(g.id, e.target.value)}
                          placeholder="Detail spesifikasi / ukuran / catatan khusus untuk produk ini..."
                          rows={3}
                          className={cn(
                            "w-full rounded-xl border bg-white px-3 py-2 text-sm text-[#1B4332] resize-none focus-visible:ring-0 focus-visible:border-[#40916C] shadow-sm transition-all",
                            errors.grades && !g.detail.trim() ? "border-red-400" : "border-gray-100"
                          )}
                        />
                      </div>

                      {/* Item File Input */}
                      <div className="pt-2">
                        <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-2">
                          Lampiran (Opsional)
                        </label>
                        
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                          <div className="relative">
                            <input
                              type="file"
                              multiple
                              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                              id={`file-upload-${g.id}`}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={(e) => {
                                handleItemFilesChange(g.id, e.target.files);
                                e.target.value = "";
                              }}
                            />
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              className="bg-white border-dashed border-gray-300 hover:border-[#40916C] hover:text-[#40916C] h-9 pointer-events-none"
                            >
                              <UploadCloud className="w-4 h-4 mr-2 opacity-50" />
                              Tambah File
                            </Button>
                          </div>
                          
                          {/* File list specifically for this item */}
                          {g.files.length > 0 && (
                            <div className="flex flex-wrap gap-2 flex-1">
                              {g.files.map((file, i) => (
                                <div key={i} className="flex items-center gap-2 bg-[#F8FDF5] border border-[#40916C]/20 rounded-md px-2 py-1">
                                  <FileText className="w-3 h-3 text-[#40916C]/70" />
                                  <span className="text-[10px] font-medium text-[#1B4332] max-w-[100px] truncate">{file.name}</span>
                                  <button type="button" onClick={() => handleItemRemoveFile(g.id, i)} className="text-muted-foreground hover:text-red-500">
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty selected grades error message */}
            {selectedGrades.length === 0 && errors.grades && (
              <div className="pt-6 mt-6 border-t border-gray-50">
                <span className="text-red-500 font-semibold text-[10px] bg-red-50 px-2 py-1 rounded-md">{errors.grades}</span>
              </div>
            )}
          </div>

          {/* ── Submit ── */}
          <div className="flex justify-end pb-12">
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-semibold h-[44px] px-10 shadow-sm transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Tambahkan ke Draft Kontrak
            </Button>
          </div>

        </div>
      </main>
    </div>
  );
}
