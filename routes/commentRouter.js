import { Router } from "express";
import { Controller as commentController } from "../controllers/commentController.js";
const router = new Router();

router.post("/", commentController);
router.get("/", commentController);
router.delete("/", commentController);
router.patch("/", commentController);

export { router as commentRouter };
