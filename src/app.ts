import express, { type Express } from 'express';
import cors from "cors";
import { pool } from "./config/db.ts";


const app: Express = express();

app.use(cors());


app.get("/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT 1");
    res.status(200).json({
      status: "ok",
      db: "connected",
      result: result.rows,
    });
  } catch (error) {
    console.error("DB connection error:", error);
    res.status(500).json({
      status: "error",
      db: "disconnected",
    });
  }
});

export default app;