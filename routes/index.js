import { Router } from "express";

import { userRouter } from "../routes/userRouter.js";
import { lessonRouter } from "../routes/lessonRouter.js";
import { eventRouter } from "../routes/eventRouter.js";
import { scheduleRouter } from "../routes/scheduleRouter.js";
import { progressRouter } from "../routes/progressRouter.js";

const router = new Router();

router.use("/lesson/schedule/progress", progressRouter);
router.use("/lesson/schedule", scheduleRouter);
router.use("/lesson", lessonRouter);
router.use("/user", userRouter);
router.use("/event", eventRouter);

export default router;
