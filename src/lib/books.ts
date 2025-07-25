import { CascadeFilterOption, Category, Filter, PictureBook } from "@/types/book";

let resCache: Promise<PictureBook[]>;
let catCache: Promise<Category[]>;

export async function fetchAllBooks(): Promise<PictureBook[]> {
  if (!resCache) {
    console.log('fetching books');
    resCache = fetch(process.env.BOOKS_FETCH_URL || '').then(res => res.json());
  }
  return await resCache;
}

export async function fetchCategories(): Promise<Category[]> {
  if (!catCache) {
    console.log('fetching categories');
    catCache = fetch(process.env.CATEGORIES_FETCH_URL || '').then(res => res.json());
  }
  return await catCache;
}

// 获取分类筛选数据，支持二级联动
export async function fetchCategoryFilter(): Promise<CascadeFilterOption[]> {
  const categories = await fetchCategories();
  
  // 构建除了all以外的类目
  const optionsWithoutAll = categories.map(category => ({ 
      label: category.title, 
      value: category.code,
      children: category.children?.map(child => ({ label: child.title, value: child.code }))
    }));
  
  // 构建all
  const allOption = {
    label: '全部',
    value: 'all',
    children: optionsWithoutAll.flatMap(category => category.children || []),
  };
  
  return [allOption, ...optionsWithoutAll];
}

export async function fetchFilter(): Promise<Filter> {
  const ages: Record<string, string> = {};
  const difficulties: Record<string, string> = {};
  const allBooks = await fetchAllBooks();
  
  allBooks.forEach(book => {
    if(book.age_bracket){
      const ageStrs = book.age_bracket.split(',');
      ageStrs.forEach(age => {
        age = age.trim();
        if (age) {
          if (age === '0'){
            ages['0~3岁'] = '0~3岁';
          } else {
            ages[age] = age;
          }
        }
      })
    }
    if(book.difficulty_level){
      difficulties[book.difficulty_level] = book.difficulty_level;
    }
  });
  
  return {
    categories: await fetchCategoryFilter(),
    ages: [{'label': '全部', value: 'all'}, ...Object.keys(ages).sort().map(key => ({ label: ages[key], value: key }))],
    difficulties: [{'label': '全部', value: 'all'}, ...Object.keys(difficulties).sort().map(key => ({ label: difficulties[key], value: key }))],
    sortBy: [
      { label: '最近更新', value: 'updated_at' },
      { label: '最多点击', value: 'hits' },
    ],
  };
}

export function sortBook(books: PictureBook[], sortBy: string): PictureBook[] {
  return books.sort((a, b) => {
    if (sortBy === 'updated_at') {
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    } else if (sortBy === 'hits') {
      return b.hits - a.hits;
    }
    return 0;
  });
}