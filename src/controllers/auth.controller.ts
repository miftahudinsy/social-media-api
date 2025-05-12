import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { hashPassword, comparePassword } from "../utils/bcrypt";
import { createToken } from "../utils/jwt";

const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Validasi input
    if (!name || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({ message: "Email already registered" });
      return;
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Buat user baru
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      message: "User registered successfully",
      data: newUser,
    });
  } catch (error) {
    console.error("Error when registering:", error);
    res.status(500).json({ message: "Failed to register user" });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    // Verifikasi password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    // Buat token
    const token = createToken({
      id: user.id,
      email: user.email,
    });

    res.status(200).json({
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Error when logging in:", error);
    res.status(500).json({ message: "Failed to login" });
  }
};

export { register, login };
