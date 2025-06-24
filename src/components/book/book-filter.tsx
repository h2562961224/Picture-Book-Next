'use client';

import { Badge } from '../ui/badge';
import { Filter, FilterParam, PartPictureBook } from '@/types/book';
import { BookCard } from './book-card';
import { buildFilterPath } from '@/lib/utils';
import { useRouter } from 'next/router';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useState } from 'react';

export interface BookFilterProps {
  filter: Filter;
  param: FilterParam;
  books: PartPictureBook[];
  total: number;
}

export function BookFilter({ filter: {
  categories, sortBy,
}, param, books, total }: BookFilterProps) {

  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = useState(param.keyword || '');

  const handleFilter = (cur: Partial<FilterParam>) => {
    //跳转到指定地址
    router.push(buildFilterPath(param, cur));
  };

  const handleSearch = () => {
    handleFilter({ keyword: searchKeyword, page: 1 });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchKeyword('');
    handleFilter({ keyword: '', page: 1 });
  };

  return (
    <>
      <div className="space-y-8 mb-8">
        {/* 搜索区域 */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-accent to-primary rounded-full"></div>
            <h2 className="text-xl font-bold text-accent">🔍 搜索绘本</h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 max-w-full sm:max-w-md">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="输入书名、作者、出版社或关键词..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-10 rounded-full border-2 border-primary/20 focus:border-primary transition-colors text-sm md:text-base"
              />
              {searchKeyword && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground lg:hover:text-primary transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
            <Button 
              onClick={handleSearch}
              className="rounded-full px-4 sm:px-6 lg:hover:animate-wiggle text-sm md:text-base"
              variant="playful"
            >
              <span className="hidden sm:inline">🔍 搜索</span>
              <span className="sm:hidden">🔍</span>
            </Button>
          </div>
          {param.keyword && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>🎯 当前搜索：</span>
              <Badge variant="secondary" className="font-medium">
                {param.keyword}
              </Badge>
              <button 
                onClick={clearSearch}
                className="text-primary hover:text-primary/80 transition-colors ml-2"
              >
                清除搜索
              </button>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-6 md:h-8 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
            <h2 className="text-lg md:text-xl font-bold text-primary">📚 选择分类</h2>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {categories.map(({ label, value }) => (
              <Badge
                key={value}
                variant={param.category === value ? 'default' : 'outline'}
                className={`cursor-pointer transition-all duration-200 text-xs md:text-sm ${
                  param.category === value
                    && 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                }`}
                onClick={() => handleFilter({ category: value, page: 1 })}
              >
                {label}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-6 md:h-8 bg-gradient-to-b from-secondary to-accent rounded-full"></div>
            <h2 className="text-lg md:text-xl font-bold text-secondary">🔄 排序方式</h2>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {sortBy.map(({ label, value }) => (
              <Badge
                key={value}
                variant={param.sortBy === value ? 'default' : 'outline'}
                className={`cursor-pointer transition-all duration-200 text-xs md:text-sm ${
                  param.sortBy === value
                    && 'bg-gradient-to-r from-secondary to-accent text-white shadow-lg'
                }`}
                onClick={() => handleFilter({ sortBy: value, page: 1 })}
              >
                {label}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {books.map((book, index) => (
          <div 
            key={book.id} 
            className="animate-bounce-gentle"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <BookCard book={book} />
          </div>
        ))}
        {books.length === 0 && (
          <div className="col-span-full text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <div className="text-xl font-semibold text-primary mb-2">暂无符合条件的绘本</div>
            <div className="text-muted-foreground">试试调整筛选条件吧～</div>
          </div>
        )}
      </div>
      <div className="mt-12 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-xl md:text-2xl">📖</div>
            <div className="text-base md:text-lg font-semibold text-primary">
              共 {total} 本精彩绘本
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilter({ page: Math.max(1, param.page - 1) })}
              disabled={param.page <= 1}
              className="hover:animate-wiggle text-xs md:text-sm px-2 md:px-4"
            >
              <span className="hidden sm:inline">← 上一页</span>
              <span className="sm:hidden">←</span>
            </Button>
            <div className="px-2 md:px-4 py-1 md:py-2 bg-white rounded-full shadow-soft font-semibold text-primary text-xs md:text-sm">
              <span className="hidden sm:inline">第 {param.page} 页</span>
              <span className="sm:hidden">{param.page}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilter({ page: param.page + 1 })}
              disabled={param.page * 20 >= total}
              className="hover:animate-wiggle text-xs md:text-sm px-2 md:px-4"
            >
              <span className="hidden sm:inline">下一页 →</span>
              <span className="sm:hidden">→</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}