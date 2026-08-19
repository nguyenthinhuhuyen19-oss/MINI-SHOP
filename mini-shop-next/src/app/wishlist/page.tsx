"use client";

import React from "react";
import Link from "next/link";
import { INITIAL_PRODUCTS_DATA } from "@/lib/productsData";
import ProductCard from "@/components/ProductCard";
import Breadcrumb from "@/components/Breadcrumb";
import { useWishlist } from "@/context/WishlistContext";

export default function WishlistPage() {
  const { wishlist } = useWishlist();

  const wishlistedProducts = INITIAL_PRODUCTS_DATA.filter((p) => wishlist.includes(p.id));

  return (
    <main className="container">
      <Breadcrumb items={[{ label: "Danh sách yêu thích", active: true }]} />

      <section className="cart-page-section">
        <h1 className="cart-page-title">Sản phẩm yêu thích của bạn</h1>

        {wishlistedProducts.length === 0 ? (
          <div
            className="card-animate"
            style={{
              textAlign: "center",
              padding: "60px 20px",
              background: "#fff",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--gray-border)",
            }}
          >
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--gray-light)"
              strokeWidth="1.5"
              style={{ marginBottom: 16 }}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <h3 style={{ fontSize: "1.2rem", color: "var(--dark)", marginBottom: 8 }}>
              Danh sách yêu thích đang trống
            </h3>
            <p style={{ fontSize: "0.9rem", color: "var(--gray-muted)", marginBottom: 24 }}>
              Hãy nhấn biểu tượng trái tim ở các sản phẩm bạn yêu thích để lưu vào đây nhé!
            </p>
            <Link href="/products" className="btn-hero" style={{ padding: "12px 24px" }}>
              Khám phá sản phẩm
            </Link>
          </div>
        ) : (
          <div className="products-grid">
            {wishlistedProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} animationIndex={idx} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
