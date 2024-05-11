import { Router } from "express";
import { Controller as userController } from "../controllers/userController.js";

const router = new Router();

router.post("/login", userController);
router.post("/registration", userController);
router.get("/auth", userController);
router.get("/:id", userController);
router.patch("/", userController);

export { router as userRouter };
