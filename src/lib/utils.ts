import { type ClassValue, clsx } from "clsx"

// Simplified cn function without tailwind-merge dependency
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}