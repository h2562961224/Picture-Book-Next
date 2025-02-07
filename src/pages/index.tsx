'use client';

import { BookFilter, BookFilterProps } from '@/components/book/book-filter';
import { fetchAllBooks, fetchFilter, sortBook } from '@/lib/books';



export async function getStaticProps() {
  const books = await fetchAllBooks();
  const filter = await fetchFilter();
  return {
    props: {
      books: sortBook(books, 'updated_at').map(({
        id,
        title,
        image,
        keyword,
        author,
        publishing,
        hits,
        updated_at
      }) => ({
        id,
        title,
        image,
        keyword,
        author,
        publishing,
        hits,
        updated_at
      })).slice(0, 20),
      filter,
      total: books.length,
      param: {
        category: 'all',
        tag: 'all',
        sortBy: 'updated_at',
        page: 1,
      }
    }
  }
}

export default function Home(props: BookFilterProps) {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">绘本列表</h1>
      <BookFilter {...props} />
    </main>
  );
}
