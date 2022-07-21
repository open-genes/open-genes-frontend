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

interface IArticleImage {
  original: string;
  src: string;
  src2x: string;
}

export interface I80levelResponseArticle {
  id: number;
  slug: string;
  title: string;
  author?: {
    name: string;
    pseudonym: string;
    position: null;
    avatar: IArticleImage;
  };
  date?: string; // Date format: 'Jun 24, 2021'
  description: string;
  image: IArticleImage & {
    blur: string;
  };
  tags: IArticleTag[];
}

export interface IArticleTag {
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
  items: I80levelOneArticle[];
}

// TODO: describe
interface IArticleMeta {
  'article-article:modified_time': {
    content: string;
    name: string;
    type: string;
    // ...
  };
}

interface IArticleContent {
  content: {
    isQuote: boolean;
    text: string;
  };
  id: number;
  type: string;
}

interface I80levelOneArticle {
  agings: IArticleTag[];
  aside: {
    author: any;
    date: string;
    share: number;
    tags: IArticleTag[];
  };
  comments: any;
  content: IArticleContent[];
  description: string;
  diseases: IArticleTag[];
  genes: IArticleTag[];
  id: number;
  image: string;
  meta: IArticleMeta;
  promo: {
    footer: []; // TODO: describe
    header: [];
    section: [];
    sidebar: [];
  };
  subtitle: string;
  title: string;
  vendors: [];
}

export interface I80levelArticleQueryParams {
  category?: string;
  page?: number;
  sort?: 'new' | 'old';
}
