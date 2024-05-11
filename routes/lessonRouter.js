import { Router } from "express";
import { Controller as lessonController } from "../controllers/lessonController.js";

const router = new Router();

router.post("/", lessonController);
router.get("/", lessonController);
router.get("/:id", lessonController);
router.delete("/:id", lessonController);
router.patch("/:id", lessonController);

export { router as lessonRouter };
