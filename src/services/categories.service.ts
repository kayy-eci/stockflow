import { pool } from "../config/db.ts";
import type { CreateCategoryInput, UpdateCategoryInput } from "../models/schema.ts";

export async function getAllCategories() {
    const result = await pool.query("SELECT * FROM categories ORDER BY name ASC");
    return result.rows;
}

export async function createCategory(data: CreateCategoryInput) {
    const result = await pool.query(
        "INSERT INTO categories (name) VALUES ($1) RETURNING *",
        [data.name]
    );
    return result.rows[0];
}

export async function updateCategory(id: number, data: UpdateCategoryInput) {
    const result = await pool.query(
        "UPDATE categories SET name = COALESCE($1, name) WHERE id = $2 RETURNING *",
        [data.name ?? null, id]
    );
    return result.rows[0] ?? null;
}

export async function deleteCategory(id: number) {
    const result = await pool.query(
        "DELETE FROM categories WHERE id = $1 RETURNING *",
        [id]
    );
    return result.rows[0] ?? null;
}
