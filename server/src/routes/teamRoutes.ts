import { Router } from "express";

import { createTeam, getProjectTeams, getTeams, joinTeam } from "../controllers/teamController";
import checkAuth from "../middleware/authMiddleware";

const router = Router();
router.get("/project/:projectId", checkAuth, getProjectTeams);
router.post("/join", checkAuth, joinTeam);
router.post("/", checkAuth, createTeam);
router.get("/", checkAuth, getTeams);

export default router;
