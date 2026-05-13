"use client";

import { useQuery } from "@apollo/client/react";
import Image from "next/image";
import Link from "next/link";
import { GET_POST_BY_SLUG } from "@/lib/queries";
import { StrapiBlocksRenderer } from "./StrapiBlocksRenderer";

interface Post {
  documentId: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: Parameters<typeof StrapiBlocksRenderer>[0]["content"];
  publishedAt?: string;
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
    bio?: string;
    avatar?: {
      url: string;
      alternativeText?: string;
    };
  };
}

interface PostResponse {
  posts: Post[];
}

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

function getMediaUrl(url: string) {
  return url.startsWith("http") ? url : `${strapiUrl}${url}`;
}

function formatDate(date?: string) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function BlogPostDetail({ slug }: { slug: string }) {
  const { loading, error, data } = useQuery<PostResponse>(GET_POST_BY_SLUG, {
    variables: { slug },
  });

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-4 dark:bg-black">
        <p className="text-gray-600 dark:text-gray-400">Loading post...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-4 dark:bg-black">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">Error loading post</p>
          <Link
            href="/"
            className="mt-4 inline-flex font-medium text-blue-700 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-200"
          >
            Back to blog
          </Link>
        </div>
      </main>
    );
  }

  const post = data?.posts?.[0];

  if (!post) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-4 dark:bg-black">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-950 dark:text-gray-50">
            Post not found
          </h1>
          <Link
            href="/"
            className="mt-4 inline-flex font-medium text-blue-700 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-200"
          >
            Back to blog
          </Link>
        </div>
      </main>
    );
  }

  const coverImageUrl = post.coverImage?.url;
  const publishedDate = formatDate(post.publishedAt);
  const authorAvatar = post.author?.avatar?.url;

  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <article>
        <header className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
          <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="mb-8 inline-flex font-medium text-blue-700 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-200"
            >
              Back to blog
            </Link>

            {post.category && (
              <Link
                href={`/category/${post.category.slug}`}
                className="mb-4 inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {post.category.name}
              </Link>
            )}

            <h1 className="text-4xl font-bold tracking-tight text-gray-950 dark:text-gray-50 sm:text-5xl">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="mt-5 text-xl leading-8 text-gray-600 dark:text-gray-400">
                {post.excerpt}
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              {post.author && (
                <div className="flex items-center gap-3">
                  {authorAvatar && (
                    <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                      <Image
                        src={getMediaUrl(authorAvatar)}
                        alt={post.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {post.author.name}
                  </span>
                </div>
              )}
              {publishedDate && <span>{publishedDate}</span>}
            </div>
          </div>
        </header>

        {coverImageUrl && (
          <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800">
              <Image
                src={getMediaUrl(coverImageUrl)}
                alt={post.coverImage?.alternativeText || post.title}
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        )}

        <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6 lg:px-8">
          <StrapiBlocksRenderer content={post.content} />

          {post.author?.bio && (
            <section className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
              <h2 className="text-xl font-semibold text-gray-950 dark:text-gray-50">
                About {post.author.name}
              </h2>
              <p className="mt-3 leading-7 text-gray-700 dark:text-gray-300">
                {post.author.bio}
              </p>
            </section>
          )}
        </div>
      </article>
    </main>
  );
}
