export interface PictureBook {
  id: number;
  state: number;
  title: string;
  image: string;
  age_bracket: string;
  author: string;
  publishing: string;
  intro: string;
  keyword: string;
  text: string;
  audio: string;
  audio_format: string;
  price: string;
  book_type: string;
  language: string;
  difficulty_level: string;
  membership_level: number;
  hits: number;
  share_user_id: number;
  share_nickname: string;
  share_avatar: string;
  share_date: string;
  pdf_file: string;
  pdf_updated_at: string | null;
  published_at: string;
  created_at: string;
  updated_at: string;
  pages: BookPage[];
  categories: BookCategory[];
}

export interface PartPictureBook{
  id: number;
  title: string;
  image: string;
  keyword: string;
  author: string;
  publishing: string;
  hits: number;
  updated_at: string;
}

export interface BookPage {
  id: number;
  pb_id: number;
  image: string;
  aspect_ratio: string;
  text: string;
  text_english: string;
  order: number;
  audio: string;
  audio_format: string;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
}

export interface BookCategory {
  id: number;
  state: number;
  parent_id: number;
  title: string;
  icon: string;
  name: string;
  title_short: string;
  abstract: string;
  difficulty_level: string;
  hot: number;
  label: string;
  description: string;
  position: number;
  created_at: string;
  updated_at: string;
  pivot: {
    pb_id: number;
    category_id: number;
  };
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

export interface Filter {
  categories: FilterOption[];
  sortBy: FilterOption[];
}

export interface FilterParam{
  category: string;
  sortBy: string;
  page: number;
  keyword?: string;
}