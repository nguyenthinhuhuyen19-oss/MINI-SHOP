"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { currentUser, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!currentUser || currentUser.role !== "admin") {
        router.push("/login");
      }
    }
  }, [currentUser, loading, router]);

  if (loading) {
    return (
      <div style={{ padding: "80px 20px", textAlign: "center", fontSize: "1rem", color: "var(--dark-muted)" }}>
        Đang kiểm tra quyền truy cập khu vực Quản trị...
      </div>
    );
  }

  if (!currentUser || currentUser.role !== "admin") {
    return null;
  }

  return (
    <div className="admin-body">
      <AdminSidebar />
      <div className="admin-main">{children}</div>
    </div>
  );
}
