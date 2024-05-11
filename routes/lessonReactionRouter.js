import { Router } from "express";
import { Controller as lessonReactionController } from "../controllers/lessonReactionController.js";
const router = new Router();

router.post("/", lessonReactionController);
router.patch("/", lessonReactionController);
router.delete("/", lessonReactionController);

export { router as lessonReactionRouter };
