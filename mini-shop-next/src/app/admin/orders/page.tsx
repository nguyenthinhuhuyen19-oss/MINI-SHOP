"use client";

import React, { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { useToast } from "@/context/ToastContext";

interface Order {
  id: string;
  customer: string;
  phone: string;
  address: string;
  date: string;
  itemsCount: number;
  total: string;
  status: "Completed" | "Processing" | "Shipping" | "Cancelled";
}

export default function AdminOrdersPage() {
  const { showToast } = useToast();

  const [orders, setOrders] = useState<Order[]>([
    {
      id: "#MS-94820",
      customer: "Nguyễn Văn A",
      phone: "0912345678",
      address: "123 Đường Lê Lợi, Q.1, TP.HCM",
      date: "16/08/2026",
      itemsCount: 2,
      total: "580.000đ",
      status: "Completed",
    },
    {
      id: "#MS-83912",
      customer: "Trần Thị B",
      phone: "0987654321",
      address: "456 Phố Huế, Q.Hai Bà Trưng, Hà Nội",
      date: "15/08/2026",
      itemsCount: 1,
      total: "290.000đ",
      status: "Processing",
    },
    {
      id: "#MS-71934",
      customer: "Lê Hoàng C",
      phone: "0905112233",
      address: "78 Nguyễn Văn Linh, Q.Hải Châu, Đà Nẵng",
      date: "14/08/2026",
      itemsCount: 3,
      total: "1.290.000đ",
      status: "Shipping",
    },
    {
      id: "#MS-62810",
      customer: "Phạm Minh D",
      phone: "0944889900",
      address: "12 Trần Phú, Q.Ninh Kiều, Cần Thơ",
      date: "12/08/2026",
      itemsCount: 1,
      total: "199.000đ",
      status: "Cancelled",
    },
  ]);

  const handleStatusClick = (orderId: string) => {
    showToast(`Đang cập nhật trạng thái chi tiết đơn hàng ${orderId}`, "info", "info");
  };

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "Completed":
        return <span className="badge-status-completed">Hoàn thành</span>;
      case "Processing":
        return <span className="badge-status-processing">Đang xử lý</span>;
      case "Shipping":
        return <span className="badge-status-processing" style={{ background: "#fef3c7", color: "#d97706" }}>Đang giao hàng</span>;
      case "Cancelled":
        return <span className="badge-status-cancelled">Đã hủy</span>;
    }
  };

  return (
    <>
      <AdminHeader title="Quản Lý Đơn Hàng Khách Đặt" />

      <div className="dashboard-card">
        <div className="card-head">
          <h3 className="card-title">Danh sách đơn hàng gần đây ({orders.length})</h3>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}>#</th>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Địa chỉ giao hàng</th>
              <th>Ngày đặt</th>
              <th>Số món</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th style={{ width: 100 }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={order.id}>
                <td style={{ fontWeight: 700, color: "var(--gray-muted)" }}>{idx + 1}</td>
                <td style={{ fontWeight: 800, color: "var(--primary)" }}>{order.id}</td>
                <td>
                  <div style={{ fontWeight: 700, color: "var(--dark)" }}>{order.customer}</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--gray-muted)" }}>{order.phone}</div>
                </td>
                <td style={{ fontSize: "0.82rem", color: "var(--dark-muted)", maxWidth: 220 }}>
                  {order.address}
                </td>
                <td style={{ fontSize: "0.82rem", color: "var(--gray-muted)" }}>{order.date}</td>
                <td style={{ fontWeight: 600 }}>{order.itemsCount} món</td>
                <td style={{ fontWeight: 800, color: "var(--dark)" }}>{order.total}</td>
                <td>{getStatusBadge(order.status)}</td>
                <td>
                  <button className="btn-action-edit" onClick={() => handleStatusClick(order.id)}>
                    Chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
