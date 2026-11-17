import { Router } from "express";
import userRoutes from "./user.routes.ts";
import ownerRoutes from "./owner.routes.ts";
import staffRoutes from "./staff.routes.ts";

const router = Router();

router.use("/users", userRoutes);
router.use("/owner", ownerRoutes);
router.use("/staff", staffRoutes);

export default router;
