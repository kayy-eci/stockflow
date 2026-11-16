import { Router, type Request, type Response } from "express";
import { ZodError } from "zod";
import { CreateUserSchema, Credetials } from "../models/schema.ts";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { randomUUID } from "crypto";
import * as userService from "../services/users.service.ts";
import { tokenMiddleWare } from "../middleware/auth.middleware.ts";

const router = Router();

const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
  throw new Error("JWT_SECRET belum diisi di .env");
}

router.get("/users", tokenMiddleWare, async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();

    res.status(200).json({
      message: "Berhasil fetch users!",
      data: users
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Gagal mengambil data users"
    });
  }
});

