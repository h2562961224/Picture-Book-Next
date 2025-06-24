'use client';

import { BookFilter, BookFilterProps } from '@/components/book/book-filter';
import { fetchAllBooks, fetchFilter, sortBook } from '@/lib/books';



export async function getServerSideProps({ query }: { query: { keyword: string } }) {
  const keyword = query.keyword || '';
  
  const allBooks = await fetchAllBooks();
  
  // 应用关键词搜索筛选
  const filteredBooks = allBooks.filter((book) => {
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
  
  const books = sortBook(filteredBooks, 'updated_at').slice(0, 20);
  const filter = await fetchFilter();
  
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
      filter,
      total: filteredBooks.length,
      param: {
        category: 'all',
        tag: 'all',
        sortBy: 'updated_at',
        page: 1,
        keyword
      }
    }
  }
}

export default function Home(props: BookFilterProps) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      {/* 头部欢迎区域 */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-4 mb-6">
            <span className="text-6xl animate-bounce-gentle">📚</span>
            <h1 className="text-5xl font-bold">
              童话世界
            </h1>
            <span className="text-6xl animate-bounce-gentle" style={{ animationDelay: '0.5s' }}>🌟</span>
          </div>
          <p className="text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
            欢迎来到神奇的绘本世界！这里有最精彩的故事，最美丽的插画，陪伴小朋友们快乐成长～
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <span className="text-3xl animate-wiggle">🦄</span>
            <span className="text-3xl animate-wiggle" style={{ animationDelay: '0.2s' }}>🌈</span>
            <span className="text-3xl animate-wiggle" style={{ animationDelay: '0.4s' }}>⭐</span>
            <span className="text-3xl animate-wiggle" style={{ animationDelay: '0.6s' }}>🎨</span>
            <span className="text-3xl animate-wiggle" style={{ animationDelay: '0.8s' }}>🎭</span>
          </div>
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
