import StorageIcon from '@mui/icons-material/Storage';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import ArticleIcon from '@mui/icons-material/Article';
import { ComponentType } from 'react';

export interface CategoryPost {
  title: string;
  href: string;
}

export interface Category {
  id: string;
  title: string;
  description: string;
  href: string;
  Icon: ComponentType;
  posts: CategoryPost[];
}

export const categories: Category[] = [
  {
    id: 'db',
    title: 'データベース',
    description: 'データベースに関する技術記事',
    href: '/posts/db',
    Icon: StorageIcon,
    posts: [
      {
        title: 'Next.jsとNextraでブログを始める',
        href: '/posts/db/first-post',
      },
    ],
  },
  {
    id: 'network',
    title: 'ネットワーク',
    description: 'ネットワークに関する技術記事',
    href: '/posts/network',
    Icon: RssFeedIcon,
    posts: [],
  },
  {
    id: 'diary',
    title: '日記',
    description: '日々の出来事や雑記',
    href: '/posts/diary',
    Icon: ArticleIcon,
    posts: [
      {
        title: 'はじめに',
        href: '/posts/diary/getting-started',
      },
    ],
  },
];

