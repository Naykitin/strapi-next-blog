import { BlogPostsList } from "@/components/BlogPostsList";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 w-full flex-col items-center bg-white dark:bg-black">
      {/* Header */}
      <header className="w-full border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-50">
            Blog
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Discover our latest articles and insights
          </p>
          <Link
            href="/blog"
            className="mt-6 inline-flex rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-900"
          >
            View all posts
          </Link>
        </div>
      </header>

      {/* Blog Posts */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <BlogPostsList />
      </section>
    </main>
  );
}
