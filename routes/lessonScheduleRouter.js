import { Router } from "express";
import { Controller as lessonScheduleController } from "../controllers/lessonScheduleController.js";

const router = new Router();

router.post("/", lessonScheduleController);
router.get("/", lessonScheduleController);
router.get("/:id", lessonScheduleController);
router.delete("/:id", lessonScheduleController);
router.patch("/:id", lessonScheduleController);

export { router as lessonScheduleRouter };
