import { z } from "zod";

export const StatusEnum = z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]);

// Create Task (POST /tasks)
export const CreateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must not exceed 200 characters"),

  status: StatusEnum.optional(),
});

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;

//  Update Task (PATCH /tasks/:id)
export const UpdateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must not exceed 200 characters")
    .optional(),

  status: StatusEnum.optional(),
});

export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;

//  Task ID Param (GET/PATCH/DELETE /tasks/:id)
export const TaskIdParamSchema = z.object({
  id: z.string().uuid("Task ID must be a valid UUID"),
});

export type TaskIdParam = z.infer<typeof TaskIdParamSchema>;

//  GET /tasks query (pagination + filter + search)
export const TaskListQuerySchema = z.object({
  status: StatusEnum.optional(),
  search: z.string().optional(),

  page: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Page must be a positive number",
    })
    .optional(),

  limit: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Limit must be a positive number",
    })
    .optional(),
});

export type TaskListQuery = z.infer<typeof TaskListQuerySchema>;
