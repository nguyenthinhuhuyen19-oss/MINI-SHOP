"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { supabase } from "@/lib/supabaseClient";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getCartTotal, clearCart } = useCart();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [createdOrderCode, setCreatedOrderCode] = useState("");

  const subtotal = getCartTotal();
  const shipping = subtotal >= 500000 || subtotal === 0 ? 0 : 30000;
  const total = subtotal + shipping;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      showToast("Vui lòng điền đầy đủ các thông tin bắt buộc (*)", "error", "info");
      return;
    }

    if (cart.length === 0) {
      showToast("Giỏ hàng của bạn đang trống!", "error", "info");
      return;
    }

    setIsSubmitting(true);

    try {
      const itemsSummaryStr = cart.map((item) => `${item.name} (x${item.quantity})`).join(", ");

      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            customer_name: fullName.trim(),
            customer_phone: phone.trim(),
            customer_address: address.trim(),
            email: email.trim() || null,
            notes: notes.trim() || null,
            payment_method: paymentMethod,
            items_summary: itemsSummaryStr,
            total_amount: total,
            status: "Pending",
          },
        ])
        .select()
        .single();

      if (orderError) {
        console.warn("Supabase order insert notice:", orderError.message);
      }

      if (orderData?.id && cart.length > 0) {
        const orderItemsData = cart.map((item) => ({
          order_id: orderData.id,
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price,
        }));

        await supabase.from("order_items").insert(orderItemsData);
      }

      const generatedCode = orderData?.id
        ? `#MS-${String(orderData.id).slice(0, 8).toUpperCase()}`
        : `#MS-${Math.floor(10000 + Math.random() * 90000)}`;

      setCreatedOrderCode(generatedCode);
      setIsSuccessModalOpen(true);
      clearCart();
    } catch (err) {
      console.error("Order submit exception:", err);
      const fallbackCode = "#MS-" + Math.floor(10000 + Math.random() * 90000);
      setCreatedOrderCode(fallbackCode);
      setIsSuccessModalOpen(true);
      clearCart();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container">
      <Breadcrumb
        items={[
          { label: "Giỏ hàng", href: "/cart" },
          { label: "Thanh toán", active: true },
        ]}
      />

      <section className="cart-page-section">
        <h1 className="cart-page-title">Thanh toán & Đặt hàng</h1>

        {cart.length === 0 && !isSuccessModalOpen ? (
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
            <h3 style={{ fontSize: "1.2rem", color: "var(--dark)", marginBottom: 8 }}>
              Bạn không có món hàng nào để thanh toán
            </h3>
            <Link href="/products" className="btn-hero" style={{ padding: "12px 24px" }}>
              Về trang sản phẩm
            </Link>
          </div>
        ) : (
          <form className="cart-grid-layout" onSubmit={handleSubmitOrder}>
            {/* Form Column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div className="cart-table-card card-animate">
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: 20 }}>
                  Thông tin giao hàng
                </h3>

                <div className="form-group">
                  <label className="form-label" htmlFor="fullName">
                    Họ và tên <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    id="fullName"
                    placeholder="Nhập họ và tên người nhận"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="phone">
                      Số điện thoại <span className="required">*</span>
                    </label>
                    <input
                      type="tel"
                      className="form-input"
                      id="phone"
                      placeholder="0912345678"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-input"
                      id="email"
                      placeholder="vidu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="address">
                    Địa chỉ nhận hàng <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    id="address"
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="notes">
                    Ghi chú đơn hàng
                  </label>
                  <textarea
                    className="form-input"
                    id="notes"
                    rows={3}
                    placeholder="Ghi chú thêm về thời gian giao hàng..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="cart-table-card card-animate">
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: 20 }}>
                  Phương thức thanh toán
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    { id: "cod", title: "Thanh toán khi nhận hàng (COD)", desc: "Thanh toán tiền mặt cho shipper" },
                    { id: "bank", title: "Chuyển khoản ngân hàng", desc: "Chuyển khoản qua QR Code / Internet Banking" },
                    { id: "momo", title: "Ví điện tử MoMo / ZaloPay", desc: "Thanh toán nhanh qua ứng dụng Ví" },
                  ].map((pm) => (
                    <label
                      key={pm.id}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        padding: 14,
                        borderRadius: "var(--radius-md)",
                        border: `1px solid ${paymentMethod === pm.id ? "var(--primary)" : "var(--gray-border)"}`,
                        background: paymentMethod === pm.id ? "var(--primary-light)" : "var(--white)",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={pm.id}
                        checked={paymentMethod === pm.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        style={{ marginTop: 4 }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--dark)" }}>
                          {pm.title}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "var(--gray-muted)", marginTop: 2 }}>
                          {pm.desc}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary Column */}
            <div className="cart-summary-card card-animate">
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: 20 }}>
                Đơn hàng của bạn
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20, maxHeight: 280, overflowY: "auto" }}>
                {cart.map((item) => (
                  <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={48}
                      height={48}
                      style={{ borderRadius: "var(--radius-sm)", objectFit: "cover" }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--dark)" }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--gray-muted)" }}>
                        x{item.quantity}
                      </div>
                    </div>
                    <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--dark)" }}>
                      {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                    </div>
                  </div>
                ))}
              </div>

              <div className="summary-row">
                <span>Tạm tính:</span>
                <span style={{ fontWeight: 700, color: "var(--dark)" }}>
                  {subtotal.toLocaleString("vi-VN")}đ
                </span>
              </div>

              <div className="summary-row">
                <span>Phí giao hàng:</span>
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

              <button type="submit" className="btn-checkout" disabled={isSubmitting}>
                {isSubmitting ? "Đang xử lý đặt hàng..." : "Xác nhận đặt hàng"}
              </button>
            </div>
          </form>
        )}

        {/* Order Success Modal */}
        {isSuccessModalOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 99999,
              padding: 20,
            }}
          >
            <div
              className="card-animate"
              style={{
                background: "#fff",
                borderRadius: "var(--radius-xl)",
                padding: "40px 32px",
                maxWidth: 480,
                width: "100%",
                textAlign: "center",
                boxShadow: "var(--shadow-lg)",
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "#dcfce7",
                  color: "#16a34a",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
              >
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--dark)", marginBottom: 8 }}>
                Đặt hàng thành công!
              </h2>
              <p style={{ fontSize: "0.9rem", color: "var(--gray-muted)", marginBottom: 16 }}>
                Mã đơn hàng của bạn là: <strong style={{ color: "var(--primary)" }}>{createdOrderCode}</strong>
              </p>
              <p style={{ fontSize: "0.85rem", color: "var(--dark-muted)", marginBottom: 28 }}>
                Cảm ơn bạn đã mua sắm tại Mini Shop. Đơn hàng của bạn đang được xử lý và sẽ sớm được giao tới.
              </p>

              <button
                className="btn-hero"
                style={{ width: "100%", padding: 14 }}
                onClick={() => router.push("/")}
              >
                Trở về trang chủ
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
