import slugify from "slugify"
import { prisma } from "../libs/prisma"
import { CreateUserType } from "../types/UserType"
import { hash, compare } from "bcrypt"
import { createToken } from "../utils/jwt-token"
import { EmailAlreadyExistsError } from "./errors/email-already-exists.error"
import { InvalidCredentialsError } from "./errors/invalid-credentials.error"

export const findUserByEmail = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: { email }
    })

    if (!user) {
        // throw new Error("User not found")
        return null
    }

    return user;
}

export const findUserBySlug = async (slug: string) => {
    const user = await prisma.user.findUnique({
        where: { slug }
    })

    if (!user) {
        // throw new Error("User not found")
        return null
    }

    return user;
}

export const createUserService = async ({ name, email, password }: CreateUserType) => {
    const hasEmail = await findUserByEmail(email);
    if (hasEmail) {
        throw new EmailAlreadyExistsError();
    }

    let genSlug = true;
    let userSlug = slugify(name, { lower: true });
    while (genSlug) {
        const hasSlug = await findUserBySlug(userSlug);
        if (hasSlug) {
            let randomSuffix = Math.floor(Math.random() * 1000);
            userSlug = slugify(name + randomSuffix, { lower: true });
        } else {
            genSlug = false;
        }
    }

    const hashPassword = await hash(password, 10)

    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashPassword,
            slug: userSlug
        }
    })

    if(!newUser) {
        return new Error("Error creating user");
    }

    const token = createToken(userSlug);

    return {
        token,
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        },
        message: "User created successfully"
    }
}

export const LoginUserService = async (email: string, password: string) => {
    const user = await findUserByEmail(email);
    if (!user) {
        throw new InvalidCredentialsError();
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
        throw new InvalidCredentialsError();
    }

    const token = createToken(user.slug);

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    }
}