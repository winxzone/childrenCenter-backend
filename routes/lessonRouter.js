import { Router } from "express";
import { Controller as lessonController } from "../controllers/lessonController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import checkRoleMiddleware from "../middleware/checkRoleMiddleware.js";

const router = new Router();

router.post(
    "/",
    authMiddleware,
    checkRoleMiddleware(["admin", "teacher"]),
    lessonController.create
);
router.get("/", authMiddleware, lessonController.getAll);
router.get("/:id", authMiddleware, lessonController.getOne);
router.delete("/:id", authMiddleware, checkRoleMiddleware(["admin"]), lessonController.delete);
router.patch("/:id", authMiddleware, checkRoleMiddleware(["admin"]), lessonController.update);

export { router as lessonRouter };
