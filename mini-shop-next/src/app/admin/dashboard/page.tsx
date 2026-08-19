"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import AdminHeader from "@/components/admin/AdminHeader";
import { INITIAL_PRODUCTS_DATA } from "@/lib/productsData";

export default function AdminDashboardPage() {
  const recentProducts = INITIAL_PRODUCTS_DATA.slice(0, 5);

  return (
    <>
      <AdminHeader title="Dashboard Quản Trị" />

      {/* Stat Cards Grid */}
      <div className="stat-cards-grid">
        <div className="stat-card">
          <div>
            <div className="stat-val">{INITIAL_PRODUCTS_DATA.length}</div>
            <div className="stat-lbl">Tổng sản phẩm hiện có</div>
          </div>
          <div className="stat-icon" style={{ background: "var(--primary-light)", color: "var(--primary)" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            </svg>
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-val">6</div>
            <div className="stat-lbl">Danh mục sản phẩm</div>
          </div>
          <div className="stat-icon" style={{ background: "#eff6ff", color: "#2563eb" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-val">100%</div>
            <div className="stat-lbl">Tỷ lệ hiển thị (Visible)</div>
          </div>
          <div className="stat-icon" style={{ background: "#f0fdf4", color: "#16a34a" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-val">2 món</div>
            <div className="stat-lbl">Sản phẩm sắp hết (Low stock)</div>
          </div>
          <div className="stat-icon" style={{ background: "#fff7ed", color: "#ea580c" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-grid-2">
        <div className="dashboard-card">
          <div className="card-head">
            <h3 className="card-title">Tổng quan doanh thu 7 ngày qua</h3>
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
              +18.6%
            </span>
          </div>

          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--dark)", marginBottom: 16 }}>
            42.580.000đ
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
            [ Biểu đồ tăng trưởng doanh thu cửa hàng ]
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-head">
            <h3 className="card-title">Sản phẩm nổi bật gần đây</h3>
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
