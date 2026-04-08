"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Package,
  MapPin,
  Award,
  Ruler,
  Info,
  ShoppingCart,
  CheckCircle2,
} from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  category: string;
  subCategory: string;
  woodType: string;
  dimensions: string;
  price: number;
  stock: number;
  grade: string;
  image: string;
  unit: string;
  wilayah: string;
  sertifikat: string;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addFinishedItem } = useCart();

  const handleAddToCart = () => {
    addFinishedItem(product as any, quantity);
    toast.success("Produk berhasil ditambahkan", {
      description: `${quantity}x ${product.name} telah masuk ke keranjang.`,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex flex-col rounded-xl border border-border bg-white overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer group">
          {/* Product Image */}
          <div className="relative aspect-square bg-muted overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Wood Type Badge */}
            <div className="absolute top-3 left-3">
              <span className="bg-white/95 backdrop-blur-sm text-primary font-semibold text-xs px-2.5 py-1 rounded-full shadow-sm border border-white/50">
                {product.woodType}
              </span>
            </div>
            {/* Grade Badge */}
            <div className="absolute top-3 right-3">
              <Badge
                variant="secondary"
                className="bg-primary text-white border-none font-semibold text-xs py-0.5"
              >
                Grade {product.grade}
              </Badge>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-2 p-4">
            <div>
              <div className="flex items-center text-xs text-muted-foreground/60 mb-1 font-medium">
                <span>{product.category}</span>
                <span className="mx-1.5 opacity-40">/</span>
                <span>{product.subCategory}</span>
              </div>
              <h3 className="text-sm font-semibold text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">
                {product.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-2 text-[11px] text-muted-foreground">
                <Ruler className="w-3.5 h-3.5 opacity-70" />
                <span className="text-foreground/80">{product.dimensions}</span>
              </div>
            </div>

            <div className="pt-3 mt-auto flex items-center justify-between">
              <div className="text-lg font-extrabold text-primary">
                Rp {product.price.toLocaleString("id-ID")}
              </div>
              <div className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                <Package className="w-3.5 h-3.5" />
                <span>Stok: {product.stock}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[720px] p-0 overflow-hidden border-none shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Image */}
          <div className="relative aspect-square md:aspect-auto bg-muted overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-6 left-6 flex flex-col gap-2">
              <Badge className="w-fit bg-primary/95 backdrop-blur-md border-none px-3.5 py-1.5 text-xs font-bold shadow-lg">
                {product.woodType}
              </Badge>
              <Badge
                variant="secondary"
                className="w-fit bg-white/95 backdrop-blur-md border-none px-3.5 py-1.5 text-xs text-primary font-bold shadow-lg"
              >
                Grade {product.grade}
              </Badge>
            </div>
          </div>

          {/* Right: Info */}
          <div className="flex flex-col p-8 md:p-10 bg-white">
            <div className="flex items-center text-xs text-muted-foreground/70 mb-3 font-medium">
              <span>{product.category}</span>
              <span className="mx-2 opacity-40">/</span>
              <span>{product.subCategory}</span>
            </div>

            <DialogTitle className="text-2xl font-semibold text-foreground mb-4 leading-tight">
              {product.name}
            </DialogTitle>

            <div className="text-3xl font-semibold text-primary mb-10">
              Rp {product.price.toLocaleString("id-ID")}
            </div>

            <div className="space-y-6 mb-10">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 p-2 rounded-xl bg-primary/5 text-primary border border-primary/10">
                  <Ruler className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-muted-foreground/60 mb-1">
                    Dimensi Produk
                  </div>
                  <div className="text-sm font-semibold text-foreground">
                    {product.dimensions}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-0.5 p-2 rounded-xl bg-primary/5 text-primary border border-primary/10">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-muted-foreground/60 mb-1">
                    Wilayah & Unit
                  </div>
                  <div className="text-sm font-semibold text-foreground">
                    {product.wilayah} - {product.unit}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-0.5 p-2 rounded-xl bg-primary/5 text-primary border border-primary/10">
                  <Award className="w-4 h-4" />
                </div>
                <div className="flex flex-col gap-3">
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground/60 mb-1">
                      Kualitas Produk
                    </div>
                    <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                       Grade {product.grade}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground/60 mb-1">
                      Sertifikasi
                    </div>
                    <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                      {product.sertifikat}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-0.5 p-2 rounded-xl bg-primary/5 text-primary border border-primary/10">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-muted-foreground/60 mb-1">
                    Ketersediaan Stok
                  </div>
                  <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                    {product.stock} Unit
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-8 border-t border-border space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">
                  Kuantitas
                </span>
                <div className="flex items-center p-1 bg-muted/30 rounded-lg border border-border/50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm transition-all text-muted-foreground hover:text-primary disabled:opacity-30"
                    disabled={quantity <= 1}
                  >
                    <span className="text-xl font-semibold leading-none">-</span>
                  </button>
                  <div className="w-12 text-center font-bold text-foreground">
                    {quantity}
                  </div>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm transition-all text-muted-foreground hover:text-primary disabled:opacity-30"
                    disabled={quantity >= product.stock}
                  >
                    <span className="text-xl font-semibold leading-none">+</span>
                  </button>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full font-bold h-12 shadow-lg shadow-primary/20 group transition-all"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-5 h-5 mr-2 transition-transform group-hover:-translate-y-1" />
                Tambah {quantity} ke Keranjang
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
