"use client";

import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { useToast } from "@/context/ToastContext";
import { supabase } from "@/lib/supabaseClient";

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  email?: string;
  notes?: string;
  payment_method?: string;
  items_summary?: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export default function AdminOrdersPage() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setOrders(data);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (!error) {
        showToast("Đã cập nhật trạng thái đơn hàng!", "success", "check");
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      } else {
        showToast("Cập nhật trạng thái thất bại", "error", "info");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      showToast("Đã xảy ra lỗi khi cập nhật", "error", "info");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <span className="badge-status-completed">Đã giao (Hoàn thành)</span>;
      case "Shipping":
        return (
          <span
            className="badge-status-processing"
            style={{ background: "#fef3c7", color: "#d97706" }}
          >
            Đang giao hàng
          </span>
        );
      case "Cancelled":
        return <span className="badge-status-cancelled">Đã hủy</span>;
      case "Pending":
      default:
        return <span className="badge-status-processing">Đơn mới (Chờ xử lý)</span>;
    }
  };

  return (
    <>
      <AdminHeader title="Quản Lý Đơn Hàng Khách Đặt" />

      <div className="dashboard-card">
        <div className="card-head">
          <h3 className="card-title">
            Danh sách đơn hàng thực tế ({orders.length}){" "}
            {isLoading && (
              <span style={{ fontSize: "0.8rem", color: "var(--gray-muted)" }}>
                (Đang tải từ Supabase...)
              </span>
            )}
          </h3>
          <button
            className="btn-primary-admin"
            style={{ width: "auto", padding: "6px 12px", fontSize: "0.82rem" }}
            onClick={fetchOrders}
          >
            🔄 Tải lại dữ liệu
          </button>
        </div>

        {orders.length === 0 && !isLoading ? (
          <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--gray-muted)" }}>
            Chưa có đơn đặt hàng nào trong kho Supabase.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}>#</th>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Địa chỉ giao hàng</th>
                <th>Danh sách món</th>
                <th>Tổng tiền</th>
                <th>Trạng thái hiện tại</th>
                <th style={{ width: 180 }}>Đổi trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => {
                const shortId = `#MS-${String(order.id).slice(0, 8).toUpperCase()}`;
                const formattedDate = new Date(order.created_at || Date.now()).toLocaleDateString("vi-VN");

                return (
                  <tr key={order.id}>
                    <td style={{ fontWeight: 700, color: "var(--gray-muted)" }}>{idx + 1}</td>
                    <td style={{ fontWeight: 800, color: "var(--primary)" }}>{shortId}</td>
                    <td>
                      <div style={{ fontWeight: 700, color: "var(--dark)" }}>
                        {order.customer_name}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--gray-muted)" }}>
                        {order.customer_phone}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--gray-light)" }}>
                        {formattedDate}
                      </div>
                    </td>
                    <td style={{ fontSize: "0.82rem", color: "var(--dark-muted)", maxWidth: 200 }}>
                      {order.customer_address}
                    </td>
                    <td style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--dark)" }}>
                      {order.items_summary || "Hàng hóa mua sắm"}
                    </td>
                    <td style={{ fontWeight: 800, color: "var(--primary)" }}>
                      {Number(order.total_amount).toLocaleString("vi-VN")}đ
                    </td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td>
                      <select
                        className="admin-form-select"
                        style={{ padding: "6px 10px", fontSize: "0.82rem", width: "100%" }}
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                      >
                        <option value="Pending">Mới (Chờ xử lý)</option>
                        <option value="Shipping">Đang giao hàng</option>
                        <option value="Completed">Đã giao (Hoàn thành)</option>
                        <option value="Cancelled">Đã hủy đơn</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
