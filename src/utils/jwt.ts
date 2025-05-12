import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;

export const createToken = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET);
};
