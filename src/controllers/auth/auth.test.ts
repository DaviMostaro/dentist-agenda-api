import { EmailAlreadyExistsError } from "../../services/errors/email-already-exists.error";
import { prisma } from "../../libs/prisma";
import * as UserService from "../../services/authService";
import { InvalidCredentialsError } from "../../services/errors/invalid-credentials.error";
import bcrypt from "bcrypt"

describe("Testing authController", () => {
    let name = "john doe";
    let email = "johndoe@me.com";
    let password = "130330500550";

    let name2 = "existed user";
    let slug = "existed-user";
    let email2 = "existed@user";
    let password2 = "123456";

    beforeAll(async () => {
        const hashedPassword = await bcrypt.hash(password2, 8)
        await prisma.user.create({ data: { name: name2, email: email2, slug: slug, password: hashedPassword } });
    })

    afterAll(async () => {
        await prisma.user.delete({ where: { email } });
        await prisma.user.delete({ where: { email: email2 } });
    });

    it("should create a new user", async () => {
        const result = await UserService.createUserService({ name, email, password });
        expect(result).toHaveProperty("token");
        expect(result).toHaveProperty("user");
    })

    it("shouldn't create a new user with the same email", async () => {
        const result = UserService.createUserService({ name, email, password });
        await expect(result).rejects.toThrow(EmailAlreadyExistsError);
    })

    it("should login a user", async () => {
        const result = await UserService.LoginUserService(email2, password2);
        expect(result).toHaveProperty("token");
        expect(result).toHaveProperty("user");
    })

    it("shouldn't login a user with a invalid email", async () => {
        const result = UserService.LoginUserService("invalid-email", password2);
        await expect(result).rejects.toThrow(InvalidCredentialsError);
    })

    it("shouldn't login a user with a invalid password", async () => {
        const result = UserService.LoginUserService(email2, "invalid-password");
        await expect(result).rejects.toThrow(InvalidCredentialsError)
    })
})