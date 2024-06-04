import { Router } from "express";
import { Controller as eventController } from "../controllers/eventController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import checkRoleMiddleware from "../middleware/checkRoleMiddleware.js";

const router = new Router();

router.post("/", authMiddleware, checkRoleMiddleware(["admin"]), eventController.create);
router.get("/", authMiddleware, eventController.getAll);
router.get("/:id", authMiddleware, eventController.getOne);
router.delete("/:id", authMiddleware, checkRoleMiddleware(["admin"]), eventController.delete);
router.patch("/:id", authMiddleware, checkRoleMiddleware(["admin"]), eventController.update);

router.post("/registration", authMiddleware, eventController.registration);
export { router as eventRouter };
