"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GET_GLOBAL_HEADER } from "@/lib/queries";

interface NavLink {
  label?: string;
  href?: string;
}

interface GlobalHeader {
  siteName?: string;
  headerCtaText?: string;
  headerCtaLink?: string;
  siteLogo?: {
    url: string;
    alternativeText?: string;
  };
  nav?: {
    navLink?: NavLink[];
  };
}

interface GlobalHeaderResponse {
  global?: GlobalHeader | null;
}

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

function getMediaUrl(url: string) {
  return url.startsWith("http") ? url : `${strapiUrl}${url}`;
}

function isActiveLink(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { data } = useQuery<GlobalHeaderResponse>(GET_GLOBAL_HEADER);

  const global = data?.global;
  const siteName = global?.siteName || "Blog";
  const headerCtaText = global?.headerCtaText;
  const headerCtaLink = global?.headerCtaLink;
  const navLinks = (global?.nav?.navLink || []).filter(
    (link): link is Required<NavLink> => Boolean(link.label && link.href)
  );
  const hasCta = Boolean(headerCtaText && headerCtaLink);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur dark:border-gray-800 dark:bg-black/95">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3 font-bold text-gray-950 dark:text-gray-50"
          onClick={() => setMenuOpen(false)}
        >
          {global?.siteLogo?.url ? (
            <Image
              src={getMediaUrl(global.siteLogo.url)}
              alt={global.siteLogo.alternativeText || siteName}
              width={140}
              height={40}
              className="h-9 w-auto object-contain"
              priority
            />
          ) : (
            <span className="truncate text-lg">{siteName}</span>
          )}
        </Link>

        {navLinks.length > 0 && (
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const active = isActiveLink(pathname, link.href);

              return (
                <Link
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-gray-100 text-gray-950 dark:bg-gray-900 dark:text-gray-50"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-950 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        )}

        <div className="hidden items-center gap-3 md:flex">
          {hasCta && (
            <Link
              href={headerCtaLink || "/"}
              className="inline-flex rounded-md bg-gray-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-gray-50 dark:text-gray-950 dark:hover:bg-gray-200"
            >
              {headerCtaText}
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((isOpen) => !isOpen)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 text-gray-800 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-900 md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span className="flex flex-col gap-1.5" aria-hidden="true">
            <span className="h-0.5 w-5 bg-current" />
            <span className="h-0.5 w-5 bg-current" />
            <span className="h-0.5 w-5 bg-current" />
          </span>
        </button>
      </div>

      {menuOpen && (
        <div className="absolute left-0 right-0 top-16 border-t border-gray-200 bg-white px-4 py-4 shadow-lg dark:border-gray-800 dark:bg-black md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1">
            {navLinks.map((link) => {
              const active = isActiveLink(pathname, link.href);

              return (
                <Link
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-md px-3 py-2 text-base font-medium transition ${
                    active
                      ? "bg-gray-100 text-gray-950 dark:bg-gray-900 dark:text-gray-50"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-950 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {hasCta && (
              <Link
                href={headerCtaLink || "/"}
                onClick={() => setMenuOpen(false)}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-gray-50 dark:text-gray-950 dark:hover:bg-gray-200"
              >
                {headerCtaText}
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
