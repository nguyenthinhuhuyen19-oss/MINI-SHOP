"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      showToast("Vui lòng nhập đầy đủ thông tin", "error", "info");
      return;
    }

    if (password.trim().length < 6) {
      showToast("Mật khẩu phải có ít nhất 6 ký tự", "error", "info");
      return;
    }

    setIsSubmitting(true);
    const res = await register(name, email, password);
    setIsSubmitting(false);

    if (res.success) {
      showToast("Đăng ký tài khoản thành công! Bạn đã tự động đăng nhập.", "success", "check");
      router.push("/");
    } else {
      showToast(res.error || "Đăng ký thất bại, vui lòng thử lại.", "error", "info");
    }
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

              <button
                type="submit"
                className="btn-checkout"
                disabled={isSubmitting}
                style={{ marginTop: 24, padding: 14, fontSize: "1rem" }}
              >
                {isSubmitting ? "Đang tạo tài khoản..." : "Đăng Ký Tài Khoản"}
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
