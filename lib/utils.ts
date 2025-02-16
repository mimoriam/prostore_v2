import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format number with decimal places
export const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    "Price must have exactly two decimal places (e.g., 49.99)",
  );

// This function ensures numbers always have two decimal places. For example:
// 49 becomes “49.00”.
// 49.9 becomes “49.90”.
// This is important for monetary values where precision matters.
export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split(".");
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
}

// Format Errors
// Here, we are checking for two types of errors: ZodError and PrismaClientKnownRequestError. If the error is a
// ZodError, we format the error message by joining the error messages for each field. If the error is a PrismaClientKnownRequestError and the error code is P2002, we format the error message by capitalizing the first letter of the field name that caused the uniqueness error. If the error is neither a ZodError nor a PrismaClientKnownRequestError, we return the error message as a string.

export function formatError(error: any): string {
  if (error.name === "ZodError") {
    // Handle Zod error
    const fieldErrors = Object.keys(error.errors).map((field) => {
      const message = error.errors[field].message;
      return typeof message === "string" ? message : JSON.stringify(message);
    });

    return fieldErrors.join(". ");
  } else if (error.name === "PrismaClientKnownRequestError" && error.code === "P2002") {
    // Handle Prisma error
    const field = error.meta?.target ? error.meta.target[0] : "Field";
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  } else {
    // Handle other errors
    return typeof error.message === "string" ? error.message : JSON.stringify(error.message);
  }
}
