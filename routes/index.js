import { Router } from "express";

import { userRouter } from "../routes/userRouter.js";
import { lessonRouter } from "../routes/lessonRouter.js";
import { eventRouter } from "../routes/eventRouter.js";
import { scheduleRouter } from "../routes/scheduleRouter.js";
import { progressRouter } from "../routes/progressRouter.js";
import { priceRouter } from "../routes/priceRouter.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = new Router();

router.use("/lesson/schedule/progress", authMiddleware, progressRouter);
router.use("/lesson/schedule", authMiddleware, scheduleRouter);
router.use("/lesson", lessonRouter);
router.use("/lesson", priceRouter);
router.use("/user", userRouter);
router.use("/event", eventRouter);

export default router;
