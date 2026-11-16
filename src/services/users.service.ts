import type { QueryResultRow } from "pg";
import { pool } from "../config/db.ts";

export const getAllUsers = async () => {
    const result = await pool.query<QueryResultRow[]>(
        "SELECT id, name, email, password, role, created_at, updated_at FROM users"
    );
    return result.rows;
};
