import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const searchUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { query } = req.query as { query: string };

  try {
    if (!query || query.trim().length < 1) {
      res.status(200).json([]); // Ensure an early return
    } else if (query.includes("@")) {
      const users = await prisma.user.findMany({
        where: { email: query as string },
        select: {
          userId: true,
          fullname: true,
          username: true,
          email: true,
          profilePictureUrl: true,
        },
      });
      res.status(200).json(users);
    } else {
      const users = await prisma.user.findMany({
        where: {
          OR: [
            { username: { contains: query as string } },
            { fullname: { contains: query as string } },
          ],
        },

        select: {
          userId: true,
          fullname: true,
          username: true,
          email: true,
          profilePictureUrl: true,
        },
      });
      res.status(200).json(users);
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error searching users: ${error.message}` });
  }
};

export const search = async (req: Request, res: Response): Promise<void> => {
  const { query } = req.query;
  try {
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { title: { contains: query as string } },
          { description: { contains: query as string } },
        ],
      },
    });

    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { name: { contains: query as string } },
          { description: { contains: query as string } },
        ],
      },
    });

    const users = await prisma.user.findMany({
      where: {
        OR: [{ username: { contains: query as string } }],
      },
    });
    res.json({ tasks, projects, users });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error performing search: ${error.message}` });
  }
};
