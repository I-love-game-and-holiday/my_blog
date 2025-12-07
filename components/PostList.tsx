import Link from 'next/link';
import { Post } from '../lib/getPosts';

interface PostListProps {
  posts: Post[];
}

export default function PostList({ posts }: PostListProps) {

  if (posts.length === 0) {
    return (
      <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
        現在、記事はありません。
      </div>
    );
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {posts.map((post) => (
        <li
          key={post.href}
          style={{
            marginBottom: '1rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <Link
            href={post.href}
            style={{
              color: '#3b82f6',
              textDecoration: 'none',
              fontSize: '1rem',
              fontWeight: '500',
              display: 'block',
              marginBottom: '0.25rem',
            }}
          >
            {post.title}
          </Link>
          {post.date && (
            <div
              style={{
                color: '#6b7280',
                fontSize: '0.875rem',
                marginBottom: '0.25rem',
              }}
            >
              {post.date}
            </div>
          )}
          {post.description && (
            <div
              style={{
                color: '#6b7280',
                fontSize: '0.875rem',
              }}
            >
              {post.description}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

