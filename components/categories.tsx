import StorageIcon from '@mui/icons-material/Storage';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import ArticleIcon from '@mui/icons-material/Article';
import { ComponentType } from 'react';
import { CardDescription } from '../constants/CardDescription';

export interface CategoryPost {
  href: string;
  title: string;
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
    description: CardDescription.db,
    href: '/posts/db',
    Icon: StorageIcon,
    posts: [
      {
        href: '/posts/db/sql-blob',
        title: 'SQLって画像保存できるんですか!?',
      },
    ],
  },
  {
    id: 'network',
    title: 'ネットワーク',
    description: CardDescription.network,
    href: '/posts/network',
    Icon: RssFeedIcon,
    posts: [],
  },
  {
    id: 'diary',
    title: '日記',
    description: CardDescription.diary,
    href: '/posts/diary',
    Icon: ArticleIcon,
    posts: [],
  },
];

