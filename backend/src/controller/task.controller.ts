import { Request, Response } from "express";
import { TaskService } from "../service/task.service";
import {
    CreateTaskSchema,
    UpdateTaskSchema,
    TaskIdParamSchema,
    TaskListQuerySchema,
} from "../schemas/task.schema";

const taskService = new TaskService();

// Helper to safely get userId from auth middleware
const getUserId = (req: Request): string | null => {
    const user = (req as any).user;
    return user?.userId ?? null;
};

export const createTask = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const body = CreateTaskSchema.parse(req.body);

        const taskId = await taskService.addTask({
            title: body.title,
            userId,
            ...(body.status ? { status: body.status } : {}),
        });


        return res.status(201).json({
            message: "Task created successfully",
            taskId,
        });
    } catch (error: any) {
        if (error?.name === "ZodError") {
            return res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            });
        }

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const getTasks = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const query = TaskListQuerySchema.parse(req.query);

        const page = query.page ? Number(query.page) : 1;
        const limit = query.limit ? Number(query.limit) : 10;

        const result = await taskService.getTasks(userId, {
            page,
            limit,
            ...(query.status ? { status: query.status } : {}),
            ...(query.search ? { search: query.search } : {}),
        });


        return res.status(200).json(result);
    } catch (error: any) {
        if (error?.name === "ZodError") {
            return res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            });
        }

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const getTaskById = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const params = TaskIdParamSchema.parse(req.params);

        const task = await taskService.getTaskById(params.id, userId);

        return res.status(200).json(task);
    } catch (error: any) {
        if (error?.name === "ZodError") {
            return res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            });
        }

        if (error?.message === "Task not found") {
            return res.status(404).json({ message: "Task not found" });
        }

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const updateTask = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const params = TaskIdParamSchema.parse(req.params);
        const body = UpdateTaskSchema.parse(req.body);

        const updatedTask = await taskService.updateTask(params.id, userId, {
            ...(body.title !== undefined ? { title: body.title } : {}),
            ...(body.status !== undefined ? { status: body.status } : {}),
        });

        return res.status(200).json({
            message: "Task updated successfully",
            task: updatedTask,
        });
    } catch (error: any) {
        if (error?.name === "ZodError") {
            return res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            });
        }

        if (error?.message === "Task not found") {
            return res.status(404).json({ message: "Task not found" });
        }

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const deleteTask = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const params = TaskIdParamSchema.parse(req.params);

        await taskService.deleteTask(params.id, userId);

        return res.status(200).json({
            message: "Task deleted successfully",
        });
    } catch (error: any) {
        if (error?.name === "ZodError") {
            return res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            });
        }

        if (error?.message === "Task not found") {
            return res.status(404).json({ message: "Task not found" });
        }

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const toggleTaskStatus = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const params = TaskIdParamSchema.parse(req.params);

        const updatedTask = await taskService.toggleTaskStatus(params.id, userId);

        return res.status(200).json({
            message: "Task status toggled successfully",
            task: updatedTask,
        });
    } catch (error: any) {
        if (error?.name === "ZodError") {
            return res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            });
        }

        if (error?.message === "Task not found") {
            return res.status(404).json({ message: "Task not found" });
        }

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
