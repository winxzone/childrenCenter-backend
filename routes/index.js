import { Router } from "express";
// import { Controller as userController } from "../controllers/userController.js";
const router = new Router();

router.use("/comment", commentRouter);
router.use("/lesson/reaction", lessonReactionRouter);
router.use("/lesson/schedule", lessonScheduleRouter);
router.use("/lesson", lessonRouter);
router.use("/user", userRouter);
router.use("/event", eventRouter);

export default router;
