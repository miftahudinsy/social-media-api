import { Router } from "express";
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
} from "../controllers/post-controller";
import { authMiddleware } from "../middlewares/auth-middleware";

const router = Router();

router.get("/", getAllPosts);
router.get("/:id", getPostById);

router.post("/", authMiddleware, createPost);
router.put("/:id", authMiddleware, updatePost);

export default router;
