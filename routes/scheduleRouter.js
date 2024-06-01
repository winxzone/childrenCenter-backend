import { Router } from "express";
import { Controller as scheduleController } from "../controllers/scheduleController.js";

const router = new Router();

router.post("/", scheduleController.create);
router.get("/", scheduleController.getAll);
router.get("/:id", scheduleController.getOne);
router.delete("/:id", scheduleController.delete);
router.patch("/:id", scheduleController.update);

export { router as scheduleRouter };
