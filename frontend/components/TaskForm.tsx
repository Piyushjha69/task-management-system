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
    <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg">
      <div className="flex gap-3 flex-wrap">
        <input
          className="flex-1 min-w-[180px] bg-neutral-950 border border-neutral-800 px-4 py-2.5 rounded-lg text-neutral-100 placeholder-neutral-600 outline-none focus:border-neutral-700 transition-colors"
          placeholder={initialTask ? "Edit task..." : "New task..."}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          className="bg-neutral-950 border border-neutral-800 text-neutral-300 px-4 py-2.5 rounded-lg outline-none focus:border-neutral-700 transition-colors"
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskStatus)}
        >
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>

        <div className="flex gap-2">
          <button
            disabled={loading}
            className="bg-neutral-100 text-neutral-900 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-white disabled:opacity-50 transition-colors"
          >
            {loading ? "Saving..." : initialTask ? "Update" : "Add"}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-neutral-500 hover:text-neutral-300 px-3 py-2.5 text-sm transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
