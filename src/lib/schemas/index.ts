import { z } from "zod";

const EMAIL_SCHEMA = z
  .string()
  .min(1, "Email Address is required.")
  .email("Invalid Email Address.");

export const registerSchema = z.object({
  email: EMAIL_SCHEMA,
  name: z
    .string()
    .min(1, {
      message: "Name is required.",
    })
    .min(4, "Name must be at least 4 characters.")
    .max(24, "Maximum length of Name is 24 characters."),
  address: z
    .string()
    .optional()
});

