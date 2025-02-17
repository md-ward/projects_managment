import { Router } from "express";
import { search, searchUsers } from "../controllers/searchController";
import checkAuth from "../middleware/authMiddleware";

const router = Router();

router.get("/users", checkAuth, searchUsers);
router.get("/", checkAuth, search);

export default router;
