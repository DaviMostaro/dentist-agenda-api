import { Router } from "express";
import { createUserHandler } from "../controllers/authController";

export const authRouter = Router();

authRouter.post('/register', createUserHandler);