import { pool } from "../config/db.ts";
import type { CreateUserInput } from "../models/schema.ts";
import { hashPassword } from "../utils/password.ts";

export const getAllUsers = async () => {
    const result = await pool.query(
        "SELECT id, name, email, role, created_at, updated_at FROM users ORDER BY created_at ASC"
    );
    return result.rows;
};

export const getUserById = async (id: number) => {
    const result = await pool.query(
        "SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = $1",
        [id]
    );
    return result.rows[0] ?? null;
};

export const getUserByEmail = async (email: string) => {
    const result = await pool.query(
        "SELECT id, name, email, password_hash, role, created_at, updated_at FROM users WHERE email = $1",
        [email]
    );
    return result.rows[0] ?? null;
};

export const createUser = async (data: CreateUserInput) => {
    const passwordHash = await hashPassword(data.password);

    const result = await pool.query(
        "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at, updated_at",
        [data.name, data.email, passwordHash, data.role]
    );
    return result.rows[0];
};
