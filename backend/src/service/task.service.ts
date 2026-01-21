import { PrismaClient, TaskStatus } from "../generated/prisma/client";

const prisma = new PrismaClient();

export interface AddTaskDTO {
  title: string;
  status?: TaskStatus;
  userId: string;
}

export interface UpdateTaskDTO {
  title?: string;
  status?: TaskStatus;
}

export interface TaskListQueryDTO {
  page?: number;
  limit?: number;
  status?: TaskStatus;
  search?: string;
}

export class TaskService {
  async addTask(data: AddTaskDTO): Promise<string> {
    const task = await prisma.task.create({
      data: {
        title: data.title,
        status: data.status ?? TaskStatus.PENDING,
        userId: data.userId,
      },
    });

    return task.id;
  }

  async getTasks(userId: string, query: TaskListQueryDTO) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: any = {
      userId,
    };

    // filter by status
    if (query.status) {
      where.status = query.status;
    }

    // search by title
    if (query.search) {
      where.title = {
        contains: query.search,
      };
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.task.count({ where }),
    ]);

    return {
      tasks,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getTaskById(taskId: string, userId: string) {
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId,
      },
    });

    if (!task) {
      throw new Error("Task not found");
    }

    return task;
  }

  async updateTask(taskId: string, userId: string, data: UpdateTaskDTO) {
    const existing = await prisma.task.findFirst({
      where: { id: taskId, userId },
    });

    if (!existing) {
      throw new Error("Task not found");
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.status !== undefined ? { status: data.status } : {}),
      },
    });

    return updatedTask;
  }

  async deleteTask(taskId: string, userId: string): Promise<void> {
    const existing = await prisma.task.findFirst({
      where: { id: taskId, userId },
    });

    if (!existing) {
      throw new Error("Task not found");
    }

    await prisma.task.delete({
      where: { id: taskId },
    });
  }

  async toggleTaskStatus(taskId: string, userId: string) {
    const task = await prisma.task.findFirst({
      where: { id: taskId, userId },
    });

    if (!task) {
      throw new Error("Task not found");
    }

    const newStatus =
      task.status === TaskStatus.COMPLETED
        ? TaskStatus.PENDING
        : TaskStatus.COMPLETED;

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { status: newStatus },
    });

    return updatedTask;
  }
}
