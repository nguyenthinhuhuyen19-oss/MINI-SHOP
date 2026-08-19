"use client";

import React, { useState } from "react";
import Image from "next/image";
import AdminHeader from "@/components/admin/AdminHeader";
import { INITIAL_PRODUCTS_DATA, Product } from "@/lib/productsData";
import { useToast } from "@/context/ToastContext";

export default function AdminProductsPage() {
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS_DATA);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [nameInput, setNameInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("noi-that");
  const [priceInput, setPriceInput] = useState("");
  const [descInput, setDescInput] = useState("");

  const categories = [
    { key: "noi-that", name: "Nội thất", count: products.filter((p) => p.category === "noi-that").length },
    { key: "trang-tri", name: "Trang trí", count: products.filter((p) => p.category === "trang-tri").length },
    { key: "nha-bep", name: "Nhà bếp", count: products.filter((p) => p.category === "nha-bep").length },
    { key: "den", name: "Đèn", count: products.filter((p) => p.category === "den").length },
    { key: "luu-tru", name: "Lưu trữ", count: products.filter((p) => p.category === "luu-tru").length },
    { key: "van-phong", name: "Văn phòng", count: products.filter((p) => p.category === "van-phong").length },
  ];

  const categoryNameMap: Record<string, string> = {
    "noi-that": "Nội thất",
    "trang-tri": "Trang trí",
    "nha-bep": "Nhà bếp",
    den: "Đèn",
    "luu-tru": "Lưu trữ",
    "van-phong": "Văn phòng",
  };

  const resetForm = () => {
    setEditingId(null);
    setNameInput("");
    setCategoryInput("noi-that");
    setPriceInput("");
    setDescInput("");
  };

  const handleEditClick = (product: Product) => {
    setEditingId(product.id);
    setNameInput(product.name);
    setCategoryInput(product.category);
    setPriceInput(product.price.toString());
    setDescInput(product.description);
  };

  const handleDeleteClick = (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast("Đã xóa sản phẩm khỏi hệ thống", "success", "check");
      if (editingId === id) resetForm();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nameInput.trim() || !priceInput.trim()) {
      showToast("Vui lòng nhập đầy đủ tên và giá sản phẩm", "error", "info");
      return;
    }

    const price = Number(priceInput);
    const catName = categoryNameMap[categoryInput] || "Khác";

    if (editingId) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? {
                ...p,
                name: nameInput,
                category: categoryInput,
                categoryName: catName,
                price: price,
                priceFormatted: price.toLocaleString("vi-VN") + "đ",
                description: descInput || p.description,
              }
            : p
        )
      );
      showToast(`Đã cập nhật sản phẩm "${nameInput}"`, "success", "check");
    } else {
      const newProduct: Product = {
        id: Date.now(),
        name: nameInput,
        category: categoryInput,
        categoryName: catName,
        price: price,
        priceFormatted: price.toLocaleString("vi-VN") + "đ",
        description: descInput || "Sản phẩm vừa được thêm mới vào hệ thống",
        image: "/assets/images/products/do-my-nghe/binh-gom-trang-tri.webp",
        featured: true,
      };
      setProducts((prev) => [newProduct, ...prev]);
      showToast(`Đã thêm mới sản phẩm "${nameInput}"`, "success", "check");
    }

    resetForm();
  };

  return (
    <>
      <AdminHeader title="Quản Lý Sản Phẩm & Danh Mục" />

      <div className="admin-mgmt-grid">
        {/* Left / Middle Column (Tables) */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Products Table */}
          <div className="dashboard-card">
            <div className="card-head">
              <h3 className="card-title">Danh Sách Sản Phẩm ({products.length})</h3>
              <button className="btn-primary-admin" style={{ width: "auto", padding: "8px 16px" }} onClick={resetForm}>
                + Thêm Sản Phẩm
              </button>
            </div>

            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 40 }}>#</th>
                  <th style={{ width: 60 }}>Hình ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Giá bán</th>
                  <th>Trạng thái</th>
                  <th style={{ width: 140 }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, idx) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 700, color: "var(--gray-muted)" }}>{idx + 1}</td>
                    <td>
                      <Image
                        src={p.image}
                        alt={p.name}
                        width={40}
                        height={40}
                        style={{ borderRadius: 6, objectFit: "cover", border: "1px solid #e2e8f0" }}
                      />
                    </td>
                    <td style={{ fontWeight: 700, color: "var(--dark)" }}>{p.name}</td>
                    <td style={{ color: "var(--gray-muted)" }}>{p.categoryName}</td>
                    <td style={{ fontWeight: 800, color: "var(--dark)" }}>{p.priceFormatted}</td>
                    <td>
                      <span className="badge-visible">Active</span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="btn-action-edit" onClick={() => handleEditClick(p)}>
                          Sửa
                        </button>
                        <button className="btn-action-delete" onClick={() => handleDeleteClick(p.id)}>
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Categories Table */}
          <div className="dashboard-card">
            <div className="card-head">
              <h3 className="card-title">Danh Mục Sản Phẩm ({categories.length})</h3>
              <button
                className="btn-primary-admin"
                style={{ width: "auto", padding: "8px 16px", backgroundColor: "#2563eb" }}
                onClick={() => showToast("Tính năng thêm danh mục mới sẽ ra mắt ở bản v2", "info", "info")}
              >
                + Thêm danh mục
              </button>
            </div>

            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 40 }}>#</th>
                  <th>Tên danh mục</th>
                  <th>Số sản phẩm</th>
                  <th>Trạng thái</th>
                  <th style={{ width: 100 }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c, idx) => (
                  <tr key={c.key}>
                    <td style={{ fontWeight: 700, color: "var(--gray-muted)" }}>{idx + 1}</td>
                    <td style={{ fontWeight: 700, color: "var(--dark)" }}>{c.name}</td>
                    <td style={{ fontWeight: 700, color: "var(--primary)" }}>{c.count} món</td>
                    <td>
                      <span className="badge-visible">Active</span>
                    </td>
                    <td>
                      <button className="btn-action-edit" onClick={() => showToast(`Xem danh mục ${c.name}`, "info", "info")}>
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Product Form Sidebar */}
        <div className="dashboard-card" style={{ position: "sticky", top: 24 }}>
          <h3 className="card-title" style={{ marginBottom: 20 }}>
            {editingId ? "Chỉnh Sửa Sản Phẩm" : "Thêm Sản Phẩm Mới"}
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="productName">
                Tên sản phẩm *
              </label>
              <input
                type="text"
                className="admin-form-input"
                id="productName"
                placeholder="Nhập tên sản phẩm"
                required
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="productCategory">
                Danh mục *
              </label>
              <select
                className="admin-form-select"
                id="productCategory"
                required
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
              >
                <option value="noi-that">Nội thất (Furniture)</option>
                <option value="trang-tri">Trang trí (Decor)</option>
                <option value="nha-bep">Nhà bếp (Kitchen)</option>
                <option value="den">Đèn (Lighting)</option>
                <option value="luu-tru">Lưu trữ (Storage)</option>
                <option value="van-phong">Văn phòng (Office)</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="productPrice">
                Giá bán (VND) *
              </label>
              <input
                type="number"
                className="admin-form-input"
                id="productPrice"
                placeholder="290000"
                required
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Hình ảnh sản phẩm</label>
              <div className="upload-dropzone">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginBottom: 6 }}>
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <div>Click to upload image</div>
                <div style={{ fontSize: "0.72rem", color: "var(--gray-light)", marginTop: 2 }}>
                  PNG, JPG up to 2MB
                </div>
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="productDesc">
                Mô tả sản phẩm
              </label>
              <textarea
                className="admin-form-textarea"
                id="productDesc"
                rows={3}
                placeholder="Nhập mô tả ngắn gọn..."
                value={descInput}
                onChange={(e) => setDescInput(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary-admin">
              {editingId ? "Cập nhật sản phẩm" : "Lưu sản phẩm"}
            </button>
            <button type="button" className="btn-cancel-admin" onClick={resetForm}>
              Hủy / Thêm mới
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
