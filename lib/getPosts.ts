import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Post {
  href: string;
  title: string;
  date?: string;
  description?: string;
}

/**
 * 指定されたディレクトリ内の .mdx ファイルを読み取り、記事情報を返す
 * @param dirPath ディレクトリのパス（例: 'pages/posts/db'）
 * @returns 記事情報の配列
 */
export function getPosts(dirPath: string): Post[] {
  const postsDirectory = path.join(process.cwd(), dirPath);
  
  // ディレクトリが存在しない場合は空配列を返す
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const files = fs.readdirSync(postsDirectory);
  const posts: Post[] = [];

  files.forEach((filename) => {
    // index.mdx は除外
    if (filename === 'index.mdx' || !filename.endsWith('.mdx')) {
      return;
    }

    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);

    // ファイル名から拡張子を除いて href を生成
    const slug = filename.replace(/\.mdx$/, '');
    const categoryPath = dirPath.replace('pages', '').replace(/\\/g, '/');
    const href = `${categoryPath}/${slug}`;

    posts.push({
      href,
      title: data.title || slug,
      date: data.date,
      description: data.description,
    });
  });

  // 日付でソート（新しい順）
  return posts.sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

