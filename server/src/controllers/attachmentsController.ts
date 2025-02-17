import { PrismaClient } from "@prisma/client";
import AuthenticatedRequest from "../types/authReqInterface";
import { Response } from "express";

const prisma = new PrismaClient();

export async function attachFile(req: AuthenticatedRequest, res: Response) {
  try {
    req.body.userId = req.user?.userId;

    const attachment = await prisma.attachment.create({ data: req.body });
    res.send(attachment.id); // Send the attachment ID as the response attachment.id;
  } catch (error) {
    return error;
  }
}
