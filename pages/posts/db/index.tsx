import { GetStaticProps } from 'next';
import Head from 'next/head';
import { getPosts, Post } from "@/lib/getPosts";
import PostList from "@/components/PostList";

interface DbIndexProps {
  posts: Post[];
}

export default function DbIndex({ posts }: DbIndexProps) {
  return (
    <>
      <Head>
        <title>データベース | 技術ブログ</title>
        <meta name="description" content="データベースに関する記事一覧" />
      </Head>
      <div>
        <h1>データベース</h1>
        <p>データベースに関する技術記事を掲載しています。</p>
        
        <h2>記事一覧</h2>
        <PostList posts={posts} />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<DbIndexProps> = async () => {
  const posts = getPosts('pages/posts/db');
  
  return {
    props: {
      posts,
    },
  };
};

