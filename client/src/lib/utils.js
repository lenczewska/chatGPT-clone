import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function normalizeText(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^\w\s]/g, "")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function getSearchScore(value, query) {
  const normalizedValue = normalizeText(value);
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery || !normalizedValue) return 0;
  if (normalizedValue === normalizedQuery) return 100;
  if (normalizedValue.startsWith(normalizedQuery)) return 80;
  if (normalizedValue.includes(normalizedQuery)) return 60;
  return 0;
}

