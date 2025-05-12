import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  getUserPosts,
} from "../controllers/user-controller";
import { authMiddleware } from "../middlewares/auth-middleware";

const router = Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.get("/:id/posts", getUserPosts);

router.put("/:id", authMiddleware, updateUser);

export default router;
