'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter, FilterParam, PartPictureBook } from '@/types/book';
import { BookCard } from './book-card';
import { buildFilterPath } from '@/lib/utils';
import { useRouter } from 'next/router';
import { Button } from '../ui/button';

export interface BookFilterProps {
  filter: Filter;
  param: FilterParam;
  books: PartPictureBook[];
  total: number;
}

export function BookFilter({ filter: {
  categories, tags, sortBy,
}, param, books, total }: BookFilterProps) {

  const router = useRouter();

  const handleFilter = (cur: Partial<FilterParam>) => {
    //跳转到指定地址
    router.push(buildFilterPath(param, cur));
  };

  return (
    <>
      <div className="flex flex-wrap gap-4 mb-6">
        <Select
          value={param.category}
          onValueChange={(value) => handleFilter({ category: value, tag: 'all' })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="选择类目" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(({ label, value }) => (
              <SelectItem key={value} value={value}>
                {label || value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={param.tag}
          onValueChange={(value) => handleFilter({ tag: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="选择标签" />
          </SelectTrigger>
          <SelectContent>
            {tags.map(({ label, value }) => (
              <SelectItem key={value} value={value}>
                {label || value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={param.sortBy}
          onValueChange={(value) => handleFilter({ sortBy: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="排序方式" />
          </SelectTrigger>
          <SelectContent>
            {sortBy.map(({ label, value }) => (
              <SelectItem key={value} value={value}>
                {label || value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
        {books.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground py-12">
            暂无符合条件的绘本
          </div>
        )}
      </div>
      <div className="mt-8 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          共 {total} 本绘本
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFilter({ page: Math.max(1, param.page - 1) })}
            disabled={param.page <= 1}
          >
            上一页
          </Button>
          <div className="text-sm">
            第 {param.page} 页
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFilter({ page: param.page + 1 })}
            disabled={param.page * 20 >= total}
          >
            下一页
          </Button>
        </div>
      </div>
    </>
  );
}