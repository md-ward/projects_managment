import { Router } from "express";

import {
  getUser,
  getUsers,
  loginUser,
  newUser,
  updateUser,
  verifyEmail,
} from "../controllers/userController";
import checkAuth from "../middleware/authMiddleware";
import imageUploadMiddleware from "../middleware/attachmentsMiddleware";

const router = Router();
router.post("/login", loginUser);
// router.search("/search", checkAuth, getUser);
router.get("/user", checkAuth, getUser);
router.put("/user", checkAuth,imageUploadMiddleware, updateUser);
router.get("/verify-email", verifyEmail);

router.get("/", getUsers);
router.post("/signup", newUser);

export default router;
