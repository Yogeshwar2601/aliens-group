"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getConstructionGallery } from "@/lib/constructionUpdateService";

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
const pageSize = 9;

export default function ConstructionGallery({ projectSlug, projectName }) {
    const [mediaType, setMediaType] = useState("photo");
    const [year, setYear] = useState("");
    const [month, setMonth] = useState("");
    const [page, setPage] = useState(1);
    const [years, setYears] = useState([]);
    const [media, setMedia] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedMedia, setSelectedMedia] = useState(null);
    const pageCount = Math.ceil(total / pageSize);

    useEffect(() => {
        const controller = new AbortController();

        async function loadGallery() {
            setLoading(true);
            setError("");

            try {
                const result = await getConstructionGallery(
                    {
                        projectSlug,
                        mediaType,
                        ...(year ? { year } : {}),
                        ...(month ? { month } : {}),
                        limit: pageSize,
                        offset: (page - 1) * pageSize,
                    },
                    { signal: controller.signal }
                );

                if (!controller.signal.aborted) {
                    setMedia(result.data);
                    setTotal(result.total);
                    setYears(result.years);
                }
            } catch (fetchError) {
                if (controller.signal.aborted) return;

                console.error("Failed to load construction gallery:", fetchError);
                setError("Unable to load construction updates. Please try again.");
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        loadGallery();
        return () => controller.abort();
    }, [projectSlug, mediaType, year, month, page]);

    useEffect(() => {
        if (!selectedMedia) return undefined;
        const closeOnEscape = (event) => {
            if (event.key === "Escape") setSelectedMedia(null);
        };
        window.addEventListener("keydown", closeOnEscape);
        return () => window.removeEventListener("keydown", closeOnEscape);
    }, [selectedMedia]);

    const changeMediaType = (nextType) => {
        setMediaType(nextType);
        setPage(1);
    };

    const changeYear = (event) => {
        setYear(event.target.value);
        setPage(1);
    };

    const changeMonth = (event) => {
        setMonth(event.target.value);
        setPage(1);
    };

    return (
        <>
            <main className="min-h-screen bg-white px-5 pb-20 pt-28 text-[#17304f] sm:px-6 md:px-10 md:pt-36">
                <div className="mx-auto max-w-[1440px]">
                    <nav
                        aria-label="Breadcrumb"
                        className="mb-10 flex flex-wrap items-center gap-2 text-sm text-[#6f7880]"
                    >
                        <Link href="/" className="transition-colors hover:text-[#b57f12]">
                            Home
                        </Link>
                        <span aria-hidden="true">››</span>
                        <Link
                            href="/construction"
                            className="transition-colors hover:text-[#b57f12]"
                        >
                            Construction Updates
                        </Link>
                        <span aria-hidden="true">››</span>
                        <span aria-current="page">{projectName}</span>
                    </nav>

                    <h1 className="text-center font-serif text-3xl font-semibold uppercase tracking-[0.08em] text-[#b57f12] sm:text-4xl">
                        Construction Updates
                    </h1>

                    <div
                        role="tablist"
                        aria-label="Construction update media type"
                        className="mx-auto my-8 flex h-[60px] w-[min(100%,380px)] overflow-hidden rounded-full bg-[#111518] p-1 shadow-[0_4px_14px_rgba(0,0,0,0.24)]"
                    >
                        {[
                            ["photo", "Photos"],
                            ["video", "Videos"],
                        ].map(([value, label]) => (
                            <button
                                key={value}
                                type="button"
                                role="tab"
                                aria-selected={mediaType === value}
                                onClick={() => changeMediaType(value)}
                                className={`w-1/2 rounded-full text-sm font-semibold transition-colors sm:text-lg ${
                                    mediaType === value
                                        ? "bg-[#b57f12] text-white"
                                        : "text-white hover:bg-white/10"
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    <div className="mb-7 flex flex-wrap justify-center gap-3">
                        <label className="sr-only" htmlFor="construction-year">
                            Filter by year
                        </label>
                        <select
                            id="construction-year"
                            value={year}
                            onChange={changeYear}
                            className="min-w-40 border border-gray-300 bg-white px-4 py-3 text-sm text-[#17304f] outline-none focus:border-[#b57f12]"
                        >
                            <option value="">All Years</option>
                            {years.map((availableYear) => (
                                <option key={availableYear} value={availableYear}>
                                    {availableYear}
                                </option>
                            ))}
                        </select>
                        <label className="sr-only" htmlFor="construction-month">
                            Filter by month
                        </label>
                        <select
                            id="construction-month"
                            value={month}
                            onChange={changeMonth}
                            className="min-w-40 border border-gray-300 bg-white px-4 py-3 text-sm text-[#17304f] outline-none focus:border-[#b57f12]"
                        >
                            <option value="">All Months</option>
                            {months.map((name, index) => (
                                <option key={name} value={index + 1}>
                                    {name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {error ? (
                        <p role="alert" className="py-16 text-center text-red-700">
                            {error}
                        </p>
                    ) : loading ? (
                        <p role="status" className="py-16 text-center text-[#69737c]">
                            Loading construction updates...
                        </p>
                    ) : media.length === 0 ? (
                        <p className="py-16 text-center text-[#69737c]">
                            No {mediaType === "photo" ? "photos" : "videos"} are available
                            for {projectName} yet.
                        </p>
                    ) : (
                        <>
                            {media.some((item) =>
                                item.milestone?.startsWith("Illustrative stock")
                            ) && (
                                <p className="mb-5 border-l-2 border-[#b57f12] bg-[#faf8f2] px-4 py-3 text-sm leading-6 text-[#69737c]">
                                    Illustrative licensed stock media for preview only; it does
                                    not depict Aliens Group sites or actual construction progress.
                                    Sources:{" "}
                                    <a
                                        href="https://www.pexels.com/license/"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="font-medium text-[#9a6c0e] underline"
                                    >
                                        Pexels license
                                    </a>
                                    .
                                </p>
                            )}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8">
                                {media.map((item, index) => (
                                    <article
                                        key={`${item.id}-${index}-${item.mediaUrl}`}
                                        className="group relative aspect-[1.42/1] overflow-hidden bg-[#e8e6e1]"
                                    >
                                        {item.mediaType === "video" ? (
                                            <video
                                                src={item.mediaUrl}
                                                controls
                                                preload="metadata"
                                                className="h-full w-full object-cover"
                                                aria-label={`${projectName} construction update video`}
                                            />
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => setSelectedMedia(item)}
                                                aria-label={`View ${projectName} construction update photo ${index + 1}`}
                                                className="absolute inset-0 h-full w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#b57f12]"
                                            >
                                                <Image
                                                    src={item.mediaUrl}
                                                    alt={`${projectName} construction update`}
                                                    fill
                                                    unoptimized
                                                    sizes="(max-width: 640px) 100vw, 50vw"
                                                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                                />
                                            </button>
                                        )}
                                    </article>
                                ))}
                            </div>
                        </>
                    )}

                    {!loading && !error && pageCount > 1 && (
                        <nav
                            aria-label="Construction update pages"
                            className="mt-10 flex flex-wrap items-center justify-center gap-2"
                        >
                            <button
                                type="button"
                                onClick={() => setPage((current) => Math.max(1, current - 1))}
                                disabled={page === 1}
                                className="rounded bg-gray-200 px-3 py-2 text-sm transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Prev
                            </button>
                            {Array.from({ length: pageCount }, (_, index) => index + 1).map(
                                (pageNumber) => (
                                    <button
                                        key={pageNumber}
                                        type="button"
                                        aria-current={page === pageNumber ? "page" : undefined}
                                        onClick={() => setPage(pageNumber)}
                                        className={`min-w-10 rounded px-3 py-2 text-sm transition-colors ${
                                            page === pageNumber
                                                ? "bg-[#b57f12] text-white"
                                                : "bg-gray-100 text-[#17304f] hover:bg-gray-200"
                                        }`}
                                    >
                                        {pageNumber}
                                    </button>
                                )
                            )}
                            <button
                                type="button"
                                onClick={() =>
                                    setPage((current) => Math.min(pageCount, current + 1))
                                }
                                disabled={page === pageCount}
                                className="rounded bg-gray-200 px-3 py-2 text-sm transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Next
                            </button>
                        </nav>
                    )}
                </div>
            </main>

            {selectedMedia && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={`${projectName} construction photo`}
                    className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 p-5"
                >
                    <button
                        type="button"
                        aria-label="Close photo viewer"
                        onClick={() => setSelectedMedia(null)}
                        className="absolute inset-0"
                    />
                    <button
                        type="button"
                        aria-label="Close photo"
                        onClick={() => setSelectedMedia(null)}
                        className="absolute right-5 top-5 z-20 text-4xl leading-none text-white"
                    >
                        ×
                    </button>
                    <Image
                        src={selectedMedia.mediaUrl}
                        alt={`${projectName} construction update`}
                        width={1600}
                        height={1200}
                        unoptimized
                        className="pointer-events-none relative z-10 max-h-[90vh] w-auto max-w-full object-contain"
                    />
                </div>
            )}
        </>
    );
}
