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
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
};

export default function TaskCard({ task, onToggle, onDelete, onEdit }: Props) {
  const status = statusConfig[task.status] || statusConfig.PENDING;

  return (
    <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 flex justify-between items-center gap-4">
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 truncate">{task.title}</p>
        <span className={`inline-block mt-1 px-2.5 py-0.5 text-xs font-medium rounded-full border ${status.className}`}>
          {status.label}
        </span>
      </div>

      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={() => onEdit(task)}
          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200"
        >
          Edit
        </button>

        <button
          onClick={() => onToggle(task.id)}
          className="bg-purple-50 hover:bg-purple-100 text-purple-600 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200"
        >
          Toggle
        </button>

        <button
          onClick={() => onDelete(task.id)}
          className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
