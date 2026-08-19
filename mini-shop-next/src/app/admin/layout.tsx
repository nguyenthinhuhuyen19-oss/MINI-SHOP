import React from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-body">
      <AdminSidebar />
      <div className="admin-main">{children}</div>
    </div>
  );
}
