import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Toko Perhutani",
  description:
    "Official government timber distribution system. Browse raw timber inventory and finished products from authorized storage areas.",
  icons: {
    icon: "/image.png",
    apple: "/image.png",
  },
};

import { CartProvider } from "@/lib/cart-store";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "@/components/timber/footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <div className="flex-grow flex flex-col relative">{children}</div>
            <Footer />
          </div>
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
