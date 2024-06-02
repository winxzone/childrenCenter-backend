import { Router } from "express";
import { Controller as userController } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import checkRoleMiddleware from "../middleware/checkRoleMiddleware.js";

const router = new Router();

router.post("/login", userController.login);
router.post("/registration", userController.registration);
router.get("/auth", authMiddleware, userController.check);
// router.patch("/", userController.changeRole);

router.post(
    "/change-role",
    authMiddleware,
    checkRoleMiddleware(["admin"]),
    userController.changeRole
);

export { router as userRouter };
