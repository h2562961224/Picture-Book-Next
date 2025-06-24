import Image from 'next/image';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import { PartPictureBook } from '@/types/book';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate, parseKeywords, cn } from '@/lib/utils';

interface BookCardProps {
  book: PartPictureBook;
}

export function BookCard({ book }: BookCardProps) {
  const tags = parseKeywords(book.keyword);

  return (
    <Link href={`/books/${book.id}`}>
      <Card className="h-full overflow-hidden hover:scale-105 hover:rotate-1 transition-all duration-300 group">
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          <Image
            src={book.image}
            alt={book.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <CardHeader>
          <CardTitle className="line-clamp-2 text-primary group-hover:text-secondary transition-colors duration-300">{book.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <span className="font-medium text-secondary">{book.author}</span>
            <span className="w-1 h-1 bg-accent rounded-full"></span>
            <span>{book.publishing}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags ? tags.slice(0, 3).map((tag, index) => (
              <span
                key={tag}
                className={cn(
                  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200",
                  index === 0 && "bg-primary/10 text-primary border border-primary/20",
                  index === 1 && "bg-secondary/10 text-secondary border border-secondary/20",
                  index === 2 && "bg-accent/10 text-accent-foreground border border-accent/20"
                )}
              >
                {tag}
              </span>
            )) : ''}
          </div>
        </CardContent>
        <CardFooter className="justify-between text-sm">
          <div className="flex items-center gap-2 text-primary font-medium">
            <Eye className="h-4 w-4" />
            <span>{book.hits.toLocaleString()}</span>
          </div>
          <time className="text-muted-foreground">{formatDate(book.updated_at)}</time>
        </CardFooter>
      </Card>
    </Link>
  );
}