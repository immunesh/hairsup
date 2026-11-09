"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const menuItems = [
    { name: "Dashboard", href: "/admin" },
    { name: "Products", href: "/admin/products" },
    { name: "Categories", href: "/admin/categories" },
    { name: "Hero slides", href: "/admin/hero-slides" },
    { name: "Orders", href: "/admin/orders" },
    { name: "Users", href: "/admin/users" },
    { name: "Cart", href: "/admin/carts" },
    { name: "Wishlist", href: "/admin/wishlist" },
    { name: "Reviews", href: "/admin/reviews" },
    { name: "Coupons", href: "/admin/coupons" },
    { name: "Blogs", href: "/admin/blogs" },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
        className={`fixed top-4 left-4 z-[9999] w-12 h-12 rounded-xl bg-admin-panel border border-white/10 text-white items-center justify-center md:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-mint ${
          isOpen ? "hidden" : "flex"
        }`}
      >
        <Menu className="w-5 h-5" aria-hidden />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[9998] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sticky top-0 h-screen self-start z-[9999] w-full md:w-72 flex-col overflow-y-auto overflow-x-hidden scrollbar-hide border-r border-white/10 text-white bg-admin-panel ${
          isOpen ? "flex" : "hidden md:flex"
        }`}
      >
        {/* Header */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-10">
            <Link href="/admin" className="flex items-center gap-3 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-mint">
              <span className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0">
                <LogoMark size={32} />
              </span>
              <span>
                <span className="block text-lg font-display font-bold leading-tight text-white">
                  Glamour Hair Studios
                </span>
                <span className="block text-xs text-slate-400">Admin dashboard</span>
              </span>
            </Link>

            {/* Close button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
              className="md:hidden p-2 rounded-lg text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-mint"
            >
              <X className="w-6 h-6" aria-hidden />
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-1" aria-label="Admin">
            {menuItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center px-4 py-2.5 rounded-lg border-l-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-mint ${
                    isActive
                      ? "bg-white/10 border-mint text-white font-semibold"
                      : "border-transparent text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
