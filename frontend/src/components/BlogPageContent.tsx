"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { useRouter, useSearchParams } from "next/navigation";
import { BlogPostCard } from "./BlogPostCard";
import { GET_CATEGORIES, GET_POSTS } from "@/lib/queries";

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

interface Category {
  documentId: string;
  name: string;
  slug: string;
}

interface PostsResponse {
  posts: Post[];
}

interface CategoriesResponse {
  categories: Category[];
}

const pageSize = 6;

export function BlogPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(true);
  const page = Math.max(Number(searchParams.get("page") || "1") || 1, 1);
  const search = searchParams.get("search") || "";
  const categorySlug = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "publishedAt:desc";

  function updateUrl(updates: Record<string, string | number | null>) {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "1" || value === "publishedAt:desc") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    const queryString = params.toString();
    router.push(queryString ? `/blog?${queryString}` : "/blog", {
      scroll: false,
    });
  }

  const filters = useMemo(() => {
    const trimmedSearch = search.trim();
    const nextFilters: Record<string, unknown> = {
      publishedAt: {
        notNull: true,
      },
    };

    if (categorySlug) {
      nextFilters.category = {
        slug: {
          eq: categorySlug,
        },
      };
    }

    if (trimmedSearch) {
      nextFilters.or = [
        {
          title: {
            containsi: trimmedSearch,
          },
        },
        {
          excerpt: {
            containsi: trimmedSearch,
          },
        },
      ];
    }

    return nextFilters;
  }, [categorySlug, search]);

  const {
    loading: postsLoading,
    error: postsError,
    data: postsData,
  } = useQuery<PostsResponse>(GET_POSTS, {
    variables: {
      filters,
      pagination: {
        page,
        pageSize: pageSize + 1,
      },
      sort: [sort],
    },
  });

  const { data: categoriesData } = useQuery<CategoriesResponse>(GET_CATEGORIES, {
    variables: {
      sort: ["name:asc"],
    },
  });

  const fetchedPosts = postsData?.posts || [];
  const posts = fetchedPosts.slice(0, pageSize);
  const hasNextPage = fetchedPosts.length > pageSize;
  const hasActiveFilters = Boolean(search.trim() || categorySlug);

  function resetPageAndSetSearch(value: string) {
    updateUrl({ search: value.trim(), page: null });
  }

  function resetPageAndSetCategory(value: string) {
    updateUrl({ category: value, page: null });
  }

  function resetPageAndSetSort(value: string) {
    updateUrl({ sort: value, page: null });
  }

  function clearFilters() {
    router.push("/blog", { scroll: false });
  }

  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <header className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-950 dark:text-gray-50 sm:text-5xl">
            All blog posts
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-400">
            Browse every article, narrow the list by category, and search by
            title or excerpt.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 border-b border-gray-200 pb-6 dark:border-gray-800">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-950 dark:text-gray-50">
                Posts
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Page {page}
                {hasActiveFilters ? " with filters applied" : ""}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setFiltersOpen((isOpen) => !isOpen)}
              className="inline-flex w-fit items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-900"
            >
              {filtersOpen ? "Hide filters" : "Show filters"}
            </button>
          </div>

          {filtersOpen && (
            <div className="mt-6 grid gap-4 md:grid-cols-[1fr_220px_220px_auto] md:items-end">
              <label className="block">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Search
                </span>
                <input
                  type="search"
                  value={search}
                  onChange={(event) => resetPageAndSetSearch(event.target.value)}
                  placeholder="Search posts"
                  className="mt-2 h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-gray-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-50 dark:focus:ring-blue-950"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Category
                </span>
                <select
                  value={categorySlug}
                  onChange={(event) =>
                    resetPageAndSetCategory(event.target.value)
                  }
                  className="mt-2 h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-gray-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-50 dark:focus:ring-blue-950"
                >
                  <option value="">All categories</option>
                  {(categoriesData?.categories || []).map((category) => (
                    <option key={category.documentId} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sort
                </span>
                <select
                  value={sort}
                  onChange={(event) => resetPageAndSetSort(event.target.value)}
                  className="mt-2 h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-gray-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-50 dark:focus:ring-blue-950"
                >
                  <option value="publishedAt:desc">Newest first</option>
                  <option value="publishedAt:asc">Oldest first</option>
                  <option value="title:asc">Title A-Z</option>
                  <option value="title:desc">Title Z-A</option>
                </select>
              </label>

              <button
                type="button"
                onClick={clearFilters}
                disabled={!hasActiveFilters && sort === "publishedAt:desc"}
                className="inline-flex h-11 items-center justify-center rounded-md border border-gray-300 px-4 text-sm font-medium text-gray-800 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-900"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {postsLoading && (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading posts...</p>
          </div>
        )}

        {postsError && (
          <div className="flex items-center justify-center py-12">
            <p className="text-red-600 dark:text-red-400">
              Error loading posts
            </p>
          </div>
        )}

        {!postsLoading && !postsError && posts.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              No posts match these filters.
            </p>
          </div>
        )}

        {!postsLoading && !postsError && posts.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogPostCard key={post.documentId} post={post} />
              ))}
            </div>

            <nav className="mt-10 flex items-center justify-between border-t border-gray-200 pt-6 dark:border-gray-800">
              <button
                type="button"
                onClick={() => updateUrl({ page: page - 1 })}
                disabled={page === 1 || postsLoading}
                className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-900"
              >
                Previous
              </button>

              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Page {page}
              </span>

              <button
                type="button"
                onClick={() => updateUrl({ page: page + 1 })}
                disabled={!hasNextPage || postsLoading}
                className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-900"
              >
                Next
              </button>
            </nav>
          </>
        )}
      </section>
    </main>
  );
}
