import { Router } from "express";
import { Controller as progressController } from "../controllers/progressController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import checkRoleMiddleware from "../middleware/checkRoleMiddleware.js";

const router = new Router();

router.post("/", authMiddleware, checkRoleMiddleware(["teacher"]), progressController.create);
router.get("/", authMiddleware, progressController.getAll);
router.get("/:id", authMiddleware, progressController.getOne);
router.delete(
    "/:id",
    authMiddleware,
    checkRoleMiddleware(["teacher"]),
    progressController.delete
);
router.patch(
    "/:id",
    authMiddleware,
    checkRoleMiddleware(["teacher"]),
    progressController.update
);

export { router as progressRouter };
