"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  ChevronLeft,
  Building2,
  Briefcase,
  FileText,
  Upload,
  UserCircle,
  AlignLeft,
  Lock,
  ShieldCheck,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [accountType, setAccountType] = useState<"individual" | "company">(
    "individual",
  );
  const [npwpFile, setNpwpFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNpwpFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/login");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F1F5F9] p-4 lg:p-6">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
        {/* Left Side: Solid Branding Section (Same as Login) */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-[#163020] text-white relative">
          <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]" />

          <div className="relative z-10">
            <button
              onClick={() => router.push("/login")}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-semibold mb-10"
            >
              <ChevronLeft className="w-4 h-4" />
              Kembali ke Login
            </button>

            <div className="bg-white p-4 rounded-xl w-fit mb-8">
              <img
                src="/image.png"
                alt="Perhutani Logo"
                className="h-12 w-auto"
              />
            </div>

            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Daftar Sebagai <br />
              <span className="text-[#95D5B2]">Mitra Perhutani</span>
            </h1>
            <p className="text-white/70 leading-relaxed max-w-sm">
              Bergabunglah dengan ekosistem digital Toko Industri Perhutani.
              Nikmati akses prioritas ke berbagai jenis kayu berkualitas tinggi
              dan hasil hutan lainnya.
            </p>
          </div>

          <div className="relative z-10 pt-6 border-t border-white/10">
            <p className="text-xs text-white/40 font-medium">
              © 2026 Perum Perhutani. All rights reserved.
            </p>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="flex flex-col bg-white border-l border-gray-50 max-h-[90vh] overflow-hidden">
          <Tabs
            defaultValue="individual"
            className="flex flex-col overflow-hidden"
            onValueChange={(v) => setAccountType(v as any)}
          >
            {/* STICKY HEADER: Title + Tabs */}
            <div className="pt-6 px-6 lg:px-10 border-b border-gray-100/50 bg-white shrink-0">
              <div className="mb-4 block lg:hidden">
                <img src="/image.png" alt="Logo" className="h-8 w-auto" />
              </div>

              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  Buat Akun Baru
                </h2>
                <p className="text-gray-500 text-sm">
                  Pilih tipe akun dan lengkapi data diri Anda.
                </p>
              </div>

              <TabsList className="grid w-full grid-cols-2 p-1 bg-gray-50 rounded-xl h-11">
                <TabsTrigger
                  value="individual"
                  className="rounded-lg font-bold text-xs data-[state=active]:bg-[#163020] data-[state=active]:text-white transition-all shadow-none"
                >
                  Individu
                </TabsTrigger>
                <TabsTrigger
                  value="company"
                  className="rounded-lg font-bold text-xs data-[state=active]:bg-[#163020] data-[state=active]:text-white transition-all shadow-none"
                >
                  Perusahaan
                </TabsTrigger>
              </TabsList>
            </div>

            {/* SCROLLABLE FORM CONTENT */}
            <div className="overflow-y-auto custom-scrollbar flex-1">
              <TabsContent value="individual" className="m-0">
                <form
                  onSubmit={handleRegister}
                  className="px-6 lg:px-10 pb-8 pt-2 space-y-5"
                >
                  {/* Common Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[13px] font-bold text-gray-700">
                        Nama Lengkap
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder="Nama sesuai KTP"
                          className="pl-10 h-10 rounded-xl text-sm"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[13px] font-bold text-gray-700">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          type="email"
                          placeholder="nama@email.com"
                          className="pl-10 h-10 rounded-xl text-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[13px] font-bold text-gray-700">
                        No. WhatsApp
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder="0812xxxxxx"
                          className="pl-10 h-10 rounded-xl text-sm"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[13px] font-bold text-gray-700">
                        NIK (Nomor KTP)
                      </Label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder="16 digit angka"
                          className="pl-10 h-10 rounded-xl text-sm"
                          required
                          maxLength={16}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[13px] font-bold text-gray-700">
                      Alamat Tempat Tinggal
                    </Label>
                    <div className="relative">
                      <AlignLeft className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Textarea
                        placeholder="Masukkan alamat lengkap rumah Anda..."
                        className="pl-10 min-h-[100px] rounded-xl text-sm pt-2.5 resize-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Security Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[13px] font-bold text-gray-700">
                        Kata Sandi
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="pl-10 h-10 rounded-xl text-sm"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[13px] font-bold text-gray-700">
                        Konfirmasi Sandi
                      </Label>
                      <div className="relative">
                        <ShieldCheck className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="pl-10 h-10 rounded-xl text-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2 pt-2">
                    <Checkbox
                      id="terms-ind"
                      className="rounded border-gray-300 mt-0.5"
                      required
                    />
                    <label
                      htmlFor="terms-ind"
                      className="text-xs font-medium text-gray-500 cursor-pointer leading-relaxed"
                    >
                      Saya menyetujui{" "}
                      <span className="text-[#163020] font-bold hover:underline">
                        Syarat & Ketentuan
                      </span>{" "}
                      serta{" "}
                      <span className="text-[#163020] font-bold hover:underline">
                        Kebijakan Privasi
                      </span>{" "}
                      Perhutani.
                    </label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-[#163020] hover:bg-[#2D6A4F] text-white rounded-xl font-bold text-sm shadow-sm transition-all active:scale-[0.99]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      "Daftar Jadi Mitra"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="company" className="m-0">
                <form
                  onSubmit={handleRegister}
                  className="px-6 lg:px-10 pb-8 pt-2 space-y-5"
                >
                  {/* PIC Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[13px] font-bold text-gray-700">
                        Nama Lengkap PIC
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder="Nama penanggung jawab"
                          className="pl-10 h-10 rounded-xl text-sm"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[13px] font-bold text-gray-700">
                        Email Bisnis
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          type="email"
                          placeholder="perusahaan@bisnis.com"
                          className="pl-10 h-10 rounded-xl text-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[13px] font-bold text-gray-700">
                        WhatsApp PIC
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder="0812xxxxxx"
                          className="pl-10 h-10 rounded-xl text-sm"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[13px] font-bold text-gray-700">
                        Jabatan
                      </Label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder="Direktur / Manager / Purchasing..."
                          className="pl-10 h-10 rounded-xl text-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Company Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[13px] font-bold text-gray-700">
                        Nama Perusahaan
                      </Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder="PT / CV / Firma..."
                          className="pl-10 h-10 rounded-xl text-sm"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[13px] font-bold text-gray-700">
                        NPWP Perusahaan
                      </Label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder="15 digit nomor NPWP"
                          className="pl-10 h-10 rounded-xl text-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[13px] font-bold text-gray-700">
                      Alamat Perusahaan
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Textarea
                        placeholder="Alamat lengkap kantor pusat atau operasional..."
                        className="pl-10 min-h-[100px] rounded-xl text-sm pt-2.5 resize-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[13px] font-bold text-gray-700">
                      NIK PIC (Nomor KTP)
                    </Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="16 digit angka"
                        className="pl-10 h-10 rounded-xl text-sm"
                        required
                        maxLength={16}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[13px] font-bold text-gray-700">
                      Upload Foto NPWP
                    </Label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".jpg,.jpeg,.png,.pdf"
                    />
                    <div
                      onClick={triggerFileInput}
                      className="border-2 border-dashed border-gray-100 rounded-xl p-6 flex flex-col items-center justify-center hover:bg-gray-50/50 hover:border-[#163020]/20 transition-all cursor-pointer group"
                    >
                      <Upload className="w-6 h-6 text-gray-300 mb-2 group-hover:text-[#163020] transition-colors" />
                      <p className="text-xs font-semibold text-gray-400 group-hover:text-gray-600 text-center px-4 truncate w-full">
                        {npwpFile
                          ? npwpFile.name
                          : "Klik untuk unggah atau seret file"}
                      </p>
                      <p className="text-[10px] text-gray-300 mt-1 font-bold italic">
                        {npwpFile
                          ? `${(npwpFile.size / 1024 / 1024).toFixed(2)} MB`
                          : "MAKS. 5MB (JPG, PNG, PDF)"}
                      </p>
                    </div>
                  </div>

                  {/* Security Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[13px] font-bold text-gray-700">
                        Kata Sandi
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="pl-10 h-10 rounded-xl text-sm"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[13px] font-bold text-gray-700">
                        Konfirmasi Sandi
                      </Label>
                      <div className="relative">
                        <ShieldCheck className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="pl-10 h-10 rounded-xl text-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2 pt-2">
                    <Checkbox
                      id="terms-com"
                      className="rounded border-gray-300 mt-0.5"
                      required
                    />
                    <label
                      htmlFor="terms-com"
                      className="text-xs font-medium text-gray-500 cursor-pointer leading-relaxed"
                    >
                      Saya menyetujui{" "}
                      <span className="text-[#163020] font-bold hover:underline">
                        Syarat & Ketentuan
                      </span>{" "}
                      serta{" "}
                      <span className="text-[#163020] font-bold hover:underline">
                        Kebijakan Privasi
                      </span>{" "}
                      Perhutani.
                    </label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-[#163020] hover:bg-[#2D6A4F] text-white rounded-xl font-bold text-sm shadow-sm transition-all active:scale-[0.99]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      "Daftar Jadi Mitra"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </div>

            {/* FIXED FOOTER */}
            <div className="p-6 lg:px-10 lg:py-8 border-t border-gray-100 text-center bg-white">
              <p className="text-sm text-gray-500">
                Sudah memiliki akun?{" "}
                <button
                  onClick={() => router.push("/login")}
                  className="text-[#163020] font-bold hover:underline transition-all"
                >
                  Login Sekarang
                </button>
              </p>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
