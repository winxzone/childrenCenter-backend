import { Router } from "express";
import { Controller as eventController } from "../controllers/eventController.js";

const router = new Router();

router.post("/", eventController.create);
router.get("/", eventController.getAll);
router.get("/:id", eventController.getOne);
router.delete("/:id", eventController.delete);
router.patch("/:id", eventController.update);

export { router as eventRouter };
