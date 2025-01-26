import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import AuthenticatedRequest from "../types/authReqInterface";

const prisma = new PrismaClient();

export const getProject = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const projectId = Number(req.params.projectId);
  const userId = req.user?.userId;
  try {
    const project = await prisma.project.findFirst({
      where: { id: projectId, projectManagerId: userId },
      include: {
        tasks: true,
      },
    });

    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: "Project not found" });
    }
    ``;
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving project: ${error.message}` });
  }
};

export const getProjects = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    const projects = await prisma.project.findMany({
      where: {
        projectManagerId: userId,
      },
      select: {
        id: true,
        name: true,
        projectManagerId: true,
      },
      // include: {

      // projectTeams: {
      //   select: {
      //     team: {
      //       select: {
      //         teamName: true,
      //         members: {
      //           select: { full_name: true, username: true },
      //         },
      //       },
      //     },
      //   },
      // },
      // projectManager: {
      //   select: {
      //     username: true,
      //   },
      // },
      // },
    });
    res.json(projects);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving projects: ${error.message}` });
  }
};
export const createProject = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { name, description, startDate, endDate } = req.body;

  try {
    // Validate input
    if (!name || !startDate || !endDate) {
      res
        .status(400)
        .json({ message: "Name, startDate, and endDate are required." });
      return;
    }

    // Validate date format and order
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      res.status(400).json({ message: "Invalid date format. Use yyyy-mm-dd." });
      return;
    }

    if (start >= end) {
      res
        .status(400)
        .json({ message: "Start date must be earlier than end date." });
      return;
    }

    if (!req.user?.userId) {
      return;
    }
    // Create the project
    const newProject = await prisma.project.create({
      data: {
        name,
        description: description || null, // Optional field
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        projectManagerId: req.user?.userId, // Ensure a valid manager ID
      },
    });

    res.status(201).json({
      message: "Project created successfully",
      project: { id: newProject.id, name: newProject.name },
    });
  } catch (error: any) {
    console.error("Error creating project:", error);
    res.status(500).json({
      message: `Error creating a project: ${error.message}`,
    });
  }
};

export const assignTeamToProject = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { projectId, teamId } = req.body;
  const projectManagerId = req.user?.userId;
  const project = await prisma.project.findUnique({
    where: {
      id: Number(req.body.projectId),
    },
    select: {
      projectManagerId: true,
    },
  });

  if (project?.projectManagerId !== projectManagerId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const projectTeam = await prisma.projectTeam.create({
      data: {
        projectId: Number(projectId),
        teamId: Number(teamId),
      },
    });
    const project = await prisma.project.update({
      where: {
        id: Number(projectId),
      },
      data: {
        projectTeams: {
          connect: {
            id: projectTeam.id,
          },
        },
      },
    });

    res.json(project);
  } catch (error: any) {
    res.status(500).json({ message: `Error assigning team: ${error.message}` });
  }
};
