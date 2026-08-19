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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast("Vui lòng nhập đầy đủ email và mật khẩu", "error", "info");
      return;
    }

    setIsSubmitting(true);
    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.success) {
      const isAdmin = email.toLowerCase().includes("admin");
      showToast("Đăng nhập thành công!", "success", "check");
      if (isAdmin) {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    } else {
      showToast(res.error || "Tài khoản hoặc mật khẩu không chính xác", "error", "info");
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

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="loginEmail">
                  Địa chỉ Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  className="form-input"
                  id="loginEmail"
                  placeholder="name@example.com"
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

              <button
                type="submit"
                className="btn-checkout"
                disabled={isSubmitting}
                style={{ marginTop: 24, padding: 14, fontSize: "1rem" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                {isSubmitting ? "Đang đăng nhập..." : "Đăng Nhập"}
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
