import { Request, RequestHandler, Response } from "express";
import { signupSchema } from "../../schemas/signup-schema";
import { createUser } from "../../services/authService";

export const createUserHandler: RequestHandler = async (req: Request, res: Response) => {
    const safeData = signupSchema.safeParse(req.body);
    if (!safeData.success) {
        return res.status(400).json({ message: "Validation error", issue: safeData.error.format() });
    }

    const { name, email, password } = safeData.data;
    const result = await createUser({ name, email, password});

    if (result instanceof Error) {
        return res.status(400).json({ message: result.message });
    }

    return res.status(201).json(result);
}