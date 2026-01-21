"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const { isLoading: authLoading } = useAuth(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  function validateForm() {
    const newErrors: { name?: string; email?: string; password?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Register failed");

      toast.success("Registration successful!");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-neutral-700 border-t-neutral-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col px-6 py-8">
      <header className="max-w-sm mx-auto w-full">
        <Link href="/" className="text-neutral-500 text-sm hover:text-neutral-300 transition-colors">
          &larr; Back
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold text-neutral-100 mb-8">Create account</h1>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <input
                className={`w-full bg-neutral-900 border px-4 py-3 rounded-lg text-neutral-100 placeholder-neutral-600 outline-none transition-colors ${
                  errors.name ? "border-red-500/50" : "border-neutral-800 focus:border-neutral-700"
                }`}
                placeholder="Name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1.5">{errors.name}</p>
              )}
            </div>

            <div>
              <input
                className={`w-full bg-neutral-900 border px-4 py-3 rounded-lg text-neutral-100 placeholder-neutral-600 outline-none transition-colors ${
                  errors.email ? "border-red-500/50" : "border-neutral-800 focus:border-neutral-700"
                }`}
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                className={`w-full bg-neutral-900 border px-4 py-3 rounded-lg text-neutral-100 placeholder-neutral-600 outline-none transition-colors ${
                  errors.password ? "border-red-500/50" : "border-neutral-800 focus:border-neutral-700"
                }`}
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: undefined });
                }}
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-1.5">{errors.password}</p>
              )}
            </div>

            <button
              disabled={loading}
              className="w-full bg-neutral-100 text-neutral-900 py-3 rounded-lg font-medium hover:bg-white disabled:opacity-50 transition-colors"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-sm text-neutral-500 text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-neutral-300 hover:text-white transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
