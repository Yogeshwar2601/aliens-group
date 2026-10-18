"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import Animation from "./Animation";
import { getBlogs } from "@/lib/blogService";

const pageSize = 6;

export default function BlogPage() {
    const [blogs, setBlogs] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [retry, setRetry] = useState(0);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        async function fetchBlogs() {
            setLoading(true);
            setError("");

            try {
                const result = await getBlogs(
                    {
                        limit: pageSize,
                        offset: page * pageSize,
                        ...(search ? { search } : {}),
                    },
                    { signal: controller.signal }
                );

                setBlogs(result.data);
                setHasNextPage(result.data.length === pageSize);
            } catch (fetchError) {
                if (controller.signal.aborted) return;

                console.error("Failed to fetch blogs:", fetchError);
                setError("Unable to load blogs. Please try again.");
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        fetchBlogs();

        return () => controller.abort();
    }, [page, retry, search]);

    const handleSearch = (event) => {
        event.preventDefault();
        setPage(0);
        setSearch(searchInput.trim());
    };

    return (
        <>
            <Navbar />

            <Animation
                as="main"
                className="min-h-screen bg-white pt-28 text-black"
            >
                <div className="mx-auto max-w-[1050px] px-6">
                    <nav
                        aria-label="Breadcrumb"
                        className="mb-7 flex items-center gap-3 text-[16px]"
                    >
                        <Link
                            href="/"
                            className="text-[#315b82] transition-colors hover:text-black"
                        >
                            Home
                        </Link>
                        <span aria-hidden="true" className="text-[#315b82]">
                            »
                        </span>
                        <span aria-current="page" className="font-semibold text-black">
                            Blogs
                        </span>
                    </nav>
                </div>

                <section className="px-6 pb-12 md:px-10 md:pb-16">
                    <h1 className="text-center font-serif text-4xl font-semibold text-[#bd7d00] sm:text-5xl md:text-7xl">
                        Blogs
                    </h1>

                    <form
                        onSubmit={handleSearch}
                        role="search"
                        className="mx-auto mt-8 flex max-w-[660px] flex-col gap-3 sm:mt-14 sm:flex-row sm:gap-5"
                    >
                        <label className="relative min-w-0 flex-1">
                            <span className="sr-only">Search blogs</span>
                            <span
                                aria-hidden="true"
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-500 sm:left-7 sm:text-3xl"
                            >
                                ⌕
                            </span>
                            <input
                                type="search"
                                value={searchInput}
                                onChange={(event) => setSearchInput(event.target.value)}
                                placeholder="Search by title or content..."
                                className="h-12 w-full border border-gray-300 pl-11 pr-4 text-sm outline-none placeholder:text-gray-400 focus:border-gray-500 sm:h-[52px] sm:pl-20 sm:pr-5"
                            />
                        </label>
                        <button
                            type="submit"
                            className="h-12 w-full bg-black text-sm font-medium text-white transition hover:bg-[#bd7d00] sm:h-[52px] sm:w-[140px]"
                        >
                            Search
                        </button>
                    </form>
                </section>

                <section
                    aria-label="Blog articles"
                    aria-busy={loading}
                    className="mx-auto max-w-[1500px] px-6 pb-16 md:px-10"
                >
                    {loading ? (
                        <p role="status" className="py-16 text-center text-gray-500">
                            Loading blogs...
                        </p>
                    ) : error ? (
                        <div className="py-16 text-center">
                            <p role="alert" className="text-red-700">
                                {error}
                            </p>
                            <button
                                type="button"
                                onClick={() => setRetry((attempt) => attempt + 1)}
                                className="mt-4 border-b border-[#bd7d00] pb-1 text-sm text-[#8d5e00]"
                            >
                                Try again
                            </button>
                        </div>
                    ) : blogs.length === 0 ? (
                        <p className="py-16 text-center text-gray-500">
                            {search
                                ? "No blogs match your search."
                                : "No blogs are available yet."}
                        </p>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {blogs.map((blog) => (
                                    <article
                                        key={blog.id || blog.slug}
                                        className="flex h-full flex-col overflow-hidden border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-lg"
                                    >
                                        <Link
                                            href={`/blog/${encodeURIComponent(blog.slug)}`}
                                            className="group flex h-full flex-col"
                                        >
                                            {blog.coverImage ? (
                                                <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                                                    <Image
                                                        src={blog.coverImage}
                                                        alt=""
                                                        fill
                                                        unoptimized
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                                                    />
                                                </div>
                                            ) : (
                                                <div
                                                    aria-hidden="true"
                                                    className="flex aspect-[16/10] w-full items-center justify-center bg-[#f1eee7] font-serif text-2xl text-[#bd7d00]"
                                                >
                                                    {blog.category || "Aliens Group"}
                                                </div>
                                            )}
                                            <div className="flex flex-1 flex-col p-5 sm:p-6">
                                                <div className="mb-3 flex items-center justify-between gap-3 text-xs text-gray-500">
                                                    <span className="uppercase tracking-[0.12em] text-[#9a6c0e]">
                                                        {blog.category || "Insights"}
                                                    </span>
                                                    {blog.publishedAt && (
                                                        <time dateTime={blog.publishedAt}>
                                                            {new Intl.DateTimeFormat("en-IN", {
                                                                day: "2-digit",
                                                                month: "short",
                                                                year: "numeric",
                                                            }).format(new Date(blog.publishedAt))}
                                                        </time>
                                                    )}
                                                </div>
                                                <h2 className="font-serif text-xl font-semibold leading-snug text-[#17304f] transition-colors group-hover:text-[#9a6c0e]">
                                                    {blog.title}
                                                </h2>
                                                <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                                                    {blog.excerpt || blog.content}
                                                </p>
                                                <span className="mt-auto pt-5 text-sm font-semibold text-[#9a6c0e]">
                                                    Read More <span aria-hidden="true">→</span>
                                                </span>
                                            </div>
                                        </Link>
                                    </article>
                                ))}
                            </div>

                            <nav
                                aria-label="Blog pages"
                                className="mt-12 flex items-center justify-center gap-6"
                            >
                                <button
                                    type="button"
                                    disabled={page === 0}
                                    onClick={() => setPage((currentPage) => currentPage - 1)}
                                    className="border border-gray-300 px-4 py-2 text-sm transition-colors hover:border-[#bd7d00] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Previous
                                </button>
                                <span aria-live="polite" className="text-sm text-gray-600">
                                    Page {page + 1}
                                </span>
                                <button
                                    type="button"
                                    disabled={!hasNextPage}
                                    onClick={() => setPage((currentPage) => currentPage + 1)}
                                    className="border border-gray-300 px-4 py-2 text-sm transition-colors hover:border-[#bd7d00] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Next
                                </button>
                            </nav>
                        </>
                    )}
                </section>

                <div className="fixed right-0 top-[33%] z-40 hidden flex-col sm:flex">
                    <button
                        type="button"
                        className="flex h-[158px] w-[46px] items-center justify-center bg-[#ad7300] text-white shadow-md"
                    >
                        <span
                            className="text-sm font-semibold"
                            style={{
                                writingMode: "vertical-rl",
                                transform: "rotate(180deg)",
                            }}
                        >
                            Enquire Now
                        </span>
                    </button>

                    <Link
                        href="/construction"
                        className="mt-5 flex h-[220px] w-[46px] items-center justify-center bg-gray-400 text-white shadow-md"
                    >
                        <span
                            className="text-sm font-semibold"
                            style={{
                                writingMode: "vertical-rl",
                                transform: "rotate(180deg)",
                            }}
                        >
                            Construction Updates
                        </span>
                    </Link>
                </div>
            </Animation>

            <Footer />
        </>
    );
}
