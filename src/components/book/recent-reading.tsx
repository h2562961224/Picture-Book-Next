'use client';

import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { BookCard } from './book-card';
import { getReadingHistory, clearReadingHistory, searchReadingHistory, ReadingHistoryItem } from '@/lib/reading-history';
import { formatDate } from '@/lib/utils';
import { Trash2, Clock } from 'lucide-react';

export function RecentReading() {
  const [history, setHistory] = useState<ReadingHistoryItem[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filteredHistory, setFilteredHistory] = useState<ReadingHistoryItem[]>([]);

  useEffect(() => {
    const loadHistory = () => {
      const readingHistory = getReadingHistory();
      setHistory(readingHistory);
      setFilteredHistory(readingHistory);
    };

    loadHistory();
  }, []);

  useEffect(() => {
    const filtered = searchReadingHistory(searchKeyword);
    setFilteredHistory(filtered);
  }, [searchKeyword]);

  const handleClearHistory = () => {
    if (window.confirm('确定要清空所有阅读历史吗？此操作不可恢复。')) {
      clearReadingHistory();
      setHistory([]);
      setFilteredHistory([]);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  const clearSearch = () => {
    setSearchKeyword('');
  };

  return (
    <div className="space-y-8">
      {/* 页面标题和操作区域 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary">📚 最近阅读</h1>
          {history.length > 0 && (
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
              共 {history.length} 本
            </span>
          )}
        </div>
        {history.length > 0 && (
          <Button
            onClick={handleClearHistory}
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:border-red-300"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            清空历史
          </Button>
        )}
      </div>

      {/* 搜索区域 */}
      {history.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-6 bg-gradient-to-b from-accent to-primary rounded-full"></div>
            <h2 className="text-lg font-semibold text-accent">🔍 搜索历史</h2>
          </div>
          <div className="flex gap-3 max-w-md">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="搜索书名、作者或关键词..."
                value={searchKeyword}
                onChange={handleSearch}
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
          </div>
          {searchKeyword && (
            <div className="text-sm text-muted-foreground">
              🎯 找到 {filteredHistory.length} 本相关绘本
            </div>
          )}
        </div>
      )}

      {/* 阅读历史列表 */}
      {filteredHistory.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-6 bg-gradient-to-b from-secondary to-accent rounded-full"></div>
            <h2 className="text-lg font-semibold text-secondary">
              {searchKeyword ? '🔍 搜索结果' : '📖 阅读记录'}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredHistory.map((item, index) => (
              <div 
                key={`${item.book.id}-${item.readAt}`} 
                className="animate-bounce-gentle"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative">
                  <BookCard book={item.book} />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-muted-foreground flex items-center gap-1 shadow-sm">
                    <Clock className="h-3 w-3" />
                    {formatDate(item.readAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : history.length > 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <div className="text-xl font-semibold text-primary mb-2">没有找到相关绘本</div>
          <div className="text-muted-foreground">试试其他关键词吧～</div>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📚</div>
          <div className="text-xl font-semibold text-primary mb-2">还没有阅读记录</div>
          <div className="text-muted-foreground mb-6">开始阅读绘本，这里会自动记录你的阅读历史～</div>
          <Button 
            onClick={() => window.location.href = '/'}
            variant="playful"
            className="rounded-full px-6"
          >
            🔍 去发现绘本
          </Button>
        </div>
      )}
    </div>
  );
}