"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CatalogItem, ProductColor } from "@/data/drops";

const STORAGE_KEY = "drshaq-cart-v1";

export type CartLine = {
  key: string;
  productId: string;
  dropSlug: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  selectedSize?: string;
  selectedColorName?: string;
  selectedColorHex?: string;
};

type AddToCartInput = {
  product: CatalogItem;
  quantity?: number;
  selectedSize?: string;
  selectedColor?: ProductColor;
};

type CartContextValue = {
  lines: CartLine[];
  totalItems: number;
  subtotal: number;
  addToCart: (input: AddToCartInput) => void;
  removeLine: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function buildLineKey(
  productId: string,
  selectedSize?: string,
  selectedColorName?: string
) {
  return `${productId}::${selectedSize ?? "na"}::${selectedColorName ?? "na"}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as CartLine[];
      if (!Array.isArray(parsed)) return;
      setLines(parsed);
    } catch {
      setLines([]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines]);

  const addToCart = ({
    product,
    quantity = 1,
    selectedSize,
    selectedColor,
  }: AddToCartInput) => {
    const lineKey = buildLineKey(product.id, selectedSize, selectedColor?.name);

    setLines((current) => {
      const existing = current.find((line) => line.key === lineKey);
      if (existing) {
        return current.map((line) =>
          line.key === lineKey
            ? { ...line, quantity: line.quantity + quantity }
            : line
        );
      }

      return [
        ...current,
        {
          key: lineKey,
          productId: product.id,
          dropSlug: product.dropSlug,
          name: product.name,
          image: product.images[0] ?? product.image,
          price: product.price,
          quantity,
          selectedSize,
          selectedColorName: selectedColor?.name,
          selectedColorHex: selectedColor?.hex,
        },
      ];
    });
  };

  const removeLine = (key: string) => {
    setLines((current) => current.filter((line) => line.key !== key));
  };

  const updateQuantity = (key: string, quantity: number) => {
    setLines((current) =>
      current
        .map((line) =>
          line.key === key ? { ...line, quantity: Math.max(1, quantity) } : line
        )
        .filter((line) => line.quantity > 0)
    );
  };

  const clearCart = () => {
    setLines([]);
  };

  const totalItems = useMemo(
    () => lines.reduce((acc, line) => acc + line.quantity, 0),
    [lines]
  );

  const subtotal = useMemo(
    () => lines.reduce((acc, line) => acc + line.price * line.quantity, 0),
    [lines]
  );

  const value: CartContextValue = {
    lines,
    totalItems,
    subtotal,
    addToCart,
    removeLine,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}

