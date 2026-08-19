"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleFillDemo = (type: "user" | "admin") => {
    if (type === "user") {
      setEmail("user@minishop.vn");
      setPassword("123456");
    } else {
      setEmail("admin@minishop.vn");
      setPassword("admin123");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast("Vui lòng nhập đầy đủ email và mật khẩu", "error", "info");
      return;
    }

    const isAdmin = email.toLowerCase().includes("admin");
    login(email, isAdmin ? "admin" : "customer");
    showToast(`Đăng nhập thành công! Chào mừng ${isAdmin ? "Quản Trị Viên" : "Khách Hàng"}`, "success", "check");

    if (isAdmin) {
      router.push("/admin/dashboard");
    } else {
      router.push("/");
    }
  };

  return (
    <main className="container">
      <Breadcrumb items={[{ label: "Đăng nhập", active: true }]} />

      <section className="auth-page-section">
        <div className="auth-card-container card-animate">
          <div className="auth-card">
            <h1 className="auth-title">Đăng Nhập</h1>
            <p className="auth-subtitle">Chào mừng bạn quay trở lại Mini Shop</p>

            {/* Demo Credentials Box */}
            <div className="demo-credentials-box">
              <div className="demo-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                Tài khoản thử nghiệm nhanh:
              </div>
              <div className="demo-row">
                <span>👤 <strong>Khách hàng:</strong> user@minishop.vn / 123456</span>
                <button type="button" className="btn-demo-fill" onClick={() => handleFillDemo("user")}>
                  Điền mẫu
                </button>
              </div>
              <div className="demo-row">
                <span>🔑 <strong>Admin:</strong> admin@minishop.vn / admin123</span>
                <button type="button" className="btn-demo-fill" onClick={() => handleFillDemo("admin")}>
                  Điền mẫu
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="loginEmail">
                  Email hoặc Tên đăng nhập <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  id="loginEmail"
                  placeholder="Nhập email hoặc tên đăng nhập"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="loginPassword">
                  Mật khẩu <span className="required">*</span>
                </label>
                <input
                  type="password"
                  className="form-input"
                  id="loginPassword"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-checkout" style={{ marginTop: 24, padding: 14, fontSize: "1rem" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                Đăng Nhập
              </button>
            </form>

            <div className="auth-switch-text">
              Chưa có tài khoản? <Link href="/register" className="auth-switch-link">Đăng ký ngay</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
