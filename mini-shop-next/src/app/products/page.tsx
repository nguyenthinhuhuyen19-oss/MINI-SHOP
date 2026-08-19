"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { INITIAL_PRODUCTS_DATA } from "@/lib/productsData";
import ProductCard from "@/components/ProductCard";
import Breadcrumb from "@/components/Breadcrumb";
import { useToast } from "@/context/ToastContext";

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const { showToast } = useToast();

  const [currentCategory, setCurrentCategory] = useState("all");
  const [currentPriceRange, setCurrentPriceRange] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [currentSort, setCurrentSort] = useState("newest");

  useEffect(() => {
    const q = searchParams.get("search");
    if (q !== null) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  const categoryCounts = useMemo(() => {
    return {
      all: INITIAL_PRODUCTS_DATA.length,
      "noi-that": INITIAL_PRODUCTS_DATA.filter((p) => p.category === "noi-that").length,
      "trang-tri": INITIAL_PRODUCTS_DATA.filter((p) => p.category === "trang-tri").length,
      "nha-bep": INITIAL_PRODUCTS_DATA.filter((p) => p.category === "nha-bep").length,
      den: INITIAL_PRODUCTS_DATA.filter((p) => p.category === "den").length,
      "luu-tru": INITIAL_PRODUCTS_DATA.filter((p) => p.category === "luu-tru").length,
      "van-phong": INITIAL_PRODUCTS_DATA.filter((p) => p.category === "van-phong").length,
    };
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...INITIAL_PRODUCTS_DATA];

    if (currentCategory !== "all") {
      result = result.filter((p) => p.category === currentCategory);
    }

    if (currentPriceRange === "under-200k") {
      result = result.filter((p) => p.price < 200000);
    } else if (currentPriceRange === "200k-500k") {
      result = result.filter((p) => p.price >= 200000 && p.price <= 500000);
    } else if (currentPriceRange === "500k-1500k") {
      result = result.filter((p) => p.price > 500000 && p.price <= 1500000);
    } else if (currentPriceRange === "over-1500k") {
      result = result.filter((p) => p.price > 1500000);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q)
      );
    }

    if (currentSort === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (currentSort === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (currentSort === "newest") {
      result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [currentCategory, currentPriceRange, searchQuery, currentSort]);

  return (
    <main className="container">
      <Breadcrumb items={[{ label: "Sản phẩm", active: true }]} />

      <section className="products-page-section">
        {/* Title & Toolbar Header */}
        <div className="products-page-header">
          <div className="products-header-top">
            <div>
              <h1 className="products-page-title">Danh sách sản phẩm</h1>
              <p className="products-count-text">
                Hiển thị 1–{filteredProducts.length} trên {filteredProducts.length} sản phẩm
              </p>
            </div>

            <div className="products-toolbar">
              <div className="toolbar-search-box">
                <input
                  type="text"
                  className="toolbar-search-input"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg className="toolbar-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>

              <select
                className="toolbar-sort-select"
                value={currentSort}
                onChange={(e) => setCurrentSort(e.target.value)}
                aria-label="Sắp xếp sản phẩm"
              >
                <option value="newest">Sắp xếp: Mới nhất</option>
                <option value="price-low">Giá: Thấp đến Cao</option>
                <option value="price-high">Giá: Cao đến Thấp</option>
              </select>
            </div>
          </div>
        </div>

        <div className="products-page-layout">
          {/* Sidebar Filter */}
          <aside className="filter-sidebar">
            <div className="filter-group">
              <h3 className="filter-header">Danh mục</h3>
              <div className="filter-category-list">
                {[
                  { id: "all", label: "Tất cả sản phẩm" },
                  { id: "noi-that", label: "Nội thất" },
                  { id: "trang-tri", label: "Trang trí" },
                  { id: "nha-bep", label: "Nhà bếp" },
                  { id: "den", label: "Đèn" },
                  { id: "luu-tru", label: "Lưu trữ" },
                  { id: "van-phong", label: "Văn phòng" },
                ].map((cat) => (
                  <div
                    key={cat.id}
                    className={`filter-cat-item ${currentCategory === cat.id ? "active" : ""}`}
                    onClick={() => setCurrentCategory(cat.id)}
                  >
                    <span className="option-text-group">{cat.label}</span>
                    <span className="cat-count">
                      {categoryCounts[cat.id as keyof typeof categoryCounts] || 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h3 className="filter-header">Khoảng giá</h3>
              <div className="filter-options-list">
                {[
                  { id: "all", label: "Tất cả mức giá" },
                  { id: "under-200k", label: "Dưới 200.000đ" },
                  { id: "200k-500k", label: "200.000đ - 500.000đ" },
                  { id: "500k-1500k", label: "500.000đ - 1.500.000đ" },
                  { id: "over-1500k", label: "Trên 1.500.000đ" },
                ].map((pr) => (
                  <label key={pr.id} className="filter-option-label">
                    <span className="option-text-group">
                      <input
                        type="radio"
                        name="priceRange"
                        value={pr.id}
                        checked={currentPriceRange === pr.id}
                        onChange={(e) => setCurrentPriceRange(e.target.value)}
                      />
                      {pr.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h3 className="filter-header">Tình trạng</h3>
              <div className="filter-options-list">
                <label className="filter-option-label">
                  <span className="option-text-group">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                    />
                    Còn hàng
                  </span>
                </label>
              </div>
            </div>
          </aside>

          {/* Main Grid */}
          <div className="products-grid-wrapper">
            {filteredProducts.length === 0 ? (
              <div
                className="card-animate"
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  padding: "60px 20px",
                  background: "#fff",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--gray-border)",
                }}
              >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--gray-light)" strokeWidth="1.5" style={{ marginBottom: 12 }}>
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <h3 style={{ fontSize: "1.1rem", color: "var(--dark)", marginBottom: 6 }}>
                  Không tìm thấy sản phẩm phù hợp
                </h3>
                <p style={{ fontSize: "0.88rem", color: "var(--gray-muted)" }}>
                  Vui lòng thử chọn danh mục khác hoặc thay đổi từ khóa tìm kiếm.
                </p>
              </div>
            ) : (
              <div className="products-page-grid">
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} animationIndex={index} />
                ))}
              </div>
            )}

            <div className="load-more-container">
              <button
                className="btn-load-more"
                onClick={() => showToast("Đã tải tất cả sản phẩm hiện có", "info", "info")}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
                Tải thêm sản phẩm
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: "60px 0", textAlign: "center" }}>Đang tải danh sách sản phẩm...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
