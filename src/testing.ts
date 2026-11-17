import express from "express";
import { pool } from "./config/db.ts";
import dotenv from "dotenv";
import app from "./app.ts"

dotenv.config();


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
