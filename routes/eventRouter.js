import { Router } from "express";
import { Controller as eventController } from "../controllers/eventController.js";

const router = new Router();

router.post("/", eventController);
router.get("/", eventController);
router.get("/:id", eventController);
router.delete("/:id", eventController);
router.patch("/:id", eventController);

export { router as eventRouter };
