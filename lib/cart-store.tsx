"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { FinishedProduct, RSTProduct } from "./timber-data";

interface FinishedCartItem {
  product: FinishedProduct;
  quantity: number;
}

interface CartContextType {
  // Finished Products Cart
  finishedItems: FinishedCartItem[];
  addFinishedItem: (product: FinishedProduct, quantity: number) => void;
  removeFinishedItem: (productId: number) => void;
  updateFinishedQuantity: (productId: number, quantity: number) => void;
  clearFinishedCart: () => void;

  // RST (Raw Timber) Cart
  rstItems: RSTProduct[];
  addRSTItems: (products: RSTProduct[]) => void;
  removeRSTItem: (productId: number) => void;
  clearRSTCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [finishedItems, setFinishedItems] = useState<FinishedCartItem[]>([]);
  const [rstItems, setRstItems] = useState<RSTProduct[]>([]);

  // Finished Products Logic
  const addFinishedItem = (product: FinishedProduct, quantity: number) => {
    setFinishedItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFinishedItem = (productId: number) => {
    setFinishedItems((prev) =>
      prev.filter((item) => item.product.id !== productId),
    );
  };

  const updateFinishedQuantity = (productId: number, quantity: number) => {
    setFinishedItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const clearFinishedCart = () => setFinishedItems([]);

  // RST Logic
  const addRSTItems = (products: RSTProduct[]) => {
    setRstItems((prev) => {
      const newItems = products.filter(
        (p) => !prev.some((item) => item.id === p.id),
      );
      return [...prev, ...newItems];
    });
  };

  const removeRSTItem = (productId: number) => {
    setRstItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearRSTCart = () => setRstItems([]);

  return (
    <CartContext.Provider
      value={{
        finishedItems,
        addFinishedItem,
        removeFinishedItem,
        updateFinishedQuantity,
        clearFinishedCart,
        rstItems,
        addRSTItems,
        removeRSTItem,
        clearRSTCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
