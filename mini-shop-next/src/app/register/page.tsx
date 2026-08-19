"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      showToast("Vui lòng nhập đầy đủ thông tin", "error", "info");
      return;
    }

    login(email, "customer");
    showToast("Đăng ký tài khoản thành công! Bạn đã tự động đăng nhập.", "success", "check");
    router.push("/");
  };

  return (
    <main className="container">
      <Breadcrumb items={[{ label: "Đăng ký tài khoản", active: true }]} />

      <section className="auth-page-section">
        <div className="auth-card-container card-animate">
          <div className="auth-card">
            <h1 className="auth-title">Đăng Ký Tài Khoản</h1>
            <p className="auth-subtitle">Tạo tài khoản để trải nghiệm mua sắm tuyệt vời</p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="regName">
                  Họ và tên <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  id="regName"
                  placeholder="Nhập họ và tên của bạn"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="regEmail">
                  Địa chỉ Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  className="form-input"
                  id="regEmail"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="regPassword">
                  Mật khẩu <span className="required">*</span>
                </label>
                <input
                  type="password"
                  className="form-input"
                  id="regPassword"
                  placeholder="Ít nhất 6 ký tự"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-checkout" style={{ marginTop: 24, padding: 14, fontSize: "1rem" }}>
                Đăng Ký Tài Khoản
              </button>
            </form>

            <div className="auth-switch-text">
              Đã có tài khoản? <Link href="/login" className="auth-switch-link">Đăng nhập ngay</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
