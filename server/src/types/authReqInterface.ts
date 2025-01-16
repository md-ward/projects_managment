import { Request } from "express";
// Extend Request type
export default interface AuthenticatedRequest extends Request {
  user?: { userId: number; role: string; fullName: string; username: string };
}
