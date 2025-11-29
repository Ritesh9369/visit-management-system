import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import visitorRoutes from "./routes/visitorRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();
const app = express();
connectDB();

app.use(cors());
app.use(express.json({ limit: "50mb" })); // Base64 images allowed

app.use("/api/visitors", visitorRoutes);
app.use(errorHandler);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT} 🚀`)
);
