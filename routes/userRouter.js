import { Router } from "express";
import { Controller as userController } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import checkRoleMiddleware from "../middleware/checkRoleMiddleware.js";

const router = new Router();

router.post("/login", userController.login);
router.post("/registration", userController.registration);
router.get("/auth", authMiddleware, userController.check);

router.post(
    "/change-role",
    authMiddleware,
    checkRoleMiddleware(["admin"]),
    userController.changeRole
);

router.post("/child", authMiddleware, userController.addChild);
router.post("/client", authMiddleware, userController.addClient);
router.post(
    "/employee",
    authMiddleware,
    checkRoleMiddleware(["admin"]),
    userController.addEmployee
);

export { router as userRouter };
