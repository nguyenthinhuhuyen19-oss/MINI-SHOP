"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/productsData";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";

interface ProductCardProps {
  product: Product;
  animationIndex?: number;
}

export default function ProductCard({ product, animationIndex = 0 }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const isWishlisted = isInWishlist(product.id);
  const isNew = product.id % 2 !== 0;
  const isDiscount = product.id === 3 || product.id === 6;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(product.id);
    if (added) {
      showToast(`Đã thêm ${product.name} vào danh sách yêu thích`, "success", "heart");
    } else {
      showToast(`Đã xóa ${product.name} khỏi danh sách yêu thích`, "info", "heart");
    }
  };

  return (
    <div
      className="product-card card-animate"
      style={{ animationDelay: `${animationIndex * 0.03}s` }}
    >
      <div className="product-thumb">
        {isDiscount ? (
          <span className="product-badge-discount">-15%</span>
        ) : isNew ? (
          <span className="product-badge-new">Mới</span>
        ) : null}

        <button
          className={`wishlist-btn ${isWishlisted ? "active" : ""}`}
          title={isWishlisted ? "Bỏ khỏi yêu thích" : "Thêm vào yêu thích"}
          onClick={handleWishlistClick}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={isWishlisted ? "#ef4444" : "none"} stroke={isWishlisted ? "#ef4444" : "currentColor"} strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
          style={{ objectFit: "cover" }}
        />
      </div>

      <div className="product-info">
        <h3 className="product-title" title={product.name}>
          {product.name}
        </h3>
        <div className="product-price-row">
          <span className="product-price">{product.priceFormatted}</span>
          {isDiscount && (
            <span className="product-original-price">
              {(product.price * 1.18).toLocaleString("vi-VN")}đ
            </span>
          )}
        </div>
        <span className="stock-status-tag">Còn hàng</span>
        <Link href={`/products/${product.id}`} className="btn-card-detail">
          Xem chi tiết
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
