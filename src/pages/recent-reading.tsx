'use client';

import { RecentReading } from '@/components/book/recent-reading';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';
import { ArrowLeft } from 'lucide-react';

export default function RecentReadingPage() {
  const router = useRouter();

  const handleGoBack = () => {
    router.push('/');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      {/* 头部导航 */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={handleGoBack}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary transition-all duration-300 rounded-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回首页
            </Button>
            <div className="flex items-center gap-3">
              <span className="text-3xl animate-bounce-gentle">📚</span>
              <h1 className="text-2xl md:text-3xl font-bold">
                最近阅读
              </h1>
            </div>
          </div>
        </div>
      </div>
      
      {/* 主要内容区域 */}
      <div className="container mx-auto px-4 py-6 md:py-12">
        <RecentReading />
      </div>
      
      {/* 装饰性底部 */}
      <div className="bg-gradient-to-r from-secondary/10 to-accent/10 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 text-muted-foreground">
            <span className="text-2xl">🌸</span>
            <span className="font-medium">重温美好的阅读时光</span>
            <span className="text-2xl">🌸</span>
          </div>
        </div>
      </div>
    </main>
  );
}