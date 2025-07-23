import { Request, RequestHandler, Response } from "express";
import { signupSchema } from "../schemas/signup-schema";
import { createUser, findUserByEmail, findUserBySlug } from "../services/authService";
import slug from "slug";
import { hash } from "bcrypt-ts"
import { createToken } from "../utils/jwt-token";

export const createUserHandler: RequestHandler = async (req: Request, res: Response) => {
    const safeData = signupSchema.safeParse(req.body);
    if (!safeData.success) {
        return res.status(400).json({ message: "Validation error", issue: safeData.error.format() });
    }

    const { name, email, password } = safeData.data;

    const hasEmail = await findUserByEmail(email);
    if (hasEmail) {
        return res.status(400).json({ message: "Email already registered" });
    }

    let genSlug = true;
    let userSlug = slug(name, { lower: true });
    while (genSlug) {
        const hasSlug = await findUserBySlug(userSlug);
        if (hasSlug) {
            let randomSuffix = Math.floor(Math.random() * 1000);
            userSlug = slug(name + randomSuffix, { lower: true });
        } else {
            genSlug = false;
        }
    }

    const hashPassword = await hash(password, 10)

    const newUser = await createUser({
        slug: userSlug,
        name,
        email,
        password: hashPassword
    })

    if (!newUser) {
        return res.status(500).json({ message: "Error creating user" });
    }

    const token = createToken(userSlug);

    res.status(201).json({
        token,
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        },
        message: "User created successfully"
    })

}