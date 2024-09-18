import { z } from "zod";
import { isUsernameAvailable } from "./actions/user.action";

export const QuestionsSchema = z.object({
    title: z.string().min(5).max(130),
    explanation: z.string().min(20),
    tags: z.array(z.string().min(1).max(15)).min(1).max(3),
});

export const AnswerSchema = z.object({
    answer: z.string().min(20),
});

export const ProfileSchema = z.object({
    name: z
        .string()
        .min(3)
        .max(40)
        .refine((name) => name.trim().split(" ").length >= 2, {
            message: "Name must contain both first and last name",
        }),
    username: z
        .string()
        .min(3)
        .max(20)
        .regex(/^[a-zA-Z0-9_-]+$/, {
            message: "Username can only contain letters, numbers, '_' or '-'.",
        })
        .refine(async (val) => {
            const availability = await isUsernameAvailable(val);

            return availability;
        }, "This username is already taken"),

    bio: z.string().min(10).max(500).optional().optional().or(z.literal("")),
    location: z.string().min(2).max(50).optional().or(z.literal("")),
    portfolioWebsite: z.string().url().optional().or(z.literal("")),
});
