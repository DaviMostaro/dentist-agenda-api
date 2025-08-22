import { Router } from "express";
import { createUserHandler, LoginUserHandler } from "../controllers/auth/authController";

export const authRouter = Router();

authRouter.post('/signup', createUserHandler);
authRouter.post('/signin', LoginUserHandler);