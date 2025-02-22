import { Router } from "express";
import {
  createTask,
  currentUserTasks,
  deleteTask,
  getTasks,
  getTasksViaPriority,
  getUserTasks,
  updateTask,
  updateTaskStatus,
} from "../controllers/taskController";
import checkAuth from "../middleware/authMiddleware";
import attachmentUploadMiddleware from "../middleware/attachmentsMiddleware";

const router = Router();
router.delete("/:taskId", checkAuth, deleteTask);
router.post("/", checkAuth, attachmentUploadMiddleware, createTask);
router.get("/", checkAuth, getTasks);
router.get("/priority/:priority", checkAuth, getTasksViaPriority);
router.get("/user", checkAuth, currentUserTasks);
router.patch("/:taskId", checkAuth, updateTask);
router.patch("/:taskId/status", updateTaskStatus);
router.get("/user/:userId", getUserTasks);

export default router;
