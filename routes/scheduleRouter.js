import { Router } from "express";
// import { Controller as lessonScheduleController } from "../controllers/lessonScheduleController.js";

const router = new Router();

router.post("/");
router.get("/");
router.get("/:id");
router.delete("/:id");
router.patch("/:id");

export { router as scheduleRouter };
