"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { logout } from "@/lib/auth";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
      toast.success("Logged out successfully!");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      logout();
      router.push("/login");
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
      <div className="max-w-3xl mx-auto flex justify-between items-center p-4">
        <h1 className="font-bold text-xl text-white tracking-wide">📋 Task Manager</h1>

        <button
          onClick={handleLogout}
          className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 backdrop-blur-sm border border-white/30"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
