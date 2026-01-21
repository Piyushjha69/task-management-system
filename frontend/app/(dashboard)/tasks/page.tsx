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
        toast.error("Failed to load tasks", {
          description: data.message || "Please try again",
        });
        return;
      }

      setTasks(data.tasks);
      setTotalPages(data.totalPages);
    } catch (error: any) {
      toast.error("Error loading tasks", {
        description: error.message,
      });
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
        toast.error("Failed to add task", {
          description: result.message || "Please try again",
        });
        return;
      }

      toast.success("Task created!", {
        description: `"${data.title}" has been added.`,
      });
      fetchTasks();
    } catch (error: any) {
      toast.error("Error adding task", {
        description: error.message,
      });
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
        toast.error("Failed to update task", {
          description: result.message || "Please try again",
        });
        return;
      }

      toast.success("Task updated!", {
        description: `"${data.title}" has been updated.`,
      });
      setEditingTask(null);
      fetchTasks();
    } catch (error: any) {
      toast.error("Error updating task", {
        description: error.message,
      });
    }
  }

  async function handleToggle(id: string) {
    try {
      const res = await apiFetch(`/tasks/${id}/toggle`, { method: "PATCH" });
      if (!res.ok) {
        toast.error("Failed to toggle task status");
        return;
      }
      toast.success("Task status toggled!");
      fetchTasks();
    } catch (error: any) {
      toast.error("Error toggling task", {
        description: error.message,
      });
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await apiFetch(`/tasks/${id}`, { method: "DELETE" });
      if (!res.ok) {
        toast.error("Failed to delete task");
        return;
      }
      toast.success("Task deleted!", {
        description: "The task has been removed.",
      });
      fetchTasks();
    } catch (error: any) {
      toast.error("Error deleting task", {
        description: error.message,
      });
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <div className="max-w-3xl mx-auto p-6 space-y-6">
        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex gap-3 flex-wrap">
            <input
              className="flex-1 min-w-[200px] border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
              placeholder="🔍 Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button
              onClick={handleSearch}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm"
            >
              Search
            </button>

            <select
              className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 bg-white min-w-[140px]"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as any);
                setPage(1);
              }}
            >
              <option value="">All Status</option>
              <option value="PENDING">🟡 Pending</option>
              <option value="IN_PROGRESS">🔵 In Progress</option>
              <option value="COMPLETED">🟢 Completed</option>
            </select>
          </div>
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
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            ← Previous
          </button>

          <p className="text-gray-600 font-medium">
            Page <span className="text-indigo-600">{page}</span> of <span className="text-indigo-600">{totalPages}</span>
          </p>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
