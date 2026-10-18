"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { getBlogBySlug } from "@/lib/blogService";

export default function BlogArticlePage({ slug }) {
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        async function fetchBlog() {
            setLoading(true);
            setError("");

            try {
                const result = await getBlogBySlug(slug, {
                    signal: controller.signal,
                });
                setBlog(result);
            } catch (fetchError) {
                if (controller.signal.aborted) return;

                if (fetchError.response?.status === 404) {
                    setError("This blog could not be found.");
                } else {
                    console.error("Failed to fetch blog:", fetchError);
                    setError("Unable to load this blog. Please try again.");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        fetchBlog();
        return () => controller.abort();
    }, [slug]);

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-white px-6 pb-20 pt-32 text-[#17304f] md:px-10 md:pt-40">
                <div className="mx-auto max-w-[900px]">
                    <nav
                        aria-label="Breadcrumb"
                        className="mb-10 flex items-center gap-3 text-sm text-[#315b82]"
                    >
                        <Link href="/" className="hover:text-black">
                            Home
                        </Link>
                        <span aria-hidden="true">»</span>
                        <Link href="/blog" className="hover:text-black">
                            Blogs
                        </Link>
                        {blog && (
                            <>
                                <span aria-hidden="true">»</span>
                                <span aria-current="page" className="truncate text-black">
                                    {blog.title}
                                </span>
                            </>
                        )}
                    </nav>

                    {loading ? (
                        <p role="status" className="py-20 text-center text-gray-500">
                            Loading blog...
                        </p>
                    ) : error ? (
                        <div className="py-20 text-center">
                            <p role="alert" className="text-red-700">
                                {error}
                            </p>
                            <Link
                                href="/blog"
                                className="mt-5 inline-block border-b border-[#bd7d00] pb-1 text-sm text-[#8d5e00]"
                            >
                                Back to blogs
                            </Link>
                        </div>
                    ) : blog ? (
                        <article>
                            <header className="mb-8">
                                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#9a6c0e]">
                                    {blog.category || "Insights"}
                                </p>
                                <h1 className="font-serif text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
                                    {blog.title}
                                </h1>
                                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
                                    {blog.author && <span>By {blog.author}</span>}
                                    {blog.publishedAt && (
                                        <time dateTime={blog.publishedAt}>
                                            {new Intl.DateTimeFormat("en-IN", {
                                                day: "2-digit",
                                                month: "long",
                                                year: "numeric",
                                            }).format(new Date(blog.publishedAt))}
                                        </time>
                                    )}
                                </div>
                            </header>

                            {blog.coverImage && (
                                <div className="relative mb-10 aspect-[16/9] max-h-[520px] w-full bg-gray-100">
                                    <Image
                                        src={blog.coverImage}
                                        alt=""
                                        fill
                                        priority
                                        unoptimized
                                        sizes="(max-width: 900px) 100vw, 900px"
                                        className="object-cover"
                                    />
                                </div>
                            )}

                            {blog.excerpt && (
                                <p className="mb-8 border-l-2 border-[#bd7d00] pl-5 text-lg leading-8 text-gray-600">
                                    {blog.excerpt}
                                </p>
                            )}

                            <div className="whitespace-pre-line text-base leading-8 text-gray-700">
                                {blog.content}
                            </div>

                            {blog.tags?.length > 0 && (
                                <ul className="mt-10 flex flex-wrap gap-2">
                                    {blog.tags.map((tag) => (
                                        <li
                                            key={tag}
                                            className="bg-[#f5f2eb] px-3 py-1 text-xs text-[#6f7880]"
                                        >
                                            {tag}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <Link
                                href="/blog"
                                className="mt-12 inline-block border-b border-[#bd7d00] pb-1 text-sm font-semibold text-[#8d5e00]"
                            >
                                ← Back to blogs
                            </Link>
                        </article>
                    ) : null}
                </div>
            </main>
            <Footer />
        </>
    );
}
