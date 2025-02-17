import { Request, Response } from "express";
import { PrismaClient, Task } from "@prisma/client";
import AuthenticatedRequest from "../types/authReqInterface";

const prisma = new PrismaClient();

export const getTasks = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { query } = req.query as { query: string };

  try {
    const tasks = await prisma.task.findMany({
      where: {
        AND: [
          {
            projectId: Number(query),
          },
          {
            OR: [
              {
                assignee: {
                  userId: req.user?.userId,
                },
              },
              {
                author: {
                  userId: req.user?.userId,
                },
              },
            ],
          },
        ],
      },
      include: {
        taskAssignments: {
          select: {
            team: {
              select: {
                teamName: true,
              },
            },
          },
        },
        author: {
          select: {
            fullname: true,
            userId: true,
            username: true,
            teamId: true,
            profilePictureUrl: true,
          },
        },
        assignee: {
          select: {
            userId: true,
            username: true,
            teamId: true,
            profilePictureUrl: true,
          },
        },
        comments: true,
        attachments: true,
      },
    });

    // Transform the data: extract teamName and remove taskAssignments
    const transformedTasks = tasks.map((task) => ({
      ...task,
      teamName: task.taskAssignments?.[0]?.team?.teamName || null, // Get first team name if exists
      taskAssignments: undefined, // Remove the property
    }));

    res.json(transformedTasks);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving tasks: ${error.message}` });
  }
};
export const currentUserTasks = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user?.userId;
  try {
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { authorUserId: Number(userId) },
          { assignedUserId: Number(userId) },
        ],
      },
      include: {
        author: true,
        assignee: true,
      },
    });
    if (tasks.length === 0) {
      res.status(404).json({ message: "User has no tasks" });
    } else {
      res.json(tasks);
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving tasks: ${error.message}` });
  }
};

export const createTask = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const {
    title,
    description,
    status,
    priority,
    tags,
    startDate,
    dueDate,
    points,
    projectId,
    assignedUserId,
    teamId,
  } = req.body.data;

  console.log(req.body.data);

  const authorUserId = req.user?.userId;

  if (!authorUserId) {
    res.status(401).json({ message: "User not authenticated" });
    return;
  }

  if (!title || !priority || !projectId) {
    res.status(400).json({
      message: "Title, priority, and projectId are required fields.",
    });
    return;
  }

  try {
    const task = await prisma.task.create({
      include: {
        author: {
          select: {
            fullname: true,
            userId: true,
            username: true,
            teamId: true,
            profilePictureUrl: true,
          },
        },
        assignee: {
          select: {
            userId: true,
            username: true,
            teamId: true,
            profilePictureUrl: true,
          },
        },
        comments: true,
        attachments: true,
      },
      data: {
        title,
        description: description || null,
        status: status || "ToDo", // Default to ToDo if not provided
        priority,
        tags: tags ? { set: tags } : { set: [] }, // Ensure tags match the schema structure
        startDate: startDate ? new Date(startDate) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
        points: points || null,
        authorUserId,
        projectId,
        assignedUserId: assignedUserId || null,
        taskAssignments: {
          createMany: {
            data: [
              {
                teamId: teamId || null,
              },
            ],
          },
        },
      },
    });

    res.status(201).json({ message: "Task created successfully", task });
  } catch (error: any) {
    console.error("Error creating a task:", error.message);

    if (error.code === "P2002") {
      res.status(400).json({ message: "A unique constraint failed." });
    } else {
      res.status(500).json({ message: "Error creating a task." });
    }
  }
};

export const updateTaskStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.params;
  const { status } = req.body;

  console.log(taskId, status);

  try {
    const updatedTask = await prisma.task.update({
      where: {
        id: Number(taskId),
      },
      data: {
        status: status,
      },
    });
    res.json(updatedTask);
  } catch (error: any) {
    res.status(500).json({ message: `Error updating task: ${error.message}` });
  }
};

export const getUserTasks = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  try {
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { authorUserId: Number(userId) },
          { assignedUserId: Number(userId) },
        ],
      },
      include: {
        author: true,
        assignee: true,
      },
    });
    if (tasks.length === 0) {
      res.status(404).json({ message: "User has no tasks" });
    } else {
      res.json(tasks);
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving user's tasks: ${error.message}` });
  }
};

export const deleteTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.params;
  try {
    await prisma.task.delete({
      where: { id: Number(taskId) },
    });
    res.json({ message: "Task deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: `Error deleting task: ${error.message}` });
  }
};

export const updateTask = async (req: AuthenticatedRequest, res: Response) => {
  const { taskId } = req.params;
  let { task } = req.body;
  delete task.id;
  console.log(task, taskId, req.body);

  try {
    const updatedTask = await prisma.task.update({
      where: {
        id: Number(taskId),
      },
      data: {
        ...task,

        startDate: task.startDate ? new Date(task.startDate) : null,
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
      } as Task,
    });
    res.json(updatedTask);
  } catch (error: any) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: `Error updating task: ${error.message}` });
  }
};
