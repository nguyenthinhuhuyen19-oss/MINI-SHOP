"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  INITIAL_PRODUCTS_DATA,
  Product,
  fetchProductsFromSupabase,
  createProductInSupabase,
  updateProductInSupabase,
  deleteProductInSupabase,
} from "@/lib/productsData";
import { useToast } from "@/context/ToastContext";

export default function AdminProductsPage() {
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS_DATA);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [nameInput, setNameInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("noi-that");
  const [priceInput, setPriceInput] = useState("");
  const [descInput, setDescInput] = useState("");
  const [imageInput, setImageInput] = useState("/assets/images/products/do-my-nghe/binh-gom-trang-tri.webp");

  const availableImages = [
    { label: "Bình gốm Decor", url: "/assets/images/products/do-my-nghe/binh-gom-trang-tri.webp" },
    { label: "Sofa 2 chỗ Nordic", url: "/assets/images/products/noi-that-gia-dung/sofa-phong-khach.webp" },
    { label: "Bàn ăn gỗ Sồi", url: "/assets/images/products/noi-that-gia-dung/bo-ban-an-go.webp" },
    { label: "Đèn thả trần Minimal", url: "/assets/images/products/do-my-nghe/den-tre-thu-cong.webp" },
    { label: "Kệ gỗ trang trí", url: "/assets/images/products/noi-that-gia-dung/ke-go-trang-tri.webp" },
    { label: "Giỏ mây lưu trữ", url: "/assets/images/products/do-thu-cong/gio-may-dan.webp" },
    { label: "Khay gỗ hoa văn", url: "/assets/images/products/do-thu-cong/khay-go-hoa-van.webp" },
    { label: "Tranh treo Macrame", url: "/assets/images/products/do-thu-cong/tranh-treo-macrame.webp" },
    { label: "Chậu cây để bàn", url: "/assets/images/products/noi-that-gia-dung/chau-cay-de-ban.webp" },
    { label: "Đèn lồng tre", url: "/assets/images/products/do-my-nghe/den-long-tre.webp" },
  ];

  const loadData = async () => {
    setIsLoading(true);
    const data = await fetchProductsFromSupabase();
    setProducts(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

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
    setImageInput("/assets/images/products/do-my-nghe/binh-gom-trang-tri.webp");
  };

  const handleEditClick = (product: Product) => {
    setEditingId(product.id);
    setNameInput(product.name);
    setCategoryInput(product.category);
    setPriceInput(product.price.toString());
    setDescInput(product.description);
    setImageInput(product.image);
  };

  const handleDeleteClick = async (id: number, name: string) => {
    const isConfirmed = window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}" khỏi cơ sở dữ liệu Supabase không?`);
    if (!isConfirmed) return;

    const ok = await deleteProductInSupabase(id);
    if (ok) {
      showToast(`Đã xóa sản phẩm "${name}" khỏi kho Supabase`, "success", "check");
      await loadData();
      if (editingId === id) resetForm();
    } else {
      showToast("Xóa sản phẩm thất bại", "error", "info");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nameInput.trim() || !priceInput.trim()) {
      showToast("Vui lòng nhập đầy đủ tên và giá sản phẩm", "error", "info");
      return;
    }

    const price = Number(priceInput);

    setIsSaving(true);
    if (editingId) {
      const ok = await updateProductInSupabase(editingId, {
        name: nameInput.trim(),
        category: categoryInput,
        price,
        description: descInput.trim(),
      });

      if (ok) {
        showToast(`Đã cập nhật sản phẩm "${nameInput}" trên Supabase`, "success", "check");
        await loadData();
        resetForm();
      } else {
        showToast("Cập nhật sản phẩm thất bại", "error", "info");
      }
    } else {
      const ok = await createProductInSupabase({
        name: nameInput.trim(),
        category: categoryInput,
        price,
        description: descInput.trim(),
        image: imageInput,
      });

      if (ok) {
        showToast(`Đã thêm mới sản phẩm "${nameInput}" vào Supabase`, "success", "check");
        await loadData();
        resetForm();
      } else {
        showToast("Thêm mới sản phẩm thất bại", "error", "info");
      }
    }
    setIsSaving(false);
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
              <h3 className="card-title">
                Danh Sách Sản Phẩm ({products.length}) {isLoading && <span style={{ fontSize: "0.8rem", color: "var(--gray-muted)" }}>(Đang tải...)</span>}
              </h3>
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
                        <button className="btn-action-delete" onClick={() => handleDeleteClick(p.id, p.name)}>
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
            </div>

            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 40 }}>#</th>
                  <th>Tên danh mục</th>
                  <th>Số sản phẩm</th>
                  <th>Trạng thái</th>
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
              <label className="admin-form-label" htmlFor="productImage">Chọn hình ảnh có sẵn *</label>
              <select
                className="admin-form-select"
                id="productImage"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
              >
                {availableImages.map((img) => (
                  <option key={img.url} value={img.url}>
                    {img.label}
                  </option>
                ))}
              </select>
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

            <button type="submit" className="btn-primary-admin" disabled={isSaving}>
              {isSaving ? "Đang lưu..." : editingId ? "Cập nhật sản phẩm" : "Lưu sản phẩm"}
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
