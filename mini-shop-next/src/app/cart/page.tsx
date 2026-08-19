"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumb";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();

  const subtotal = getCartTotal();
  const shipping = subtotal >= 500000 || subtotal === 0 ? 0 : 30000;
  const total = subtotal + shipping;

  return (
    <main className="container">
      <Breadcrumb items={[{ label: "Giỏ hàng", active: true }]} />

      <section className="cart-page-section">
        <h1 className="cart-page-title">Giỏ hàng của bạn</h1>

        {cart.length === 0 ? (
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
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <h3 style={{ fontSize: "1.2rem", color: "var(--dark)", marginBottom: 8 }}>
              Giỏ hàng của bạn đang trống
            </h3>
            <p style={{ fontSize: "0.9rem", color: "var(--gray-muted)", marginBottom: 24 }}>
              Hãy khám phá các sản phẩm tuyệt vời của Mini Shop và thêm vào giỏ hàng nhé!
            </p>
            <Link href="/products" className="btn-hero" style={{ padding: "12px 24px" }}>
              Khám phá sản phẩm
            </Link>
          </div>
        ) : (
          <div className="cart-grid-layout">
            <div className="cart-table-card card-animate">
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Đơn giá</th>
                    <th>Số lượng</th>
                    <th>Thành tiền</th>
                    <th style={{ width: 40 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="cart-item-info">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="cart-item-img"
                          />
                          <div>
                            <div className="cart-item-title">{item.name}</div>
                            <div style={{ fontSize: "0.78rem", color: "var(--gray-muted)" }}>
                              {item.categoryName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontWeight: 600 }}>{item.priceFormatted}</td>
                      <td>
                        <div className="qty-control" style={{ width: 100 }}>
                          <button
                            className="qty-btn"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            -
                          </button>
                          <input
                            type="text"
                            className="qty-input"
                            value={item.quantity}
                            readOnly
                          />
                          <button
                            className="qty-btn"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td style={{ fontWeight: 800, color: "var(--primary)" }}>
                        {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                      </td>
                      <td>
                        <button
                          style={{
                            background: "none",
                            border: "none",
                            color: "#ef4444",
                            cursor: "pointer",
                            padding: 4,
                          }}
                          onClick={() => removeFromCart(item.id)}
                          title="Xóa món này"
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="cart-summary-card card-animate">
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: 20 }}>
                Tóm tắt đơn hàng
              </h3>

              <div className="summary-row">
                <span>Tạm tính ({cart.length} món):</span>
                <span style={{ fontWeight: 700, color: "var(--dark)" }}>
                  {subtotal.toLocaleString("vi-VN")}đ
                </span>
              </div>

              <div className="summary-row">
                <span>Phí vận chuyển:</span>
                <span style={{ fontWeight: 700, color: shipping === 0 ? "var(--primary)" : "var(--dark)" }}>
                  {shipping === 0 ? "Miễn phí" : `${shipping.toLocaleString("vi-VN")}đ`}
                </span>
              </div>

              <div className="summary-row total">
                <span>Tổng cộng:</span>
                <span style={{ color: "var(--primary)" }}>
                  {total.toLocaleString("vi-VN")}đ
                </span>
              </div>

              <Link href="/checkout" className="btn-checkout">
                Tiến hành thanh toán
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
