'use client';

import { useRouter } from 'next/navigation';

export default function AdminHeader() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    localStorage.removeItem('token');

    router.replace('/admin/login');
  };

  return (
    <header
      className="
      h-16
      sticky
      top-0
      z-50

      flex
      items-center
      justify-between

      px-6

      border-b
      border-white/10

      bg-[#141827]/80
      backdrop-blur-2xl
      "
    >
      {/* Left */}
      <div>
        <h1
          className="
          text-xl
          font-bold

          bg-gradient-to-r
          from-cyan-300
          via-purple-300
          to-pink-300

          bg-clip-text
          text-transparent
          "
        >
          HairsUp Admin
        </h1>

        <p className="text-xs text-slate-400">
          Management Dashboard
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Profile Card */}
        <div
          className="
          flex
          items-center
          gap-3

          px-4
          py-2

          rounded-2xl

          bg-white/5
          border
          border-white/10

          backdrop-blur-xl
          "
        >
          <div
            className="
            w-10
            h-10
            rounded-full

            bg-gradient-to-br
            from-cyan-400
            via-blue-500
            to-purple-600

            flex
            items-center
            justify-center

            font-semibold
            text-white

            shadow-[0_0_20px_rgba(56,189,248,0.4)]
            "
          >
            A
          </div>

          <div>
            <p className="text-sm font-medium text-white">
              Admin
            </p>

            <p className="text-xs text-slate-400">
              Super Admin
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="
          px-5
          py-2.5

          rounded-2xl

          bg-red-500/10
          border
          border-red-500/20

          text-red-300
          font-medium

          transition-all
          duration-300

          hover:bg-red-500/20
          hover:border-red-400/40
          hover:text-white
          hover:shadow-[0_0_25px_rgba(239,68,68,0.35)]
          "
        >
          Logout
        </button>
      </div>
    </header>
  );
}