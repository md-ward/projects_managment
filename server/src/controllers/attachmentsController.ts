import path from "path";
import { Attachment, PrismaClient } from "@prisma/client";
import AuthenticatedRequest from "../types/authReqInterface";
import { Response } from "express";
const fs = require("fs");
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

export async function deleteAttachment(attachments: Attachment[]) {
  try {
    const deletionResults = await Promise.allSettled(
      attachments.map((attachment) => {
        return new Promise((resolve, reject) => {
          const fileExtension = attachment.fileName?.split(".").pop();
          const filePath = path
            .join(
              "./src",
              "public",
              fileExtension || "",
              attachment.fileName || ""
            )
          console.log(filePath);

          fs.unlink(filePath, (err: NodeJS.ErrnoException | null) => {
            if (err) {
              console.error(`Error deleting file: ${filePath}`, err);
              reject(err);
            } else {
              console.log(`Deleted: ${filePath}`);
              resolve(`Deleted: ${filePath}`);
            }
          });
        });
      })
    );

    return deletionResults;
  } catch (error) {
    console.error("Error in deleteAttachment:", error);
    throw error;
  }
}
