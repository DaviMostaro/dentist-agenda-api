import jwt from "jsonwebtoken"

export const createToken = (slug: string) => {
    return jwt.sign({ slug }, process.env.JWT_SECRET!, { expiresIn: "1d" });
}