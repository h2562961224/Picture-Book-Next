import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { FilterParam } from "@/types/book";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function parseKeywords(keywordString: string): string[] {
  try {
    return JSON.parse(keywordString);
  } catch {
    return [];
  }
}

export function buildFilterPath(prev: FilterParam, cur: Partial<FilterParam>): string {
  const {
    category, 
    sortBy,
    age,
    difficulty,
    page,
    keyword,
  } = {
    ...prev,
    ...cur,
  }
  const path = `/filter/${category}/${age}/${difficulty}/${sortBy}/${page}`;
  const searchParams = new URLSearchParams();
  if (keyword && keyword.trim()) {
    searchParams.set('keyword', keyword.trim());
  }
  const queryString = searchParams.toString();
  console.log("buildPath", path + (queryString ? `?${queryString}` : ''))
  return path + (queryString ? `?${queryString}` : '');
}