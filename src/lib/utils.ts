import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { BookFilter, FilterParam, PictureBook } from "@/types/book";

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

export function filterBooks(books: PictureBook[], filter: BookFilter): PictureBook[] {
  return books
    .filter(book => {
      if (filter.keyword && !book.title.toLowerCase().includes(filter.keyword.toLowerCase())) {
        return false;
      }
      if (filter.category && !book.categories.some(cat => cat.name === filter.category)) {
        return false;
      }
      if (filter.tags && filter.tags.length > 0) {
        const bookTags = parseKeywords(book.keyword);
        if (!filter.tags.some(tag => bookTags.includes(tag))) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      const order = filter.sortOrder === 'asc' ? 1 : -1;
      if (filter.sortBy === 'hits') {
        return (a.hits - b.hits) * order;
      }
      return (new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()) * order;
    });
}

export function buildFilterPath(prev: FilterParam, cur: Partial<FilterParam>): string {
  const {
    category, 
    tag,
    sortBy,
    page,
  } = {
    ...prev,
    ...cur,
  }
  const path = `/filter/${category}/${tag}/${sortBy}/${page}`;
  console.log("buildPAth", path)
  return path;
}