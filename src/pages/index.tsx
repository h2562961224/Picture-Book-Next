'use client';

import { BookFilter, BookFilterProps } from '@/components/book/book-filter';
import { fetchAllBooks, fetchFilter } from '@/lib/books';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getReadingHistoryCount } from '@/lib/reading-history';
import { Button } from '@/components/ui/button';



export async function getStaticProps() {
  
  const allBooks = await fetchAllBooks();
  const filter = await fetchFilter();
  
  return {
    props: {
      allBooks: allBooks.map(({
        id,
        title,
        image,
        keyword,
        author,
        publishing,
        hits,
        categoryCode,
        age_bracket,
        difficulty_level,
        updated_at
      }) => ({
        id,
        title,
        image,
        keyword,
        author,
        publishing,
        hits,
        categoryCode,
        age_bracket,
        difficulty_level,
        updated_at
      })),
      filter
    }
  }
}

export default function Home(props: BookFilterProps) {
  const router = useRouter();
  const [historyCount, setHistoryCount] = useState(0);

  useEffect(() => {
    setHistoryCount(getReadingHistoryCount());
  }, []);

  const handleGoToHistory = () => {
    router.push('/recent-reading');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      {/* 最近阅读浮动按钮 */}
      {historyCount > 0 && (
        <div className="fixed top-4 right-4 z-50">
          <Button
            onClick={handleGoToHistory}
            className="rounded-full shadow-lg bg-white text-primary hover:bg-primary hover:text-white transition-all duration-300 border-2 border-primary/20 hover:border-primary"
            size="sm"
          >
            <span className="flex items-center gap-2">
              <span className="text-lg">📚</span>
              <span className="hidden sm:inline font-medium">最近阅读</span>
              <span className="bg-primary text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                {historyCount > 99 ? '99+' : historyCount}
              </span>
            </span>
          </Button>
        </div>
      )}

      {/* 头部欢迎区域 */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-12 md:py-16 relative">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-6 mb-4 md:mb-6">
            <span className="text-4xl sm:text-5xl md:text-6xl animate-bounce-gentle">📚</span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold whitespace-nowrap">
              童话世界
            </h1>
            <span className="text-4xl sm:text-5xl md:text-6xl animate-bounce-gentle" style={{ animationDelay: '0.5s' }}>🌟</span>
          </div>
          <p className="text-base md:text-xl opacity-90 max-w-2xl mx-auto leading-relaxed px-4">
            欢迎来到神奇的绘本世界！这里有最精彩的故事，最美丽的插画，陪伴小朋友们快乐成长～
          </p>
          <div className="flex justify-center gap-2 md:gap-4 mt-6 md:mt-8">
            <span className="text-2xl md:text-3xl animate-wiggle">🦄</span>
            <span className="text-2xl md:text-3xl animate-wiggle" style={{ animationDelay: '0.2s' }}>🌈</span>
            <span className="text-2xl md:text-3xl animate-wiggle" style={{ animationDelay: '0.4s' }}>⭐</span>
            <span className="text-2xl md:text-3xl animate-wiggle" style={{ animationDelay: '0.6s' }}>🎨</span>
            <span className="text-2xl md:text-3xl animate-wiggle" style={{ animationDelay: '0.8s' }}>🎭</span>
          </div>
          
          {/* 头部快速入口 */}
          {historyCount > 0 && (
            <div className="mt-8">
              <Button
                onClick={handleGoToHistory}
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary transition-all duration-300 rounded-full px-6"
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg">📖</span>
                  <span>查看最近阅读 ({historyCount})</span>
                </span>
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* 主要内容区域 */}
      <div className="container mx-auto px-4 py-6 md:py-12">
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
