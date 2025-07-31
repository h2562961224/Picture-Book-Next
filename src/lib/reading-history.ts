import { PictureBook } from '@/types/book';

export interface ReadingHistoryItem {
  book: PictureBook;
  readAt: string;
}

const READING_HISTORY_KEY = 'reading_history';
const MAX_HISTORY_COUNT = 1000;

// 获取阅读历史
export function getReadingHistory(): ReadingHistoryItem[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const history = localStorage.getItem(READING_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('获取阅读历史失败:', error);
    return [];
  }
}

// 添加阅读记录
export function addToReadingHistory(book: PictureBook): void {
  if (typeof window === 'undefined') return;
  
  try {
    const history = getReadingHistory();
    
    // 移除已存在的相同书籍记录
    const filteredHistory = history.filter(item => item.book.id !== book.id);
    
    // 添加新记录到开头
    const newHistory = [{
      book,
      readAt: new Date().toISOString()
    }, ...filteredHistory];
    
    // 限制最大数量
    const limitedHistory = newHistory.slice(0, MAX_HISTORY_COUNT);
    
    localStorage.setItem(READING_HISTORY_KEY, JSON.stringify(limitedHistory));
  } catch (error) {
    console.error('保存阅读历史失败:', error);
  }
}

// 清空阅读历史
export function clearReadingHistory(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(READING_HISTORY_KEY);
  } catch (error) {
    console.error('清空阅读历史失败:', error);
  }
}

// 搜索阅读历史
export function searchReadingHistory(query: string): ReadingHistoryItem[] {
  const history = getReadingHistory();
  
  if (!query.trim()) return history;
  
  const searchTerm = query.toLowerCase().trim();
  
  return history.filter(item => {
    const book = item.book;
    return (
      book.title.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm) ||
      book.publishing.toLowerCase().includes(searchTerm) ||
      book.keyword.toLowerCase().includes(searchTerm)
    );
  });
}

// 获取阅读历史数量
export function getReadingHistoryCount(): number {
  return getReadingHistory().length;
}