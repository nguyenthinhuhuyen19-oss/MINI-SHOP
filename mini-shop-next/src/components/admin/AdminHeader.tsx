"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";

export default function AdminHeader({ title }: { title: string }) {
  const { currentUser } = useAuth();

  return (
    <div className="admin-header">
      <h1 className="admin-page-title">{title}</h1>

      <div className="admin-header-right">
        <input type="text" className="admin-search-input" placeholder="Tìm kiếm hệ thống..." />

        <div className="admin-profile-badge">
          <div className="admin-avatar">A</div>
          <span>{currentUser?.name || "Quản trị viên"}</span>
        </div>
      </div>
    </div>
  );
}
