import { Router } from "express";
import checkAuth from "../middleware/authMiddleware";
import imageUploadMiddleware from "../middleware/attachmentsMiddleware";
import { attachFile } from "../controllers/attachmentsController";

const router = Router();

router.post("/", checkAuth, imageUploadMiddleware, attachFile);

export default router;
