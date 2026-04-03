import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./utils/db.js";

import statesRouter from "./routes/states.js";
import pincodesRouter from "./routes/pincodes.js";
import statsRouter from "./routes/stats.js";
import exportRouter from "./routes/export.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/states", statesRouter);
app.use("/api/pincodes", pincodesRouter);
app.use("/api/pincode", pincodesRouter);
app.use("/api/stats", statsRouter);
app.use("/api/export", exportRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});