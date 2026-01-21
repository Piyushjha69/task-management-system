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
      toast.success("Logged out");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      logout();
      router.push("/login");
    }
  };

  return (
    <div className="border-b border-neutral-800">
      <div className="max-w-2xl mx-auto flex justify-between items-center px-6 py-4">
        <span className="font-medium text-neutral-200">taskflow</span>

        <button
          onClick={handleLogout}
          className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
