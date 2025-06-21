import {z} from "zod";

export const authSchema = z.object({
    email: z.string().email("Must be an email address."),
    password: z.string().min(6),
});