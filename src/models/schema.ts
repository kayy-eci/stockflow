
import { z } from "zod";

export const UserRoleSchema = z.enum(["owner", "staff"]);

export const AdjustmentReasonSchema = z.enum([
  "restock",
  "correction",
  "shrinkage",
  "return",
]);

export const CreateUserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(150),
  password: z.string().min(8),
  role: UserRoleSchema.default("staff"),
});

export const UpdateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().max(150).optional(),
  password: z.string().min(8).optional(),
  role: UserRoleSchema.optional(),
});

export const UserResponseSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  email: z.string().email(),
  role: UserRoleSchema,
  created_at: z.date(),
  updated_at: z.date(),
});

export const Credetials = z.object({
    email: z.string().email(),
    password: z.string().min(8),
})

export const CreateCategorySchema = z.object({
  name: z.string().min(1).max(100),
});

export const UpdateCategorySchema = z.object({
  name: z.string().min(1).max(100).optional(),
});

export const CategoryResponseSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  created_at: z.date(),
});


export const CreateProductSchema = z.object({
  sku: z.string().min(1).max(50),
  name: z.string().min(1).max(150),
  category_id: z.number().int().positive().nullable().optional(),
  cost_price: z.number().nonnegative(),
  sell_price: z.number().nonnegative(),
  stock_qty: z.number().int().nonnegative().default(0),
  low_stock_threshold: z.number().int().nonnegative().default(5),
  is_active: z.boolean().default(true),
});

export const UpdateProductSchema = z.object({
  sku: z.string().min(1).max(50).optional(),
  name: z.string().min(1).max(150).optional(),
  category_id: z.number().int().positive().nullable().optional(),
  cost_price: z.number().nonnegative().optional(),
  sell_price: z.number().nonnegative().optional(),
  stock_qty: z.number().int().nonnegative().optional(),
  low_stock_threshold: z.number().int().nonnegative().optional(),
  is_active: z.boolean().optional(),
});

export const ProductResponseSchema = z.object({
  id: z.number().int().positive(),
  sku: z.string(),
  name: z.string(),
  category_id: z.number().int().positive().nullable(),
  cost_price: z.number(),
  sell_price: z.number(),
  stock_qty: z.number().int(),
  low_stock_threshold: z.number().int(),
  is_active: z.boolean(),
  created_at: z.date(),
  updated_at: z.date(),
});

export const CreateOrderSchema = z.object({
  items: z.array(
    z.object({
      product_id: z.number().int().positive(),
      quantity: z.number().int().positive(),
    })
  ).min(1),
});

export const OrderResponseSchema = z.object({
  id: z.number().int().positive(),
  staff_id: z.number().int().positive(),
  total_amount: z.number().nonnegative(),
  created_at: z.date(),
});

export const OrderItemResponseSchema = z.object({
  id: z.number().int().positive(),
  order_id: z.number().int().positive(),
  product_id: z.number().int().positive(),
  quantity: z.number().int().positive(),
  unit_price: z.number().nonnegative(),
  subtotal: z.number().nonnegative(),
});


export const CreateStockAdjustmentSchema = z.object({
  product_id: z.number().int().positive(),
  change_qty: z.number().int().refine(
    (value) => value !== 0,
    "Change quantity cannot be zero"
  ),
  reason: AdjustmentReasonSchema,
  note: z.string().nullable().optional(),
});

export const StockAdjustmentResponseSchema = z.object({
  id: z.number().int().positive(),
  product_id: z.number().int().positive(),
  adjusted_by: z.number().int().positive(),
  change_qty: z.number().int(),
  reason: AdjustmentReasonSchema,
  note: z.string().nullable(),
  created_at: z.date(),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;

export type CreateStockAdjustmentInput = z.infer<
  typeof CreateStockAdjustmentSchema
>;
