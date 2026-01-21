"use client";

import type { Task } from "@/lib/types";
import TaskCard from "./TaskCard";

type Props = {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  isLoading?: boolean;
};

export default function TaskList({ tasks, onToggle, onDelete, onEdit, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-5 h-5 border-2 border-neutral-700 border-t-neutral-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500">No tasks yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
