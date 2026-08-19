"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { INITIAL_PRODUCTS_DATA, fetchProductsFromSupabase, Product } from "@/lib/productsData";
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS_DATA);

  useEffect(() => {
    async function loadProducts() {
      const data = await fetchProductsFromSupabase();
      setProducts(data);
    }
    loadProducts();
  }, []);

  const categories = [
    { id: "all", label: "Tất cả" },
    { id: "noi-that", label: "Nội thất" },
    { id: "trang-tri", label: "Trang trí" },
    { id: "nha-bep", label: "Nhà bếp" },
    { id: "den", label: "Đèn" },
    { id: "van-phong", label: "Văn phòng" },
    { id: "luu-tru", label: "Lưu trữ" },
  ];

  const filteredProducts = products.filter((p) => {
    if (selectedCategory === "all") return p.featured;
    return p.category === selectedCategory;
  });

  return (
    <main>
      {/* Hero Banner Section */}
      <section className="hero-section">
        <div className="container">
          <div
            className="hero-banner"
            style={{
              backgroundImage: "url('/assets/images/banner/banner-trang-chu-mini-shop.webp')",
            }}
          >
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <h1 className="hero-title">
                Sống đẹp mỗi ngày
                <br />
                cùng Mini Shop
              </h1>
              <p className="hero-subtitle">Sản phẩm chất lượng cho tổ ấm của bạn.</p>
              <Link href="/products" className="btn-hero">
                Mua sắm ngay
              </Link>

              <div className="hero-features">
                <div className="feature-item">
                  <div className="feature-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="3" width="15" height="13" rx="2" />
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                      <circle cx="5.5" cy="18.5" r="2.5" />
                      <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                  </div>
                  <div>
                    <div className="feature-title">Giao hàng nhanh</div>
                    <div className="feature-desc">Toàn quốc</div>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div>
                    <div className="feature-title">Bảo hành chính hãng</div>
                    <div className="feature-desc">7 ngày đổi trả</div>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <div className="feature-title">Hỗ trợ 24/7</div>
                    <div className="feature-desc">Tư vấn tận tâm</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Filter Section */}
      <section className="categories-section">
        <div className="container">
          <div className="category-pills">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`pill-btn ${selectedCategory === cat.id ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Grid Section */}
      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Sản phẩm nổi bật</h2>
            <Link href="/products" className="see-all-link">
              Xem tất cả
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="products-grid">
            {filteredProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} animationIndex={idx} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
