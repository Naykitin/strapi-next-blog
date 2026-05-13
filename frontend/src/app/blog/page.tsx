import { Suspense } from "react";
import { BlogPageContent } from "@/components/BlogPageContent";

export default function BlogPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-white px-4 dark:bg-black">
          <p className="text-gray-600 dark:text-gray-400">Loading blog...</p>
        </main>
      }
    >
      <BlogPageContent />
    </Suspense>
  );
}
