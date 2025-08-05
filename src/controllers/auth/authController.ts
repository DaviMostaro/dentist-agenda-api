import { Request, RequestHandler, Response } from "express";
import { signupSchema } from "../../schemas/signup-schema";
import { createUserService, LoginUserService } from "../../services/authService";
import { signinSchema } from "src/schemas/signin-schema";
import { EmailAlreadyExistsError } from "src/services/errors/email-already-exists.error";
import { InvalidCredentialsError } from "src/services/errors/invalid-credentials.error";

export const createUserHandler: RequestHandler = async (req: Request, res: Response) => {
    const safeData = signupSchema.safeParse(req.body);
    if (!safeData.success) {
        return res.status(400).json({ message: "Validation error", issue: safeData.error.format() });
    }

    const { name, email, password } = safeData.data;

    try {
        const result = await createUserService({ name, email, password});
        return res.status(201).json(result);
    } catch (error){
        if (error instanceof EmailAlreadyExistsError) {
            res.status(400).json({ message: error.message });
        }

        throw error;
    } 
}

export const LoginUserHandler: RequestHandler = async (req: Request, res: Response) => {
    const safeData = signinSchema.safeParse(req.body);
    if(!safeData.success) {
        return res.status(400).json({ message: "Validation error", issue: safeData.error.format() });
    }

    const { email, password } = safeData.data;

    try {
        const result = await LoginUserService(email, password)
        return res.status(200).json(result);
    } catch (error) {
        if (error instanceof InvalidCredentialsError) {
            res.status(400).json({ message: error.message });
        }

        throw error;
    }
}