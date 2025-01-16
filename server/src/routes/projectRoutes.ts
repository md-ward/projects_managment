import { Router } from "express";
import {
  assignTeamToProject,
  createProject,
  getProject,
  getProjects,
} from "../controllers/projectController";
import checkAuth from "../middleware/authMiddleware";

const router = Router();

router.get("/:projectId", checkAuth, getProject);
router.get("/", checkAuth, getProjects);
router.post("/", checkAuth, createProject);
router.post("/addTeam", checkAuth, assignTeamToProject);
export default router;
