import { Router } from "express";
import { Controller as priceController } from "../controllers/priceController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import checkRoleMiddleware from "../middleware/checkRoleMiddleware.js";

const router = new Router();

router.post(
    "/setprice",
    authMiddleware,
    checkRoleMiddleware(["admin"]),
    priceController.setPrice
);
// router.get("/");
// router.get("/:id");

export { router as priceRouter };
