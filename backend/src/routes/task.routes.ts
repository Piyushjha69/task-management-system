import express from "express";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  toggleTaskStatus,
  updateTask,
} from "../controller/task.controller";

import {
  CreateTaskSchema,
  TaskIdParamSchema,
  TaskListQuerySchema,
  UpdateTaskSchema,
} from "../schemas/task.schema";

import { validateRequest } from "../middleware/validate.middleware";
import { authenticateToken } from "../middleware/auth.middleware";

const router = express.Router();

router.get(
  "/",
  authenticateToken,
  validateRequest({ query: TaskListQuerySchema }),
  getTasks
);

router.post(
  "/",
  authenticateToken,
  validateRequest({ body: CreateTaskSchema }),
  createTask
);

router.get(
  "/:id",
  authenticateToken,
  validateRequest({ params: TaskIdParamSchema }),
  getTaskById
);

router.patch(
  "/:id",
  authenticateToken,
  validateRequest({ params: TaskIdParamSchema, body: UpdateTaskSchema }),
  updateTask
);

router.delete(
  "/:id",
  authenticateToken,
  validateRequest({ params: TaskIdParamSchema }),
  deleteTask
);

router.patch(
  "/:id/toggle",
  authenticateToken,
  validateRequest({ params: TaskIdParamSchema }),
  toggleTaskStatus
);

export default router;
