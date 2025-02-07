import { Router } from "express";
import {
  createTask,
  currentUserTasks,
  deleteTask,
  getTasks,
  getUserTasks,
  updateTaskStatus,
} from "../controllers/taskController";
import checkAuth from "../middleware/authMiddleware";

const router = Router();
router.delete("/:taskId", checkAuth, deleteTask);
router.post("/", checkAuth, createTask);
router.get("/", checkAuth, getTasks);
router.get("/user", checkAuth, currentUserTasks);
router.patch("/:taskId/status", updateTaskStatus);
router.get("/user/:userId", getUserTasks);

export default router;
