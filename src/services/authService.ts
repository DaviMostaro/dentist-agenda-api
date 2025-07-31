import slugify from "slugify"
import { prisma } from "../libs/prisma"
import { CreateUserType } from "../types/UserType"
import { hash } from "bcrypt"
import { createToken } from "../utils/jwt-token"
import { EmailAlreadyExistsError } from "./errors/email-already-exists.error"

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

export const createUser = async ({ name, email, password }: CreateUserType) => {
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