import { EmailAlreadyExistsError } from "../../services/errors/email-already-exists.error";
import { prisma } from "../../libs/prisma";
import * as UserService from "../../services/authService";

describe("Testing authController", () => {
    let name = "john doe";
    let email = "johndoe@me.com";
    let password = "130330500550";

    afterAll(async () => {
        await prisma.user.delete({ where: { email } });
    });

    it("should create a new user", async () => {
        const result = await UserService.createUser({ name, email, password });
        expect(result).toHaveProperty("token");
        expect(result).toHaveProperty("user");
    })

    it("shouldn't create a new user with the same email", async () => {
        const result = UserService.createUser({ name, email, password });
        await expect(result).rejects.toThrow(EmailAlreadyExistsError);
    })
})