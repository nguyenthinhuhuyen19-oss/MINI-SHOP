"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import AdminHeader from "@/components/admin/AdminHeader";
import { Product, fetchProductsFromSupabase } from "@/lib/productsData";
import { supabase } from "@/lib/supabaseClient";

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [ordersCount, setOrdersCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setIsLoading(true);
      const prods = await fetchProductsFromSupabase();
      setProducts(prods);

      try {
        const { data: ordersData } = await supabase.from("orders").select("total_amount");
        if (ordersData) {
          setOrdersCount(ordersData.length);
          const revenue = ordersData.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
          setTotalRevenue(revenue);
        }
      } catch (err) {
        console.error("Dashboard metrics error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const recentProducts = products.slice(0, 5);

  return (
    <>
      <AdminHeader title="Dashboard Quản Trị" />

      {/* Stat Cards Grid */}
      <div className="stat-cards-grid">
        <div className="stat-card">
          <div>
            <div className="stat-val">{products.length}</div>
            <div className="stat-lbl">Tổng sản phẩm thực tế</div>
          </div>
          <div className="stat-icon" style={{ background: "var(--primary-light)", color: "var(--primary)" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            </svg>
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-val">{ordersCount}</div>
            <div className="stat-lbl">Tổng đơn đặt hàng</div>
          </div>
          <div className="stat-icon" style={{ background: "#eff6ff", color: "#2563eb" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
            </svg>
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-val">{totalRevenue.toLocaleString("vi-VN")}đ</div>
            <div className="stat-lbl">Doanh thu tích lũy</div>
          </div>
          <div className="stat-icon" style={{ background: "#f0fdf4", color: "#16a34a" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-val">6</div>
            <div className="stat-lbl">Danh mục sản phẩm</div>
          </div>
          <div className="stat-icon" style={{ background: "#fff7ed", color: "#ea580c" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-grid-2">
        <div className="dashboard-card">
          <div className="card-head">
            <h3 className="card-title">Tổng quan doanh thu cửa hàng</h3>
            <span
              style={{
                fontSize: "0.82rem",
                fontWeight: 700,
                color: "var(--primary)",
                background: "var(--primary-light)",
                padding: "4px 10px",
                borderRadius: "var(--radius-full)",
              }}
            >
              Supabase Live
            </span>
          </div>

          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--dark)", marginBottom: 16 }}>
            {totalRevenue.toLocaleString("vi-VN")}đ
          </div>

          <div
            style={{
              background: "var(--admin-bg)",
              borderRadius: "var(--radius-md)",
              padding: 20,
              textAlign: "center",
              color: "var(--gray-muted)",
              fontSize: "0.88rem",
              border: "1px dashed var(--admin-border)",
            }}
          >
            [ Dữ liệu đơn hàng và tổng giá trị thanh toán được đồng bộ trực tiếp từ Supabase Database ]
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-head">
            <h3 className="card-title">
              Sản phẩm mới nhất {isLoading && <span style={{ fontSize: "0.8rem", color: "var(--gray-muted)" }}>(Đang tải...)</span>}
            </h3>
            <Link href="/admin/products" style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--primary)" }}>
              Xem tất cả
            </Link>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Danh mục</th>
                <th>Giá bán</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 700 }}>
                      <Image
                        src={p.image}
                        alt={p.name}
                        width={36}
                        height={36}
                        style={{ borderRadius: 6, objectFit: "cover", border: "1px solid #e2e8f0" }}
                      />
                      <span>{p.name}</span>
                    </div>
                  </td>
                  <td style={{ color: "var(--gray-muted)" }}>{p.categoryName}</td>
                  <td style={{ fontWeight: 700, color: "var(--dark)" }}>{p.priceFormatted}</td>
                  <td>
                    <span className="badge-visible">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
