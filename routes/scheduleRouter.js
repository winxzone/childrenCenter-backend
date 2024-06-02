import { Router } from "express";
import { Controller as scheduleController } from "../controllers/scheduleController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import checkRoleMiddleware from "../middleware/checkRoleMiddleware.js";

const router = new Router();

router.post(
    "/",
    authMiddleware,
    checkRoleMiddleware(["admin", "teacher"]),
    scheduleController.create
);
router.get("/", authMiddleware, scheduleController.getAll);
router.get("/:id", authMiddleware, scheduleController.getOne);
router.delete(
    "/:id",
    authMiddleware,
    checkRoleMiddleware(["admin"]),
    scheduleController.delete
);
router.patch(
    "/:id",
    authMiddleware,
    checkRoleMiddleware(["admin", "teacher"]),
    scheduleController.update
);

export { router as scheduleRouter };
