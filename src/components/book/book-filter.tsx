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
          <div className="flex gap-3 max-w-md">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="输入书名、作者、出版社或关键词..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-10 rounded-full border-2 border-primary/20 focus:border-primary transition-colors"
              />
              {searchKeyword && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
            <Button 
              onClick={handleSearch}
              className="rounded-full px-6 hover:animate-wiggle"
              variant="playful"
            >
              🔍 搜索
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
            <div className="w-2 h-8 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
            <h2 className="text-xl font-bold text-primary">📚 选择类目</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map(({ label, value }) => (
              <Badge 
                key={value} 
                variant={param.category === value ? "default" : "outline"}
                className="hover:animate-wiggle"
                onClick={() => handleFilter({ category: value })}
              >
                {label || value}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-secondary to-accent rounded-full"></div>
            <h2 className="text-xl font-bold text-secondary">🔄 排序方式</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {sortBy.map(({ label, value }) => (
              <Badge 
                key={value} 
                variant={param.sortBy === value ? "secondary" : "outline"}
                className="hover:animate-wiggle"
                onClick={() => handleFilter({ sortBy: value })}
              >
                {label || value}
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
      <div className="mt-12 flex items-center justify-between bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <div className="text-2xl">📖</div>
          <div className="text-lg font-semibold text-primary">
            共 {total} 本精彩绘本
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFilter({ page: Math.max(1, param.page - 1) })}
            disabled={param.page <= 1}
            className="hover:animate-wiggle"
          >
            ← 上一页
          </Button>
          <div className="px-4 py-2 bg-white rounded-full shadow-soft font-semibold text-primary">
            第 {param.page} 页
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFilter({ page: param.page + 1 })}
            disabled={param.page * 20 >= total}
            className="hover:animate-wiggle"
          >
            下一页 →
          </Button>
        </div>
      </div>
    </>
  );
}