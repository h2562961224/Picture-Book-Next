export interface PictureBook{
  id: number;
  age_bracket: string;
  difficulty_level: string;
  title: string;
  image: string;
  keyword: string;
  author: string;
  publishing: string;
  hits: number;
  updated_at: string;
  pages: BookPage[];
  categoryCode: string;
}

export interface Category {
  id: number;
  title: string;
  code: string;
  children?: Category[];
}

export interface BookPage {
  image: string;
  audio: string;
}

export interface BookFilter {
  keyword?: string;
  category?: string;
  sortBy: 'updated_at' | 'hits';
  sortOrder: 'asc' | 'desc';
}

export interface FilterOption{
  label?: string;
  value: string;
}

export interface CascadeFilterOption{
  label: string;
  value: string;
  children?: CascadeFilterOption[];
}

export interface Filter {
  categories: CascadeFilterOption[];
  ages: FilterOption[];
  difficulties: FilterOption[];
  sortBy: FilterOption[];
}

export interface FilterParam{
  category: string;
  sortBy: string;
  age: string;
  difficulty: string;
  page: number;
  keyword?: string;
}