import { Router } from "express";
import { Controller as lessonController } from "../controllers/lessonController.js";

const router = new Router();

router.post("/", lessonController.create);
router.get("/", lessonController.getAll);
router.get("/:id", lessonController.getOne);
router.delete("/:id", lessonController.delete);
router.patch("/:id", lessonController.update);

export { router as lessonRouter };
