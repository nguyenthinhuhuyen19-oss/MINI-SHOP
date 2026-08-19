"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const { currentUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const isHome = pathname === "/";
  const isProducts = pathname === "/products";
  const isCategories = pathname.startsWith("/categories");
  const isAbout = pathname === "/about";
  const isContact = pathname === "/contact";

  // Hide main user header on admin routes
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchInput.trim())}`);
    } else {
      router.push(`/products`);
    }
  };

  return (
    <header className="site-header">
      <div className="container header-container">
        <Link href="/" className="brand-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
            <path d="M3 6h18"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          Mini Shop
        </Link>

        <nav className={`nav-menu ${mobileMenuOpen ? "show" : ""}`} id="navMenu">
          <Link href="/" className={`nav-link ${isHome ? "active" : ""}`}>Home</Link>
          <Link href="/products" className={`nav-link ${isProducts ? "active" : ""}`}>Products</Link>
          <Link href="/products" className={`nav-link ${isCategories ? "active" : ""}`}>Categories</Link>
          <Link href="/about" className={`nav-link ${isAbout ? "active" : ""}`}>About</Link>
          <Link href="/contact" className={`nav-link ${isContact ? "active" : ""}`}>Contact</Link>
        </nav>

        <div className="header-actions">
          <form className="search-box" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              className="search-input"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit" className="search-btn" aria-label="Search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.3-4.3"/>
              </svg>
            </button>
          </form>

          <div className="header-user-widgets" style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Link href="/wishlist" className="icon-nav-btn" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--dark-muted)", display: "flex", alignItems: "center", gap: 4, fontWeight: 500, fontSize: "0.88rem" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span>Wishlist</span>
              <span id="headerWishlistCountBadge" style={{ background: "#ef4444", color: "white", borderRadius: "50%", width: 18, height: 18, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 700 }}>
                {getWishlistCount()}
              </span>
            </Link>

            <Link href="/cart" className="icon-nav-btn" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--dark-muted)", display: "flex", alignItems: "center", gap: 4, fontWeight: 500, fontSize: "0.88rem" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                <path d="M3 6h18"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              <span>Cart</span>
              <span id="headerCartCountBadge" style={{ background: "var(--blue-btn)", color: "white", borderRadius: "50%", width: 18, height: 18, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 700 }}>
                {getCartCount()}
              </span>
            </Link>
          </div>

          {currentUser ? (
            <div className="btn-auth-group" style={{ alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--primary)", background: "var(--primary-light)", padding: "6px 12px", borderRadius: "var(--radius-full)", border: "1px solid var(--primary-border)" }}>
                👋 {currentUser.name}
              </span>
              {currentUser.role === "admin" && (
                <Link href="/admin/dashboard" className="btn-admin">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  Admin
                </Link>
              )}
              <button className="btn-login" style={{ color: "#ef4444", borderColor: "#fca5a5" }} onClick={logout}>
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="btn-auth-group">
              <Link href="/login" className="btn-login">Login</Link>
              <Link href="/register" className="btn-register">Register</Link>
              <Link href="/admin/dashboard" className="btn-admin">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                Admin
              </Link>
            </div>
          )}

          <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle navigation">
            &#9776;
          </button>
        </div>
      </div>
    </header>
  );
}
