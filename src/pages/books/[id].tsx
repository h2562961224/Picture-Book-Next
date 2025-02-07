import { BookReader } from "@/components/book/book-reader";
import { fetchAllBooks } from "@/lib/books";
import { PictureBook } from "@/types/book";

export async function getStaticPaths() {
  const allBooks = await fetchAllBooks();
  const paths = allBooks.map(book => ({
    params: {
      id: book.id.toString()
    }
  }));
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const allBooks = await fetchAllBooks();
  const book = allBooks.find(book => book.id.toString() === params.id);
  return {
    props: {
      book
    }
  }
}

export default function Player({ book }: { book: PictureBook }) {
  return (
    <BookReader book={book} />
  )
}