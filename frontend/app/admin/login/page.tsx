"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { LogoMark } from "@/components/brand/Logo";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await authApi.login(email, password);

      const { accessToken, refreshToken, user } = response.data.data;

      if (user.role !== "ADMIN") {
        setError("You are not an administrator");
        return;
      }

      localStorage.setItem("accessToken", accessToken);

      localStorage.setItem("refreshToken", refreshToken);

      localStorage.setItem("role", user.role);

      localStorage.setItem("userId", user.id);

      router.replace("/admin");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-admin-base text-white">
      <div className="w-full max-w-md rounded-2xl bg-admin-panel border border-white/10 p-8">
        {/* Logo */}
        <div className="mb-8">
          <span className="inline-flex w-14 h-14 rounded-xl bg-white items-center justify-center mb-5">
            <LogoMark size={36} />
          </span>
          <h1 className="text-3xl font-display font-bold text-white">
            Glamour Hair Studios admin
          </h1>

          <p className="text-slate-400 mt-2">Sign in to the dashboard.</p>
        </div>

        {/* Error */}
        {error && (
          <div role="alert" className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="admin-email" className="block text-sm text-slate-300 mb-2">
              Email address
            </label>

            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
            w-full

            px-4
            py-3

            rounded-2xl

            bg-white/5

            border
            border-white/40

            text-white

            placeholder:text-slate-500

            focus:outline-none
            focus:border-cyan-500/50
            focus:ring-2
            focus:ring-cyan-500/20

            transition
            "
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="admin-password" className="block text-sm text-slate-300 mb-2">
              Password
            </label>

            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
            w-full

            px-4
            py-3

            rounded-2xl

            bg-white/5

            border
            border-white/40

            text-white

            placeholder:text-slate-500

            focus:outline-none
            focus:border-cyan-500/50
            focus:ring-2
            focus:ring-cyan-500/20

            transition
            "
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="
          w-full

          py-3

          rounded-2xl

          
          
          

          text-white
          font-semibold

          transition-colors
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint

          disabled:opacity-50
          disabled:cursor-not-allowed

          
           bg-brand-600 hover:bg-brand-700 text-white"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8">
          <p className="text-xs text-slate-400">Glamour Hair Studios administration</p>
        </div>
      </div>
    </div>
  );
}
