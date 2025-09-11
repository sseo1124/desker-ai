import { z } from "zod";
import { AUTH_VALIDATION } from "config/constants";
export const signUpSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: AUTH_VALIDATION.MESSAGES.EMAIL_INVALID }),
  password: z
    .string()
    .trim()
    .min(8, { message: AUTH_VALIDATION.MESSAGES.PASSWORD_TOO_SHORT })
    .max(72, { message: AUTH_VALIDATION.MESSAGES.PASSWORD_TOO_LONG }),
  phoneNumber: z
    .string()
    .trim()
    .min(7, { message: AUTH_VALIDATION.MESSAGES.PHONE_TOO_SHORT })
    .max(32, { message: AUTH_VALIDATION.MESSAGES.PHONE_TOO_LONG }),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;
