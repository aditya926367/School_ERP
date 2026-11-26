import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import {
  loginController,
  meController,
  refreshController,
  logoutController,
} from "../controllers/auth.controller";

import { authenticate } from "../middleware/auth";


const router = Router();

// Protect against repeated login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});

router.post("/login", loginLimiter, loginController);
router.get("/me", authenticate, meController);
router.post("/refresh", refreshController);
router.post("/logout", logoutController);

export default router;