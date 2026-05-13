"use client";

import { useQuery } from "@apollo/client/react";
import Image from "next/image";
import Link from "next/link";
import { BlogPostCard } from "./BlogPostCard";
import { GET_HOMEPAGE, GET_POSTS } from "@/lib/queries";

interface Media {
  url: string;
  alternativeText?: string;
}

interface Homepage {
  documentId: string;
  hero?: {
    title?: string;
    subtitle?: string;
    ctaLabel?: string;
    ctaHref?: string;
    image?: Media;
  };
  whyUs?: {
    title?: string;
    subtitle?: string;
    items?: Array<{
      title?: string;
      description?: string;
      iconKey?: string;
    }>;
  };
  latestPosts?: {
    title?: string;
    subtitle?: string;
    limit?: number;
  };
  cta?: {
    title?: string;
    text?: string;
    buttonLabel?: string;
    buttonHref?: string;
  };
}

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

interface HomepageResponse {
  homepage?: Homepage | null;
}

interface PostsResponse {
  posts: Post[];
}

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

function getMediaUrl(url: string) {
  return url.startsWith("http") ? url : `${strapiUrl}${url}`;
}

function getIconLabel(iconKey?: string) {
  if (!iconKey) return "B";

  return iconKey
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function HomepageContent() {
  const {
    loading: homepageLoading,
    error: homepageError,
    data: homepageData,
  } = useQuery<HomepageResponse>(GET_HOMEPAGE);

  const homepage = homepageData?.homepage;
  const postsLimit = Math.max(homepage?.latestPosts?.limit || 3, 1);

  const {
    loading: postsLoading,
    error: postsError,
    data: postsData,
  } = useQuery<PostsResponse>(GET_POSTS, {
    skip: !homepage,
    variables: {
      filters: {
        publishedAt: {
          notNull: true,
        },
      },
      pagination: {
        pageSize: postsLimit,
      },
      sort: ["publishedAt:desc"],
    },
  });

  if (homepageLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-4 dark:bg-black">
        <p className="text-gray-600 dark:text-gray-400">Loading homepage...</p>
      </main>
    );
  }

  if (homepageError || !homepage) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-4 dark:bg-black">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-950 dark:text-gray-50">
            Homepage content is unavailable
          </h1>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Check that the Strapi Homepage single type is published.
          </p>
        </div>
      </main>
    );
  }

  const hero = homepage.hero;
  const whyUs = homepage.whyUs;
  const latestPosts = homepage.latestPosts;
  const cta = homepage.cta;
  const posts = postsData?.posts || [];

  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <section className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1fr_480px] lg:items-center lg:px-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-950 dark:text-gray-50 sm:text-5xl">
              {hero?.title || "Blog"}
            </h1>
            {hero?.subtitle && (
              <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-400">
                {hero.subtitle}
              </p>
            )}
            {hero?.ctaLabel && hero.ctaHref && (
              <Link
                href={hero.ctaHref}
                className="mt-7 inline-flex rounded-md bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-gray-50 dark:text-gray-950 dark:hover:bg-gray-200"
              >
                {hero.ctaLabel}
              </Link>
            )}
          </div>

          {hero?.image?.url && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800">
              <Image
                src={getMediaUrl(hero.image.url)}
                alt={hero.image.alternativeText || hero.title || "Homepage hero"}
                fill
                priority
                className="object-cover"
              />
            </div>
          )}
        </div>
      </section>

      {whyUs && (
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-3xl">
            {whyUs.title && (
              <h2 className="text-3xl font-bold text-gray-950 dark:text-gray-50">
                {whyUs.title}
              </h2>
            )}
            {whyUs.subtitle && (
              <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-400">
                {whyUs.subtitle}
              </p>
            )}
          </div>

          {!!whyUs.items?.length && (
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {whyUs.items.map((item, index) => (
                <article
                  key={`${item.title}-${index}`}
                  className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-md bg-blue-100 text-sm font-bold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {getIconLabel(item.iconKey)}
                  </div>
                  {item.title && (
                    <h3 className="mt-5 text-xl font-semibold text-gray-950 dark:text-gray-50">
                      {item.title}
                    </h3>
                  )}
                  {item.description && (
                    <p className="mt-3 leading-7 text-gray-600 dark:text-gray-400">
                      {item.description}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      <section className="border-y border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold text-gray-950 dark:text-gray-50">
                {latestPosts?.title || "Latest posts"}
              </h2>
              {latestPosts?.subtitle && (
                <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-400">
                  {latestPosts.subtitle}
                </p>
              )}
            </div>
            <Link
              href="/blog"
              className="inline-flex w-fit rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-900"
            >
              View all posts
            </Link>
          </div>

          {postsLoading && (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-600 dark:text-gray-400">Loading posts...</p>
            </div>
          )}

          {postsError && (
            <div className="flex items-center justify-center py-12">
              <p className="text-red-600 dark:text-red-400">Error loading posts</p>
            </div>
          )}

          {!postsLoading && !postsError && posts.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No posts yet</p>
            </div>
          )}

          {!postsLoading && !postsError && posts.length > 0 && (
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogPostCard key={post.documentId} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>

      {cta && (
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="rounded-lg bg-gray-950 px-6 py-10 text-center text-white dark:bg-gray-900 sm:px-10">
            {cta.title && (
              <h2 className="text-3xl font-bold tracking-tight">{cta.title}</h2>
            )}
            {cta.text && (
              <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-gray-300">
                {cta.text}
              </p>
            )}
            {cta.buttonLabel && cta.buttonHref && (
              <Link
                href={cta.buttonHref}
                className="mt-7 inline-flex rounded-md bg-white px-5 py-3 text-sm font-semibold text-gray-950 transition hover:bg-gray-200"
              >
                {cta.buttonLabel}
              </Link>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
