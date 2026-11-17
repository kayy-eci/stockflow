import { pool } from "../config/db.ts";
import type { CreateStockAdjustmentInput } from "../models/schema.ts";

export async function createStockAdjustment(ownerId: number, data: CreateStockAdjustmentInput) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const productResult = await client.query(
            "SELECT id, stock_qty FROM products WHERE id = $1 FOR UPDATE",
            [data.product_id]
        );
        const product = productResult.rows[0];
        if (!product) {
            throw new Error(`Produk dengan id ${data.product_id} tidak ditemukan`);
        }

        const newStock = product.stock_qty + data.change_qty;
        if (newStock < 0) {
            throw new Error("Stok tidak boleh menjadi negatif");
        }

        await client.query(
            "UPDATE products SET stock_qty = $1 WHERE id = $2",
            [newStock, data.product_id]
        );

        const adjustmentResult = await client.query(
            `INSERT INTO stock_adjustments (product_id, adjusted_by, change_qty, reason, note)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [data.product_id, ownerId, data.change_qty, data.reason, data.note ?? null]
        );

        await client.query("COMMIT");
        return adjustmentResult.rows[0];
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

export async function getAdjustmentsByProduct(productId: number) {
    const result = await pool.query(
        "SELECT * FROM stock_adjustments WHERE product_id = $1 ORDER BY created_at DESC",
        [productId]
    );
    return result.rows;
}
