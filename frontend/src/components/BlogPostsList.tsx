"use client";

import { useQuery } from "@apollo/client/react";
import { GET_POSTS } from "@/lib/queries";
import { BlogPostCard } from "./BlogPostCard";

interface Post {
  documentId: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  coverImage?: {
    url: string;
    alternativeText?: string;
    width?: number;
    height?: number;
  };
  category?: {
    name: string;
    slug: string;
  };
  author?: {
    name: string;
    avatar?: {
      url: string;
      alternativeText?: string;
    };
  };
}

interface PostsResponse {
  posts: Post[];
}

export function BlogPostsList() {
  const { loading, error, data } = useQuery<PostsResponse>(GET_POSTS, {
    variables: {
      filters: {
        publishedAt: {
          notNull: true,
        },
      },
      pagination: {
        pageSize: 10,
      },
      sort: ["publishedAt:desc"],
    },
  });

  if (loading)
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Loading posts...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-red-600 dark:text-red-400">Error loading posts</p>
      </div>
    );

  if (!data?.posts || data.posts.length === 0)
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-600 dark:text-gray-400">No posts yet</p>
      </div>
    );

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {data.posts.map((post) => (
        <BlogPostCard key={post.documentId} post={post} />
      ))}
    </div>
  );
}
