import { prisma } from "../libs/prisma"
import { CreateUserType } from "../types/UserType"

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

export const createUser = async (data: CreateUserType) => {
    const user = await prisma.user.create({
        data
    })

    if(user) {
        return user;
    }

    return null;
}