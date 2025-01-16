import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import { log } from "console";
import { generateToken } from "../util/generateRegToken";
import { generateConfirmationToken } from "../util/generateDeletionToken";
import sendEmail from "../util/sendEmails";
import { confirmationEmailTemplate } from "../views/emailTemplate";
import AuthenticatedRequest from "../types/authReqInterface";

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      // where: {
      //   isEmailVerified: true,
      // },
      select: {
        userId: true,
        username: true,
        fullname: true,
        email: true,
        profilePictureUrl: true,
      },
    });
    res.status(200).json(users);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving users: ${error.message}` });
  }
};

export const getUser = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { id, email, username } = req.query as {
    id?: string;
    email?: string;
    username?: string;
  };

  console.log("getUser", id, email, username);

  try {
    let t_user;
    if (!id && !email && !username) {
      t_user = await prisma.user.findFirst({
        where: { userId: req.user?.userId },
        select: {
          fullname: true,
          username: true,
          email: true,
          teamId: true,
          teamMemberships: true,
          assignedTasks: true,
        },
      });
    } else {
      t_user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: email ? email : undefined },
            { username: username ? username : undefined },
            { userId: id ? Number(id) : undefined },
          ],
        },
        select: {
          fullname: true,
          username: true,
          email: true,
          teamId: true,
          teamMemberships: true,
          assignedTasks: true,
        },
      });
    }

    if (!t_user) {
      res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(t_user);
  } catch (error: any) {
    log(error.meta?.target);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      res.status(404).json({ message: "User not found" });
    }
    res
      .status(500)
      .json({ message: `Error retrieving user: ${error.message}` });
  }
};

export const newUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user } = req.body as typeof req.body & {
      fullname: string;
      username: string;
      email: string;
      password: string;
    };
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const verificationToken = generateConfirmationToken();
    const tokenExpiration = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const newUser = await prisma.user.create({
      data: {
        username: user.username,
        fullname: user.fullname,
        password: hashedPassword,
        email: user.email,
        emailVerificationToken: verificationToken,
        emailVerificationTokenExpires: tokenExpiration,
      },
    });

    // const verificationLink = `https://localhost:8000/users/verify-email?token=${encodeURIComponent(
    //   verificationToken
    // )}&id=${encodeURIComponent(newUser.userId)}`;
    // const emailContent = confirmationEmailTemplate(username, verificationLink);

    // sendEmail({
    //   to: newUser.email,
    //   subject: "Verify Your Account",
    //   html: emailContent, // Send the HTML content here
    // });

    // res.json({
    //   message:
    //     "User registered successfully! Please check your email to verify your account.",
    //   newUser: { ...newUser, password: undefined },
    // });

    const token = generateToken(newUser.userId, newUser.email);
    res.header("Access-Control-Allow-Credentials", "true");
    res.setHeader("Set-Cookie", `authToken=${token}; SameSite=Strict; Secure`);
    // res.cookie("authToken", token, { httpOnly: true, sameSite: false });
    res.status(201).json({ message: "User registered successfully.", token });
  } catch (error: any) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      if (error.meta?.target === "username") {
        res.status(400).json({ message: "Username is already taken." });
      } else if (error.meta?.target === "email") {
        res.status(400).json({ message: "Email is already in use." });
      }
    }
    res.status(500).json({ message: `Error creating user: ${error.message}` });
  }
};
// Step 2: Email verification with HTML response
export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { token, id } = req.query;

  if (!token || !id) {
    return res.status(400).render("emailStatus", {
      title: "Verification Failed",
      message: "Token and ID are required",
      statusClass: "error",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { userId: Number(id) },
    });

    if (!user) {
      return res.status(404).render("emailStatus", {
        title: "Verification Failed",
        message: "User not found",
        statusClass: "error",
      });
    }

    if (
      user.emailVerificationToken !== token ||
      (user.emailVerificationTokenExpires &&
        user.emailVerificationTokenExpires < new Date())
    ) {
      return res.status(400).render("emailStatus", {
        title: "Verification Failed",
        message: "Invalid or expired verification token",
        statusClass: "error",
      });
    }

    await prisma.user.update({
      where: { userId: Number(id) },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationTokenExpires: null,
      },
    });

    res.render("emailStatus", {
      title: "Email Verified",
      message: "Your email has been successfully verified!",
      statusClass: "success",
    });
  } catch (error: any) {
    console.error("Error verifying email:", error);
    res.status(500).render("emailStatus", {
      title: "Verification Failed",
      message: `Error verifying email: ${error.message}`,
      statusClass: "error",
    });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { user } = req.body as typeof req.body & {
    username: string;
    password: string;
  };

  console.log("loginUser", user);

  try {
    const t_user = await prisma.user.findUnique({
      where: { username: user.username },
      include: {
        projects: true,
      },
    });

    if (!t_user) {
      res.status(401).json({ message: "Invalid username or password" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(
      user.password,
      t_user.password
    );

    if (isPasswordValid) {
      const token = generateToken(t_user.userId, t_user.email);
      res.cookie("authToken", token, { httpOnly: true, secure: false });
      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          username: t_user.username,
          profilePictureUrl: t_user.profilePictureUrl,
          projects: t_user.projects.length,
        },
      });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error: any) {
    res.status(500).json({ message: `Error logging in: ${error.message}` });
  }
};

// Step 3: Request account deletion
export const requestDeleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const token = generateConfirmationToken();
    await prisma.user.update({
      where: { userId: Number(id) },
      data: {
        deletionToken: token,
        deletionTokenExpires: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    res.json({
      message: "Confirmation token sent for account deletion",
      token,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error requesting deletion: ${error.message}` });
  }
};

// Step 4: Confirm deletion with token and delete the user
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id, token } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { userId: Number(id) },
    });

    if (
      !user ||
      user.deletionToken !== token ||
      (user.deletionTokenExpires && user.deletionTokenExpires < new Date())
    ) {
      res.status(400).json({ message: "Invalid or expired deletion token" });
    }

    const deletedUser = await prisma.user.delete({
      where: { userId: Number(id) },
    });

    res.json({ message: "User deleted successfully", deletedUser });
  } catch (error: any) {
    res.status(500).json({ message: `Error deleting user: ${error.message}` });
  }
};
