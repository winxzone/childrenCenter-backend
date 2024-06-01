import { Router } from "express";
import { Controller as progressController } from "../controllers/progressController.js";

const router = new Router();

router.post("/", progressController.create);
router.get("/", progressController.getAll);
router.get("/:id", progressController.getOne);
router.delete("/:id", progressController.delete);
router.patch("/:id", progressController.update);

export { router as progressRouter };
