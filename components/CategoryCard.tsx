import Link from 'next/link';
import { Category } from './categories';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const cardStyle: React.CSSProperties = {
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    transition: 'box-shadow 0.3s',
    cursor: 'pointer',
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.boxShadow = 'none';
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <h2
        style={{
          marginTop: 0,
          marginBottom: '1rem',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <category.Icon />
        </span>
        <Link
          href={category.href}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          {category.title}
        </Link>
      </h2>
      <div style={{ color: '#6b7280', marginBottom: '1rem' }}>
        {category.description}
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <h3
          style={{
            fontSize: '1rem',
            fontWeight: '600',
            marginBottom: '0.5rem',
          }}
        >
          最新記事
        </h3>
        {category.posts.length > 0 ? (
          <ul
            style={{
              fontSize: '0.875rem',
              marginLeft: '1rem',
              marginBottom: '0.5rem',
            }}
          >
            {category.posts.map((post) => {
            
              return (
                <li key={post.href}>
                  <Link
                    href={post.href}
                    style={{ color: '#3b82f6', textDecoration: 'none' }}
                  >
                    {post.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
            記事はまだありません
          </div>
        )}
      </div>
      <Link
        href={category.href}
        style={{
          color: '#3b82f6',
          textDecoration: 'none',
          fontSize: '0.875rem',
          fontWeight: '500',
        }}
      >
        もっと見る →
      </Link>
    </div>
  );
}

