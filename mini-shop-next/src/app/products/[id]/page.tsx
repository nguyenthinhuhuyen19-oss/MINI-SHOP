"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { INITIAL_PRODUCTS_DATA } from "@/lib/productsData";
import ProductCard from "@/components/ProductCard";
import Breadcrumb from "@/components/Breadcrumb";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";

export default function ProductDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const product = INITIAL_PRODUCTS_DATA.find((p) => p.id === id) || INITIAL_PRODUCTS_DATA[0];

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.image);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const isWishlisted = isInWishlist(product.id);

  const relatedProducts = INITIAL_PRODUCTS_DATA.filter(
    (p) => p.id !== product.id && p.category === product.category
  ).slice(0, 5);

  const galleryImages = [
    product.image,
    product.image,
    product.image,
  ];

  const handleAddToCart = () => {
    addToCart(product, quantity);
    showToast(`Đã thêm ${quantity}x ${product.name} vào giỏ hàng!`, "success", "cart");
  };

  const handleWishlistToggle = () => {
    const added = toggleWishlist(product.id);
    if (added) {
      showToast(`Đã thêm ${product.name} vào danh sách yêu thích`, "success", "heart");
    } else {
      showToast(`Đã xóa ${product.name} khỏi danh sách yêu thích`, "info", "heart");
    }
  };

  return (
    <main className="container">
      <Breadcrumb
        items={[
          { label: product.categoryName, href: "/products" },
          { label: product.name, active: true },
        ]}
      />

      <section className="detail-main-section">
        <div className="detail-grid-container">
          {/* Thumbnail Gallery Column */}
          <div className="gallery-thumbs-col">
            {galleryImages.map((img, idx) => (
              <div
                key={idx}
                className={`thumb-item ${selectedImage === img ? "active" : ""}`}
                onClick={() => setSelectedImage(img)}
              >
                <Image src={img} alt="Thumbnail" width={76} height={76} style={{ objectFit: "cover" }} />
              </div>
            ))}
          </div>

          {/* Main Image Preview Column */}
          <div className="gallery-main-col">
            <div className="gallery-main-container">
              <Image
                src={selectedImage}
                alt={product.name}
                width={420}
                height={440}
                style={{ objectFit: "cover", width: "100%", height: 440 }}
                priority
              />
            </div>
          </div>

          {/* Main Info Column */}
          <div className="product-info-col">
            <div className="detail-badge-group">
              <span className="badge-in-stock">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Còn hàng
              </span>
              <span className="badge-cat-tag">{product.categoryName}</span>
            </div>

            <h1 className="detail-product-title">{product.name}</h1>

            <div className="rating-row">
              <div className="star-group">★ ★ ★ ★ ★</div>
              <span className="review-count-text">(48 đánh giá)</span>
            </div>

            <div className="detail-price-box">
              <span className="detail-current-price">{product.priceFormatted}</span>
              <span className="detail-old-price">{(product.price * 1.25).toLocaleString("vi-VN")}đ</span>
              <span className="detail-discount-tag">-20%</span>
            </div>

            <p className="detail-description-text">{product.description}</p>

            <div className="qty-selection-row">
              <span className="qty-label">Số lượng:</span>
              <div className="qty-control">
                <button
                  className="qty-btn"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Giảm số lượng"
                >
                  -
                </button>
                <input type="text" className="qty-input" value={quantity} readOnly />
                <button
                  className="qty-btn"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Tăng số lượng"
                >
                  +
                </button>
              </div>
            </div>

            <div className="detail-actions-row">
              <button className="btn-add-cart" onClick={handleAddToCart}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                Thêm vào giỏ hàng
              </button>
              <button
                className={`btn-detail-wishlist ${isWishlisted ? "active" : ""}`}
                onClick={handleWishlistToggle}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill={isWishlisted ? "#ef4444" : "none"} stroke={isWishlisted ? "#ef4444" : "currentColor"} strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                Yêu thích
              </button>
            </div>

            <div className="guarantee-badges-row">
              <div className="guarantee-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                <div>
                  <strong>Miễn phí vận chuyển</strong>
                  <div>Đơn từ 500.000đ</div>
                </div>
              </div>
              <div className="guarantee-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <div>
                  <strong>30 ngày đổi trả</strong>
                  <div>Dễ dàng & nhanh chóng</div>
                </div>
              </div>
              <div className="guarantee-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <div>
                  <strong>Thanh toán an toàn</strong>
                  <div>Bảo mật 100%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Specs Sidebar */}
          <div className="detail-sidebar-col">
            <div className="detail-spec-card">
              <h3 className="spec-card-title">Chi tiết sản phẩm</h3>
              <div className="spec-table">
                <div className="spec-row">
                  <span className="spec-label">Chất liệu:</span>
                  <span className="spec-value">Gốm sứ / Gỗ sồi</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Màu sắc:</span>
                  <span className="spec-value">Mộc mạc / Tự nhiên</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Kích thước:</span>
                  <span className="spec-value">Cao: 20cm, Rộng: 15cm</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Trọng lượng:</span>
                  <span className="spec-value">1.2 kg</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Xuất xứ:</span>
                  <span className="spec-value">Việt Nam</span>
                </div>
              </div>
            </div>

            <div className="delivery-info-card">
              <h3 className="spec-card-title">Giao hàng & Đổi trả</h3>
              <ul className="delivery-list">
                <li>Thời gian giao hàng: 2–5 ngày làm việc</li>
                <li>Giao hàng hỏa tốc: 1–2 ngày</li>
                <li>Phí giao hàng: 30.000đ (Miễn phí đơn từ 500k)</li>
              </ul>
              <a href="#" className="more-delivery-link">Xem chi tiết chính sách giao hàng</a>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="related-products-section">
            <div className="section-header">
              <h2 className="section-title">Sản phẩm liên quan</h2>
            </div>
            <div className="products-grid" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
              {relatedProducts.map((p, idx) => (
                <ProductCard key={p.id} product={p} animationIndex={idx} />
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
