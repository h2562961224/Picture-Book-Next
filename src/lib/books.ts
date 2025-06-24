import { Filter, PictureBook } from "@/types/book";

let resCache: Promise<PictureBook[]>;

export async function fetchAllBooks(): Promise<PictureBook[]> {
  if (!resCache) {
    console.log('fetching books');
    resCache = fetch(process.env.BOOKS_FETCH_URL || '').then(res => res.json());
  }
  return await resCache;
}

export async function fetchFilter(): Promise<Filter> {
  const categories: Record<string, string> = {};
  const allBooks = await fetchAllBooks();
  allBooks.forEach(book => {
    if(book.categories){
      book.categories.forEach(category => {
        categories[category.name] = category.title;
      });
    }
  });
  return {
    categories: [{'label': '全部', value: 'all'}, ...Object.keys(categories).map(key => ({ label: categories[key], value: key }))],
    sortBy: [
      { label: '最近更新', value: 'updated_at' },
      { label: '最多点击', value: 'hits' },
    ],
  };
}

export function sortBook(books: PictureBook[], sortBy: string): PictureBook[] {
  return books.sort((a, b) => {
    if (sortBy === 'updated_at') {
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    } else if (sortBy === 'hits') {
      return b.hits - a.hits;
    }
    return 0;
  });
}