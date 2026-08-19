"use client";

import React from "react";
import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="breadcrumb-nav">
      <div className="breadcrumb">
        <span className="breadcrumb-item">
          <Link href="/">Trang chủ</Link>
        </span>
        {items.map((item, idx) => (
          <React.Fragment key={idx}>
            <span className="breadcrumb-separator">&gt;</span>
            <span className={`breadcrumb-item ${item.active ? "active" : ""}`}>
              {item.href && !item.active ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                item.label
              )}
            </span>
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
}
