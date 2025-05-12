import express, { Application } from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth-routes";
import userRoutes from "./routes/user-routes";
import postRoutes from "./routes/post-routes";

dotenv.config();
const app: Application = express();
const PORT = process.env.PORT;

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("API works");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
