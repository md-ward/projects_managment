import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import AuthenticatedRequest from "../types/authReqInterface";

const prisma = new PrismaClient();

// Create a new team
export const createTeam = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const {
    teamName,
    productOwnerUserId,
    projectManagerUserId,
    description,
    membersIds,
    projectId,
  } = req.body as {
    teamName: string;
    description?: string;
    productOwnerUserId?: number;
    projectManagerUserId?: number;

    membersIds?: number[];
    projectId?: number;
  };
  console.log(req.body);

  try {
    console.log(projectId);

    // Check if user is authenticated
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    if (!projectId) {
      res.status(400).json({ message: "Project ID is required." });
      return;
    }

    // Validate required fields
    if (!teamName) {
      res.status(400).json({ message: "Team name is required." });
      return;
    }

    // Default project manager to the product owner if not specified
    const ownerId = productOwnerUserId ?? req.user.userId;
    const managerId = projectManagerUserId ?? ownerId;

    // Create the team
    const newTeam = await prisma.team.create({
      data: {
        teamName,
        description,
        productOwnerUserId: ownerId,
        projectManagerUserId: managerId,
      },
    });

    // Add members to the team if `membersIds` is provided
    if (membersIds && membersIds.length > 0) {
      await prisma.teamMember.createMany({
        data: membersIds.map((memberId) => ({
          userId: memberId,
          teamId: newTeam.id,
        })),
        skipDuplicates: true, // Avoid duplicate entries
      });
    }

    // Retrieve the full team details, including members
    const teamWithMembers = await prisma.team.findUnique({
      where: { id: newTeam.id },
      include: {
        teamMembers: {
          include: {
            user: { select: { userId: true, username: true, fullname: true } },
          },
        },
      },
    });
    if (projectId !== undefined && projectId !== null) {
      await prisma.projectTeam.create({
        data: {
          projectId: projectId,
          teamId: newTeam.id,
        },
      });
    }

    res.status(201).json(teamWithMembers);
  } catch (error: any) {
    res.status(500).json({ message: `Error creating team: ${error.message}` });
  }
};

export const getTeams = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    // Retrieve the full team details, including members
    let teams = await prisma.team.findMany({
      where: {
        OR: [
          { productOwnerUserId: req.user?.userId },
          { projectManagerUserId: req.user?.userId },
          { teamMembers: { some: { userId: req.user?.userId } } },
        ],
      },
      select: {
        id: true,
        teamName: true,
        productOwnerUserId: true,
        projectManagerUserId: true,
        description: true,

        teamMembers: {
          select: {
            user: { select: { userId: true, username: true, fullname: true } },
          },
        },
      },

    });
    console.log(teams);
    
    const projectOwners = await Promise.all(
      teams.map(async (team) => {
        const projectOwner = await prisma.user.findUnique({
          where: { userId: team.productOwnerUserId ?? -1 },
          select: { userId: true, fullname: true },
        });
        return projectOwner;
      })
    );
    const projectManagers = await Promise.all(
      teams.map(async (team) => {
        const projectManager = await prisma.user.findUnique({
          where: { userId: team.projectManagerUserId ?? -1 },
          select: { userId: true, fullname: true },
        });
        return projectManager;
      })
    );

    teams = teams.map((team, index) => {
      return {
        ...team,
        productOwnerUsername: projectOwners[index]?.fullname,
        projectManagerUsername: projectManagers[index]?.fullname,
      };
    });

    res.json(teams);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving teams: ${error.message}` });
  }
};
// Join a team
export const joinTeam = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { teamId } = req.body as { teamId: number };

  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // Update the user's team association
    const team = await prisma.user.update({
      where: { userId: req.user.userId },
      data: { teamId: Number(teamId) },
    });

    res.json(team);
  } catch (error: any) {
    res.status(500).json({ message: `Error joining team: ${error.message}` });
  }
};

export const getProjectTeams = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { projectId } = req.params as { projectId: string };

  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const projectTeams = await prisma.projectTeam.findMany({
      where: { projectId: Number(projectId) },
      select: {
        team: {
          select: {
            id: true,
            teamName: true,

            teamMembers: {
              select: {
                user: {
                  select: { userId: true, username: true, fullname: true },
                },
              },
            },
          },
        },
      },
    });

    if (!projectTeams) {
      res.status(404).json({ message: "Project teams not found" }); // Return 404 if no project teams are found
      return;
    }
    const teams = projectTeams.map((projectTeam) => projectTeam.team);

    res.json(teams);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving project teams: ${error.message}` });
  }
};
