'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Products', href: '/admin/products' },
    { name: 'Categories', href: '/admin/categories' },
    { name: 'Orders', href: '/admin/orders' },
    { name: 'Users', href: '/admin/users' },
    { name: 'Cart', href: '/admin/carts' },
    { name: 'Wishlist', href: '/admin/wishlist' },
    { name: 'Reviews', href: '/admin/reviews' },
    { name: 'Coupons', href: '/admin/coupons' },
    { name: 'Blogs', href: '/admin/blogs' },
    { name: 'Stores', href: '/admin/stores' },
  ];

  return (
    <aside
      className="
      relative
      w-72
      min-h-screen
      flex
      flex-col
      overflow-hidden
      bg-gradient-to-b
      from-[#1B1634]
      via-[#141827]
      to-[#0B1020]
      border-r
      border-white/10
      text-white
      "
    >
      {/* Glow */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-cyan-500/20 blur-[120px]" />
      <div className="absolute bottom-0 -right-24 w-72 h-72 bg-purple-500/20 blur-[120px]" />

      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="flex items-center gap-3 mb-10">
          <div
            className="
            w-14
            h-14
            rounded-2xl
            bg-gradient-to-br
            from-cyan-400
            via-blue-500
            to-purple-600
            flex
            items-center
            justify-center
            text-xl
            font-bold
            shadow-[0_0_30px_rgba(56,189,248,0.5)]
            "
          >
            ✦
          </div>

          <div>
            <h1
              className="
              text-2xl
              font-bold
              bg-gradient-to-r
              from-cyan-300
              via-purple-300
              to-pink-300
              bg-clip-text
              text-transparent
              "
            >
              HairsUp
            </h1>

            <p className="text-xs text-slate-400">
              Admin Dashboard
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/admin' &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-2xl
                  transition-all
                  duration-300
                  border

                  ${
                    isActive
                      ? `
                        bg-white/10
                        border-cyan-400/30
                        text-white
                        shadow-[0_0_25px_rgba(34,211,238,0.25)]
                      `
                      : `
                        border-transparent
                        text-slate-300
                        hover:bg-white/5
                        hover:border-cyan-400/20
                        hover:text-white
                        hover:translate-x-1
                        hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]
                      `
                  }
                `}
              >
                <span
                  className={`
                    w-2 h-2 rounded-full transition-all
                    ${
                      isActive
                        ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]'
                        : 'bg-purple-500'
                    }
                  `}
                />

                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom */}
      <div className="mt-auto p-6 relative z-10">
        <div
          className="
          rounded-3xl
          p-4
          bg-white/5
          border
          border-white/10
          backdrop-blur-xl
          mb-4
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
              w-12
              h-12
              rounded-full
              bg-gradient-to-br
              from-cyan-400
              to-purple-500
              "
            />

            
          </div>
        </div>
 
      </div>
    </aside>
  );
}