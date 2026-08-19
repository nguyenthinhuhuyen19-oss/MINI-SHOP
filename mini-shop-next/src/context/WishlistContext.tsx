"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface WishlistContextType {
  wishlist: number[];
  toggleWishlist: (productId: number) => boolean;
  isInWishlist: (productId: number) => boolean;
  getWishlistCount: () => number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_KEY = "mini_shop_wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<number[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_KEY);
      if (saved) {
        setWishlist(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to parse wishlist from localStorage", e);
    }
  }, []);

  const saveWishlist = (newList: number[]) => {
    setWishlist(newList);
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(newList));
    } catch (e) {
      console.error("Failed to save wishlist to localStorage", e);
    }
  };

  const toggleWishlist = (productId: number): boolean => {
    const numId = Number(productId);
    const exists = wishlist.includes(numId);
    let newList: number[];
    if (exists) {
      newList = wishlist.filter((id) => id !== numId);
    } else {
      newList = [...wishlist, numId];
    }
    saveWishlist(newList);
    return !exists;
  };

  const isInWishlist = (productId: number): boolean => {
    return wishlist.includes(Number(productId));
  };

  const getWishlistCount = (): number => {
    return wishlist.length;
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isInWishlist,
        getWishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
}
