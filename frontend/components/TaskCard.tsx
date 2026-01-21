"use client";

import type { Task } from "@/lib/types";

type Props = {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
};

const statusConfig = {
  PENDING: {
    label: "Pending",
    className: "text-neutral-500",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className: "text-neutral-400",
  },
  COMPLETED: {
    label: "Done",
    className: "text-neutral-600 line-through",
  },
};

export default function TaskCard({ task, onToggle, onDelete, onEdit }: Props) {
  const status = statusConfig[task.status] || statusConfig.PENDING;
  const isCompleted = task.status === "COMPLETED";

  return (
    <div className="bg-neutral-900 border border-neutral-800 px-4 py-3 rounded-lg flex justify-between items-center gap-4 hover:border-neutral-700 transition-colors">
      <div className="flex-1 min-w-0">
        <p className={`text-neutral-100 truncate ${isCompleted ? "line-through text-neutral-500" : ""}`}>
          {task.title}
        </p>
        <span className={`text-xs ${status.className}`}>
          {status.label}
        </span>
      </div>

      <div className="flex gap-1 flex-shrink-0">
        <button
          onClick={() => onEdit(task)}
          className="text-neutral-500 hover:text-neutral-300 px-2 py-1 text-sm transition-colors"
        >
          Edit
        </button>

        <button
          onClick={() => onToggle(task.id)}
          className="text-neutral-500 hover:text-neutral-300 px-2 py-1 text-sm transition-colors"
        >
          Toggle
        </button>

        <button
          onClick={() => onDelete(task.id)}
          className="text-neutral-500 hover:text-red-400 px-2 py-1 text-sm transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
