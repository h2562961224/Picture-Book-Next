'use client';

import { BookFilter, BookFilterProps } from '@/components/book/book-filter';
import { fetchAllBooks, fetchFilter, sortBook } from '@/lib/books';

interface PathParam {
  category: string;
  page: string;
  sortBy: string;
}



export async function getServerSideProps({ params, query }: { params: PathParam, query: { keyword?: string } }) {
  const { category, page, sortBy } = params;
  const keyword = query.keyword || '';
  
  const filterCatBooks = (await fetchAllBooks()).filter((book) => {
    // 类别筛选
    if (category && category !== 'all' && !book.categories.map((c) => c.name).includes(category)) {
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
  const books = sortBook(filterCatBooks, sortBy).slice(start, end);
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
      total: filterCatBooks.length,
      param: { ...params, page: Number(page), keyword }
    }
  }
}

export default function Home(props: BookFilterProps) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      {/* 头部欢迎区域 */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-4 mb-4">
            <span className="text-4xl animate-bounce-gentle">📖</span>
            <h1 className="text-4xl font-bold">
              发现更多精彩绘本
            </h1>
            <span className="text-4xl animate-bounce-gentle" style={{ animationDelay: '0.5s' }}>✨</span>
          </div>
          <p className="text-lg opacity-90 max-w-xl mx-auto">
            根据你的喜好，找到最适合的故事～
          </p>
        </div>
      </div>
      
      {/* 主要内容区域 */}
      <div className="container mx-auto px-4 py-12">
        <BookFilter {...props} />
      </div>
      
      {/* 装饰性底部 */}
      <div className="bg-gradient-to-r from-secondary/10 to-accent/10 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 text-muted-foreground">
            <span className="text-2xl">🌸</span>
            <span className="font-medium">让阅读成为最美好的时光</span>
            <span className="text-2xl">🌸</span>
          </div>
        </div>
      </div>
    </main>
  );
}
