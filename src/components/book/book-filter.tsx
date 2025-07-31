'use client';

import { Badge } from '../ui/badge';
import { Filter, FilterParam, PictureBook } from '@/types/book';
import { BookCard } from './book-card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useState, useMemo } from 'react';
import { sortBook } from '@/lib/books';
import { useRouter } from 'next/router';

export interface BookFilterProps {
  filter: Filter;
  allBooks: PictureBook[];
}

export function BookFilter({ filter: {
  categories, sortBy, ages, difficulties,
}, allBooks }: BookFilterProps) {
  const router = useRouter();

  const [searchKeyword, setSearchKeyword] = useState('');
  const [param, setParam] = useState<FilterParam>({
    category: 'all',
    sortBy: 'hits',
    age: 'all',
    difficulty: 'all',
    page: 1
  });
  const [selectedPrimary, setSelectedPrimary] = useState<string>('all');
  const [showAllSubCategories, setShowAllSubCategories] = useState(false);

  const secondCatOptions = useMemo(() => {
    return categories.find((cat) => cat.value === selectedPrimary)?.children || [];
  }, [selectedPrimary, categories]);

  const handleFilter = (cur: Partial<FilterParam>) => {
    setParam({
      ...param,
      ...cur,
    });
  };

  const handlePrimaryCategoryChange = (value: string) => {
    setSelectedPrimary(value);
    // 如果选择了一级类目，重置为该一级类目
    handleFilter({ category: value, page: 1 });
  };

  const handleSecondaryCategoryChange = (value: string) => {
    handleFilter({ category: value, page: 1 });
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

  const handleRandomBook = () => {
    if (allBooks.length > 0) {
      const randomIndex = Math.floor(Math.random() * allBooks.length);
      const randomBook = allBooks[randomIndex];
      router.push(`/books/${randomBook.id}`);
    }
  };

  const [total, books] = useMemo(() => {
    const { category, age, difficulty, keyword, page, sortBy: sort } = param;
    const filterCatBooks = allBooks.filter((book) => {
      // 类别筛选 - 使用categoryCode进行左匹配
      if (category && category !== 'all' && !book.categoryCode.startsWith(category)) {
        return false;
      }

      // 年龄段筛选
      if (age && age !== 'all' && !book.age_bracket.includes(age)) {
        return false;
      }

      // 难度筛选
      if (difficulty && difficulty !== 'all' && book.difficulty_level !== difficulty) {
        return false;
      }

      // 关键词搜索
      if (keyword && keyword.trim()) {
        const searchTerm = keyword.toLowerCase().trim();
        const titleMatch = book.title.toLowerCase().includes(searchTerm);
        const authorMatch = book.author.toLowerCase().includes(searchTerm);
        const publishingMatch = book.publishing.toLowerCase().includes(searchTerm);

        // 搜索标签
        let keywordMatch = false;
        try {
          const keywords = JSON.parse(book.keyword || '[]');
          keywordMatch = keywords.some((kw: string) => kw.toLowerCase().includes(searchTerm));
        } catch {
          keywordMatch = false;
        }

        if (!titleMatch && !authorMatch && !publishingMatch && !keywordMatch) {
          return false;
        }
      }

      return true;
    });

    const start = (Number(page) - 1) * 20;
    const end = start + 20;
    const books = sortBook(filterCatBooks, sort).slice(start, end);
    return [ filterCatBooks.length, books ];
  }, [param, allBooks]);

  return (
    <>
      <div className="space-y-8 mb-8">
        {/* 搜索区域 */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-accent to-primary rounded-full"></div>
            <h2 className="text-xl font-bold text-accent">🔍 搜索绘本</h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 max-w-full">
            <div className="relative flex-1 max-w-md">
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
            <div className="flex gap-3">
              <Button
                onClick={handleSearch}
                className="rounded-full px-4 sm:px-6 lg:hover:animate-wiggle text-sm md:text-base"
                variant="playful"
              >
                <span className="hidden sm:inline">🔍 搜索</span>
                <span className="sm:hidden">🔍</span>
              </Button>
              <Button
                onClick={handleRandomBook}
                className="rounded-full px-4 sm:px-6 lg:hover:animate-wiggle text-sm md:text-base bg-gradient-to-r from-secondary to-accent hover:from-secondary/90 hover:to-accent/90"
                variant="default"
              >
                <span className="hidden sm:inline">🎲 试试手气</span>
                <span className="sm:hidden">🎲</span>
              </Button>
            </div>
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

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-6 md:h-8 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
            <h2 className="text-lg md:text-xl font-bold text-primary">📚 选择分类</h2>
          </div>

          {/* 一级类目 */}
          <div className="space-y-3">
            <h3 className="text-sm md:text-base font-medium text-primary/80">📖 主要分类</h3>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {categories.map(({ label, value }) => {
                const isSelected = selectedPrimary === value;
                return (
                  <Badge
                    key={value}
                    variant={isSelected ? 'default' : 'outline'}
                    className={`cursor-pointer transition-all duration-200 text-xs md:text-sm ${isSelected
                      && 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                      }`}
                    onClick={() => handlePrimaryCategoryChange(value)}
                  >
                    {label}
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* 二级类目 */}
          {secondCatOptions.length > 1 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm md:text-base font-medium text-secondary/80">🔖 细分类目</h3>
                {secondCatOptions.length > 6 && (
                  <Button
                    variant="outline"
                    size='sm'
                    onClick={() => setShowAllSubCategories(!showAllSubCategories)}
                    className="text-xs text-primary transition-all duration-200 p-1 h-auto"
                  >
                    {showAllSubCategories ? '收起 ↑' : `更多 (${secondCatOptions.length - 6}) ↓`}
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {(showAllSubCategories ? secondCatOptions : secondCatOptions.slice(0, 6)).map(({ label, value }) => {
                  const isSelected = param.category === value;
                  return (
                    <Badge
                      key={value}
                      variant={isSelected ? 'default' : 'outline'}
                      className={`cursor-pointer transition-all duration-200 text-xs md:text-sm ${isSelected
                        && 'bg-gradient-to-r from-secondary to-accent text-white shadow-lg'
                        }`}
                      onClick={() => handleSecondaryCategoryChange(value)}
                    >
                      {label}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 年龄 */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-6 md:h-8 bg-gradient-to-b from-secondary to-accent rounded-full"></div>
            <h2 className="text-lg md:text-xl font-bold text-accent"> 📅 年龄</h2>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {ages.map(({ label, value }) => (
              <Badge
                key={value}
                variant={param.age === value ? 'default' : 'outline'}
                className={`cursor-pointer transition-all duration-200 text-xs md:text-sm ${param.age === value
                  && 'bg-gradient-to-r from-secondary to-accent text-white shadow-lg'
                  }`}
                onClick={() => handleFilter({ age: value, page: 1 })}
              >
                {label}
              </Badge>
            ))}
          </div>
        </div>

        {/* 难度 */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-6 md:h-8 bg-gradient-to-b from-secondary to-accent rounded-full"></div>
            <h2 className="text-lg md:text-xl font-bold text-accent"> 📚 难度</h2>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {difficulties.map(({ label, value }) => (
              <Badge
                key={value}
                variant={param.difficulty === value ? 'default' : 'outline'}
                className={`cursor-pointer transition-all duration-200 text-xs md:text-sm ${param.difficulty === value
                  && 'bg-gradient-to-r from-secondary to-accent text-white shadow-lg'
                  }`}
                onClick={() => handleFilter({ difficulty: value, page: 1 })}
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
                className={`cursor-pointer transition-all duration-200 text-xs md:text-sm ${param.sortBy === value
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