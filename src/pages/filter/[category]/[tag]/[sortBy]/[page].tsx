'use client';

import { BookFilter, BookFilterProps } from '@/components/book/book-filter';
import { fetchAllBooks, fetchFilter, sortBook } from '@/lib/books';

interface PathParam {
  category: string;
  tag: string;
  page: string;
  sortBy: string;
}

export async function getStaticPaths() {
  const { categories, tags, sortBy } = await fetchFilter();
  const allBooks = await fetchAllBooks();

  const paths: Array<{ params: PathParam }> = [];
  for (const { value: category } of categories) {
    for (const { value: tag } of tags) {
      const books = allBooks.filter((book) => {
        if (category !== 'all' && !book.categories.map((c) => c.name).includes(category)) {
          return false;
        }
        if (tag !== 'all' && !book.keyword.includes(tag)) {
          return false;
        }
        return true;
      });
      const totalPages = Math.ceil(books.length / 20);
      for (let page = 1; page <= totalPages; page++) {
        sortBy.forEach(({ value: sort }) => {
          paths.push({
            params: { category, tag, page: page.toString(), sortBy: sort },
          });
        });
      }
    }
  }
  return {
    paths,
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params, params: { category, tag, page, sortBy } }: { params: PathParam }) {
  const filterCatBooks = (await fetchAllBooks()).filter((book) => {
    if (category && category !== 'all' && !book.categories.map((c) => c.name).includes(category)) {
      return false;
    }
    return true;

  });
  const allBooks = filterCatBooks.filter((book) => {
    if (tag && tag !== 'all' && book.keyword && book.keyword.indexOf(tag) === -1) {
      return false;
    }
    return true;
  });
  const start = (Number(page) - 1) * 20;
  const end = start + 20;
  const books = sortBook(allBooks, sortBy).slice(start, end);
  const filter = await fetchFilter();
  const tags = Array.from(new Set(filterCatBooks.map((book) => book.keyword && JSON.parse(book.keyword) || []).flat())).map((tag) => ({
    label: tag,
    value: tag,
  }));
  return {
    props: {
      books: books.map(({
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
      })),
      filter: { ...filter, tags: [ { label: '全部', value: 'all' }, ...tags ] },
      total: allBooks.length,
      param: params
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
