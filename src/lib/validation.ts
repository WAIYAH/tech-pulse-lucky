import { z } from "zod";

const blockedPattern =
  /(<\s*script|<\/\s*script|javascript:|data:text\/html|on\w+\s*=|<[^>]+>)/i;

export const containsUnsafeContent = (value: string): boolean =>
  blockedPattern.test(value);

export const createSafeTextSchema = (
  label: string,
  min: number,
  max: number,
) =>
  z
    .string()
    .trim()
    .min(min, `${label} must be at least ${min} characters.`)
    .max(max, `${label} must be ${max} characters or less.`)
    .refine((value) => !containsUnsafeContent(value), {
      message: `${label} contains unsupported characters.`,
    });

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required.")
  .max(120, "Email is too long.")
  .email("Enter a valid email address.");

export const phoneSchema = z
  .string()
  .trim()
  .min(10, "Phone number is too short.")
  .max(20, "Phone number is too long.")
  .regex(/^\+?[0-9][0-9\s-]{8,18}$/, "Enter a valid phone number.");

export const transactionCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(
    /^[A-Z0-9]{6,16}$/,
    "Use 6-16 letters/numbers for transaction code.",
  );

export const optionalUrlSchema = z
  .string()
  .trim()
  .max(2048, "URL is too long.")
  .optional()
  .or(z.literal(""))
  .refine((value) => {
    if (!value) return true;
    return /^https?:\/\//i.test(value);
  }, "Enter a valid URL starting with http:// or https://.");

export const dateNotFutureSchema = z
  .string()
  .min(1, "Please select a date.")
  .refine((value) => {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return false;

    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return parsed.getTime() <= today.getTime();
  }, "Date cannot be in the future.");

export const honeypotSchema = z.string().max(0, "Spam detected.");
