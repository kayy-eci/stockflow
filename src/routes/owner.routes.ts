import { Router } from "express";
import { tokenMiddleWare } from "../middleware/auth.middleware.ts";
import { ownerMiddleware } from "../middleware/owner.middleware.ts";
import {
    CreateCategorySchema,
    UpdateCategorySchema,
    CreateProductSchema,
    UpdateProductSchema,
} from "../models/schema.ts";
import * as categoriesService from "../services/categories.service.ts";
import * as productsService from "../services/products.service.ts";

const router = Router();

router.use(tokenMiddleWare, ownerMiddleware);

// Kategori
router.get("/categories", async (req, res) => {
    try {
        const data = await categoriesService.getAllCategories();
        res.status(200).json({ message: "Berhasil fetch categories!", data });
    } catch (error) {
        console.error("Get categories error:", error);
        res.status(500).json({ message: "Gagal mengambil data kategori" });
    }
});

router.post("/categories", async (req, res) => {
    const parsed = CreateCategorySchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: "Data kategori tidak valid", errors: parsed.error.flatten() });
        return;
    }

    try {
        const data = await categoriesService.createCategory(parsed.data);
        res.status(201).json({ message: "Berhasil membuat kategori!", data });
    } catch (error) {
        console.error("Create category error:", error);
        res.status(500).json({ message: "Gagal membuat kategori" });
    }
});

router.put("/categories/:id", async (req, res) => {
    const parsed = UpdateCategorySchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: "Data kategori tidak valid", errors: parsed.error.flatten() });
        return;
    }

    try {
        const data = await categoriesService.updateCategory(Number(req.params.id), parsed.data);
        if (!data) {
            res.status(404).json({ message: "Kategori tidak ditemukan" });
            return;
        }
        res.status(200).json({ message: "Berhasil update kategori!", data });
    } catch (error) {
        console.error("Update category error:", error);
        res.status(500).json({ message: "Gagal update kategori" });
    }
});

router.delete("/categories/:id", async (req, res) => {
    try {
        const data = await categoriesService.deleteCategory(Number(req.params.id));
        if (!data) {
            res.status(404).json({ message: "Kategori tidak ditemukan" });
            return;
        }
        res.status(200).json({ message: "Berhasil hapus kategori!", data });
    } catch (error) {
        console.error("Delete category error:", error);
        res.status(500).json({ message: "Gagal hapus kategori" });
    }
});

// Produk
router.get("/products", async (req, res) => {
    try {
        const data = await productsService.getAllProducts();
        res.status(200).json({ message: "Berhasil fetch products!", data });
    } catch (error) {
        console.error("Get products error:", error);
        res.status(500).json({ message: "Gagal mengambil data produk" });
    }
});

router.post("/products", async (req, res) => {
    const parsed = CreateProductSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: "Data produk tidak valid", errors: parsed.error.flatten() });
        return;
    }

    try {
        const data = await productsService.createProduct(parsed.data);
        res.status(201).json({ message: "Berhasil membuat produk!", data });
    } catch (error) {
        console.error("Create product error:", error);
        res.status(500).json({ message: "Gagal membuat produk" });
    }
});

router.put("/products/:id", async (req, res) => {
    const parsed = UpdateProductSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: "Data produk tidak valid", errors: parsed.error.flatten() });
        return;
    }

    try {
        const data = await productsService.updateProduct(Number(req.params.id), parsed.data);
        if (!data) {
            res.status(404).json({ message: "Produk tidak ditemukan" });
            return;
        }
        res.status(200).json({ message: "Berhasil update produk!", data });
    } catch (error) {
        console.error("Update product error:", error);
        res.status(500).json({ message: "Gagal update produk" });
    }
});

router.patch("/products/:id/deactivate", async (req, res) => {
    try {
        const data = await productsService.deactivateProduct(Number(req.params.id));
        if (!data) {
            res.status(404).json({ message: "Produk tidak ditemukan" });
            return;
        }
        res.status(200).json({ message: "Produk berhasil dinonaktifkan!", data });
    } catch (error) {
        console.error("Deactivate product error:", error);
        res.status(500).json({ message: "Gagal menonaktifkan produk" });
    }
});

export default router;
