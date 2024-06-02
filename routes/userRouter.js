import { Router } from "express";
import { Controller as userController } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = new Router();

router.post("/login", userController.login);
router.post("/registration", userController.registration);
router.get("/auth", authMiddleware, userController.check);
router.patch("/", userController.changeRole);

export { router as userRouter };
