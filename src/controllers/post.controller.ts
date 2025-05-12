import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { AuthRequest } from "../middlewares/auth.middleware";

// Get semua posts
const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        comments: true,
        likes: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      message: "Posts retrieved successfully",
      data: posts,
    });
  } catch (error) {
    console.error("Error getting all posts:", error);
    res.status(500).json({ message: "Failed to retrieve posts" });
  }
};

// Get post berdasarkan ID
const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const postId = parseInt(id);

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        comments: true,
        likes: true,
      },
    });

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    res.status(200).json({
      message: "Post retrieved successfully",
      data: post,
    });
  } catch (error) {
    console.error("Error getting post by ID:", error);
    res.status(500).json({ message: "Failed to retrieve post" });
  }
};

// Create post baru
const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const { text, imageUrl } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // Validasi input
    if (!text) {
      res.status(400).json({ message: "Text is required" });
      return;
    }

    const newPost = await prisma.post.create({
      data: {
        text,
        imageUrl,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      message: "Post created successfully",
      data: newPost,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Failed to create post" });
  }
};

// Update post
const updatePost = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const postId = parseInt(id);
    const { text, imageUrl } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // Cek apakah post ada
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    // Memastikan user hanya dapat update post miliknya sendiri
    if (post.userId !== userId) {
      res.status(403).json({ message: "You can only update your own posts" });
      return;
    }

    // Update post
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        text,
        imageUrl,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json({
      message: "Post updated successfully",
      data: updatedPost,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Failed to update post" });
  }
};

export { getAllPosts, getPostById, createPost, updatePost };
