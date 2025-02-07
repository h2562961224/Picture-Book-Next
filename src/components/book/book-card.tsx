import Image from 'next/image';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import { PartPictureBook } from '@/types/book';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate, parseKeywords } from '@/lib/utils';

interface BookCardProps {
  book: PartPictureBook;
}

export function BookCard({ book }: BookCardProps) {
  const tags = parseKeywords(book.keyword);

  return (
    <Link href={`/books/${book.id}`}>
      <Card className="h-full overflow-hidden hover:scale-105 transition-transform duration-300">
        <div className="relative aspect-[3/4] w-full">
          <Image
            src={book.image}
            alt={book.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <CardHeader>
          <CardTitle className="line-clamp-2">{book.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-sm text-muted-foreground">
            <span>{book.author}</span>
            <span className="mx-2">·</span>
            <span>{book.publishing}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags ? tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs font-medium"
              >
                {tag}
              </span>
            )) : ''}
          </div>
        </CardContent>
        <CardFooter className="justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{book.hits}</span>
          </div>
          <time>{formatDate(book.updated_at)}</time>
        </CardFooter>
      </Card>
    </Link>
  );
}