"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Lock, Mail, ArrowRight, ChevronLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F1F5F9] p-4 lg:p-8">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
        {/* Left Side: Solid Branding Section */}
        <div className="hidden lg:flex flex-col justify-between p-16 bg-[#163020] text-white relative">
          <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]" />

          <div className="relative z-10">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-semibold mb-16"
            >
              <ChevronLeft className="w-4 h-4" />
              Kembali ke Beranda
            </button>

            <div className="bg-white p-4 rounded-xl w-fit mb-12">
              <img
                src="/image.png"
                alt="Perhutani Logo"
                className="h-12 w-auto"
              />
            </div>

            <h1 className="text-4xl font-bold mb-6 leading-tight">
              Akses Portal <br />
              <span className="text-[#95D5B2]">Toko Industri Perhutani</span>
            </h1>
            <p className="text-white/70 leading-relaxed max-w-sm">
              E-commerce resmi Perhutani untuk akses langsung hasil hutan kayu
              dan non-kayu. Solusi transparan dan efisien untuk kebutuhan
              industri Anda.
            </p>
          </div>

          <div className="relative z-10 pt-8 border-t border-white/10">
            <p className="text-xs text-white/40 font-medium">
              © 2026 Perum Perhutani. All rights reserved.
            </p>
          </div>
        </div>

        {/* Right Side: Clean Login Form */}
        <div className="p-8 lg:p-16 flex flex-col justify-between bg-white border-l border-gray-50">
          <div className="flex-1 flex flex-col justify-center py-8">
            <div className="mb-8 block lg:hidden">
              <img src="/image.png" alt="Logo" className="h-10 w-auto mb-6" />
            </div>

            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Login ke Akun
              </h2>
              <p className="text-gray-500 text-sm">
                Gunakan kredensial terdaftar untuk masuk ke dashboard mitra.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-[13px] font-bold text-gray-700"
                >
                  Email Address
                </Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#163020]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-1 focus:ring-[#163020] focus:border-[#163020] transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label
                    htmlFor="password"
                    className="text-[13px] font-bold text-gray-700"
                  >
                    Password
                  </Label>
                  <button
                    type="button"
                    className="text-xs font-semibold text-[#2D6A4F] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#163020]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-1 focus:ring-[#163020] focus:border-[#163020] transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <Checkbox
                  id="remember"
                  className="rounded border-gray-300 text-[#163020] focus:ring-[#163020]"
                />
                <label
                  htmlFor="remember"
                  className="text-[13px] font-medium text-gray-600 cursor-pointer"
                >
                  Remember me on this device
                </label>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-[#163020] hover:bg-[#2D6A4F] text-white rounded-xl font-bold text-base shadow-sm transition-all active:scale-[0.99] mt-2 flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  "Masuk ke Dashboard"
                )}
              </Button>
            </form>
          </div>

          <div className="pt-8 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Belum punya akun mitra?{" "}
              <button
                onClick={() => router.push("/register")}
                className="text-[#163020] font-bold hover:underline transition-all"
              >
                Daftar Sekarang
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
