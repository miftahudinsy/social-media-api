import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { AuthRequest } from "../middlewares/auth.middleware";
import { hashPassword } from "../utils/bcrypt";

// Get semua users
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    console.error("Error getting all users:", error);
    res.status(500).json({ message: "Failed to retrieve users" });
  }
};

// Get user berdasarkan ID
const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error getting user by ID:", error);
    res.status(500).json({ message: "Failed to retrieve user" });
  }
};

// Update user
const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);
    const { name, email, password } = req.body;

    // Untuk memastikan user yang sedang login hanya bisa update profilnya sendiri
    if (req.user?.id !== userId) {
      res.status(403).json({ message: "You can only update your own profile" });
      return;
    }

    // Mempersiapkan data untuk diupdate
    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.password = await hashPassword(password);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
};

// Get posts dari user tertentu berdasarkan ID
const getUserPosts = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const posts = await prisma.post.findMany({
      where: { userId },
      include: {
        comments: true,
        likes: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      message: "User posts retrieved successfully",
      data: posts,
    });
  } catch (error) {
    console.error("Error getting user posts:", error);
    res.status(500).json({ message: "Failed to retrieve user posts" });
  }
};

export { getAllUsers, getUserById, updateUser, getUserPosts };
