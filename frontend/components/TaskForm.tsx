"use client";

import { useEffect, useState } from "react";
import type { Task, TaskStatus } from "@/lib/types";

type Props = {
  initialTask?: Task | null;
  onSubmit: (data: { title: string; status: TaskStatus }) => Promise<void>;
  onCancel?: () => void;
};

export default function TaskForm({ initialTask, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<TaskStatus>("PENDING");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setStatus(initialTask.status);
    }
  }, [initialTask]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await onSubmit({ title, status });
      setTitle("");
      setStatus("PENDING");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
      <h2 className="font-semibold text-gray-800 text-lg mb-4">
        {initialTask ? "✏️ Edit Task" : "➕ Add New Task"}
      </h2>

      <div className="space-y-3">
        <input
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
          placeholder="Enter task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 bg-white"
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskStatus)}
        >
          <option value="PENDING">🟡 Pending</option>
          <option value="IN_PROGRESS">🔵 In Progress</option>
          <option value="COMPLETED">🟢 Completed</option>
        </select>

        <div className="flex gap-2 pt-2">
          <button
            disabled={loading}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-lg font-medium disabled:opacity-50 transition-all duration-200 shadow-sm"
          >
            {loading ? "Saving..." : initialTask ? "Update Task" : "Add Task"}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg font-medium transition-colors duration-200"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
