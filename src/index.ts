import express, { Application } from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";

dotenv.config();
const app: Application = express();
const PORT = process.env.PORT;

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("API works");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
