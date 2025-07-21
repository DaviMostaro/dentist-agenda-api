import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().default(3001),
    BASE_URL: z.url().default("http://localhost:3001")
});

const _env = envSchema.safeParse(process.env);

if(_env.success === false) {
    console.error("Environment variable validation failed:", _env.error.format());

    throw new Error("Invalid environment variables");
}

export const env = _env.data;