"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import type { Task, TaskStatus } from "@/lib/types";
import { useAuth } from "@/lib/useAuth";

import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import Navbar from "@/components/Navbar";

export default function TasksPage() {
  const { isLoading: authLoading } = useAuth(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TaskStatus | "">("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);

  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const fetchTasks = useCallback(async () => {
    setIsLoadingTasks(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));
      if (status) params.set("status", status);
      if (search) params.set("search", search);

      const res = await apiFetch(`/tasks?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to load tasks");
        return;
      }

      setTasks(data.tasks);
      setTotalPages(data.totalPages);
    } catch (error: any) {
      toast.error(error.message || "Error loading tasks");
    } finally {
      setIsLoadingTasks(false);
    }
  }, [page, limit, status, search]);

  useEffect(() => {
    if (!authLoading) {
      fetchTasks();
    }
  }, [authLoading, fetchTasks]);

  async function handleSearch() {
    setPage(1);
    fetchTasks();
  }

  async function handleAddTask(data: { title: string; status: TaskStatus }) {
    try {
      const res = await apiFetch("/tasks", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) {
        toast.error(result.message || "Failed to add task");
        return;
      }

      toast.success("Task created");
      fetchTasks();
    } catch (error: any) {
      toast.error(error.message || "Error adding task");
    }
  }

  async function handleUpdateTask(data: { title: string; status: TaskStatus }) {
    if (!editingTask) return;

    try {
      const res = await apiFetch(`/tasks/${editingTask.id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) {
        toast.error(result.message || "Failed to update task");
        return;
      }

      toast.success("Task updated");
      setEditingTask(null);
      fetchTasks();
    } catch (error: any) {
      toast.error(error.message || "Error updating task");
    }
  }

  async function handleToggle(id: string) {
    try {
      const res = await apiFetch(`/tasks/${id}/toggle`, { method: "PATCH" });
      if (!res.ok) {
        toast.error("Failed to toggle status");
        return;
      }
      toast.success("Status updated");
      fetchTasks();
    } catch (error: any) {
      toast.error(error.message || "Error toggling task");
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await apiFetch(`/tasks/${id}`, { method: "DELETE" });
      if (!res.ok) {
        toast.error("Failed to delete task");
        return;
      }
      toast.success("Task deleted");
      fetchTasks();
    } catch (error: any) {
      toast.error(error.message || "Error deleting task");
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
    <div className="min-h-screen bg-neutral-950">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <input
            className="flex-1 min-w-[180px] bg-neutral-900 border border-neutral-800 px-4 py-2.5 rounded-lg text-neutral-100 placeholder-neutral-600 outline-none focus:border-neutral-700 transition-colors"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />

          <select
            className="bg-neutral-900 border border-neutral-800 text-neutral-300 px-4 py-2.5 rounded-lg outline-none focus:border-neutral-700 transition-colors"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as any);
              setPage(1);
            }}
          >
            <option value="">All</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        {/* Add/Edit Form */}
        {editingTask ? (
          <TaskForm
            initialTask={editingTask}
            onSubmit={handleUpdateTask}
            onCancel={() => setEditingTask(null)}
          />
        ) : (
          <TaskForm onSubmit={handleAddTask} />
        )}

        {/* Task List */}
        <TaskList
          tasks={tasks}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onEdit={(task) => setEditingTask(task)}
          isLoading={isLoadingTasks}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center pt-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="text-sm text-neutral-400 hover:text-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              &larr; Previous
            </button>

            <span className="text-neutral-500 text-sm">
              {page} / {totalPages}
            </span>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="text-sm text-neutral-400 hover:text-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
