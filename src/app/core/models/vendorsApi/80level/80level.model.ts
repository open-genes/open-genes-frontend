export interface I80levelResponseAllArticles {
  // All article items
  articles: {
    total: string;
    title: string;
    image: string;
    items: I80levelResponseArticle[];
  };

  // In the sidebar there are trending articles
  sidebar: I80levelSidebarBlock[];
}

export interface I80levelResponseArticle {
  id: number;
  slug: string;
  title: string;
  author?: {
    name: string;
    pseudonym: string;
    position: null;
    avatar: string;
  };
  date?: string; // Date format: 'Jun 24, 2021'
  description: string;
  image: {
    original: string;
    src: string;
    src2x: string;
    blur: string;
  };
  tags: IArticleTag[];
}

interface IArticleTag {
  name: string;
  slug: string;
}

interface I80levelSidebarBlock {
  id: number;
  type: string;
  content: {
    title: string;
    max: number;
    image: string;
  };
  items: I80levelResponseArticle[];
}

export interface I80levelArticleQueryParams {
  page?: number;
  sort?: 'new' | 'old';
}
