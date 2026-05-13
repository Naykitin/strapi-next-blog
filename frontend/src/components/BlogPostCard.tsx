"use client";

import Image from "next/image";
import Link from "next/link";

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

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

function getMediaUrl(url: string) {
  return url.startsWith("http") ? url : `${strapiUrl}${url}`;
}

export function BlogPostCard({ post }: { post: Post }) {
  const coverImageUrl = post.coverImage?.url;
  const categoryName = post.category?.name;
  const authorName = post.author?.name;
  const authorAvatar = post.author?.avatar?.url;
  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <article className="flex flex-col rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-950">
      {coverImageUrl && (
        <Link href={`/blog/${post.slug}`}>
          <div className="relative h-64 w-full overflow-hidden rounded-t-lg bg-gray-200 dark:bg-gray-800">
            <Image
              src={getMediaUrl(coverImageUrl)}
              alt={post.coverImage?.alternativeText || post.title}
              fill
              className="object-cover transition-transform hover:scale-105"
            />
          </div>
        </Link>
      )}

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-col gap-3 mb-3">
          {categoryName && (
            <Link
              href={`/category/${post.category?.slug}`}
              className="inline-flex w-fit rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              {categoryName}
            </Link>
          )}
          <h2 className="line-clamp-2 text-2xl font-bold text-gray-900 dark:text-gray-50">
            <Link
              href={`/blog/${post.slug}`}
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              {post.title}
            </Link>
          </h2>
        </div>

        <p className="mb-4 line-clamp-2 flex-1 text-gray-600 dark:text-gray-400">
          {post.excerpt}
        </p>

        {publishedDate && (
          <p className="mb-3 text-sm text-gray-500 dark:text-gray-500">
            {publishedDate}
          </p>
        )}

        {authorName && (
          <div className="flex items-center gap-2 border-t border-gray-200 pt-3 dark:border-gray-800">
            {authorAvatar && (
              <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                <Image
                  src={getMediaUrl(authorAvatar)}
                  alt={authorName}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {authorName}
            </p>
          </div>
        )}
      </div>
    </article>
  );
}
