"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import Animation from "./Animation";
import testimonials from "@/lib/customerTestimonials";

const customerPhotos = [
    "photo-1600607687939-ce8a6c25118c",
    "photo-1600566753086-00f18fb6b3ea",
    "photo-1600210492486-724fe5c67fb0",
    "photo-1600607687644-c7171b42498f",
    "photo-1600566753190-17f0baa2a6c3",
    "photo-1600607687920-4e2a09cf159d",
    "photo-1529156069898-49953e39b3ac",
    "photo-1511632765486-a01980e01a18",
    "photo-1511895426328-dc8714191300",
    "photo-1511988617509-a57c8a288659",
    "photo-1527529482837-4698179dc6ce",
    "photo-1529636798458-92182e662485",
    "photo-1506869640319-fe1a24fd76dc",
    "photo-1523438885200-e635ba2c371e",
    "photo-1519671482749-fd09be7ccebf",
    "photo-1520857014576-2c4f4c972b57",
    "photo-1528605248644-14dd04022da1",
    "photo-1531058020387-3be344556be6",
].map((photoId, index) => ({
    id: `customer-photo-${index + 1}`,
    src: `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=1000&q=80`,
    alt: `Customer community moment ${index + 1}`,
}));

const pageSize = 9;

function getEmbedUrl(testimonial) {
    const videoId = new URL(testimonial.youtubeUrl).pathname.slice(1);
    const embedUrl = new URL(`https://www.youtube-nocookie.com/embed/${videoId}`);
    embedUrl.search = new URLSearchParams({
        rel: "0",
        modestbranding: "1",
        autoplay: "0",
        loop: "0",
        mute: "1",
        controls: testimonial.controls ? "1" : "0",
    }).toString();

    return embedUrl.toString();
}

export default function CustomersPage() {
    const [activeType, setActiveType] = useState("Photos");
    const [page, setPage] = useState(1);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const items = activeType === "Photos" ? customerPhotos : testimonials;
    const pageCount = Math.ceil(items.length / pageSize);
    const visibleItems = items.slice((page - 1) * pageSize, page * pageSize);

    useEffect(() => {
        if (!selectedPhoto) return undefined;

        const closeOnEscape = (event) => {
            if (event.key === "Escape") setSelectedPhoto(null);
        };

        window.addEventListener("keydown", closeOnEscape);
        return () => window.removeEventListener("keydown", closeOnEscape);
    }, [selectedPhoto]);

    const selectType = (type) => {
        setActiveType(type);
        setPage(1);
    };

    return (
        <>
            <Navbar />
            <Animation as="main" className="min-h-screen bg-white pt-[74px]">
                <div className="px-5 pb-16 pt-7 sm:px-6 md:px-10 md:pt-8">
                    <div className="mx-auto max-w-[1440px]">
                        <nav
                            aria-label="Breadcrumb"
                            className="mb-10 flex items-center gap-2 text-sm text-[#6f7880] md:mb-12"
                        >
                            <Link href="/" className="transition-colors hover:text-[#b57f12]">
                                Home
                            </Link>
                            <span aria-hidden="true">››</span>
                            <span aria-current="page" className="font-medium text-[#17304f]">
                                Our Happy Customers
                            </span>
                        </nav>

                        <h1 className="text-center font-serif text-3xl font-semibold uppercase tracking-[0.1em] text-[#b57f12] sm:text-4xl">
                            Our Happy Customers
                        </h1>

                        <div
                            role="tablist"
                            aria-label="Customer gallery type"
                            className="mx-auto my-10 flex h-[60px] w-[min(100%,380px)] overflow-hidden rounded-full bg-[#111518] p-1 shadow-[0_4px_14px_rgba(0,0,0,0.24)] sm:my-11"
                        >
                            {["Photos", "Videos"].map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    role="tab"
                                    aria-selected={activeType === type}
                                    onClick={() => selectType(type)}
                                    className={`w-1/2 rounded-full text-sm font-semibold transition-colors sm:text-lg ${
                                        activeType === type
                                            ? "bg-[#b57f12] text-white"
                                            : "text-white hover:bg-white/10"
                                    }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>

                        <section
                            role="tabpanel"
                            aria-label={`Customer ${activeType.toLowerCase()}`}
                            className="min-h-[300px]"
                        >
                            {activeType === "Photos" ? (
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8">
                                    {visibleItems.map((photo) => (
                                        <button
                                            key={photo.id}
                                            type="button"
                                            onClick={() => setSelectedPhoto(photo)}
                                            aria-label={`View ${photo.alt}`}
                                            className="group relative block aspect-[1.42/1] w-full overflow-hidden bg-[#e8e6e1] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b57f12]"
                                        >
                                            <Image
                                                src={photo.src}
                                                alt={photo.alt}
                                                fill
                                                unoptimized
                                                sizes="(max-width: 640px) 100vw, 50vw"
                                                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                            />
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8">
                                    {visibleItems.map((testimonial) => (
                                        <article
                                            key={testimonial.id}
                                            className="overflow-hidden bg-[#111518]"
                                        >
                                            <div className="relative aspect-video">
                                                <iframe
                                                    className="absolute inset-0 h-full w-full"
                                                    src={getEmbedUrl(testimonial)}
                                                    title={testimonial.title}
                                                    loading="lazy"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                    referrerPolicy="strict-origin-when-cross-origin"
                                                    allowFullScreen
                                                />
                                            </div>
                                            <div className="p-4 text-white">
                                                <h2 className="font-serif text-lg font-semibold">
                                                    {testimonial.title}
                                                </h2>
                                                <p className="mt-2 line-clamp-2 text-sm text-white/75">
                                                    {testimonial.description}
                                                </p>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </section>

                        {pageCount > 1 && (
                            <nav
                                aria-label="Customer gallery pages"
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
                </div>
            </Animation>
            <Footer />

            {selectedPhoto && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={selectedPhoto.alt}
                    className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 p-5"
                >
                    <button
                        type="button"
                        aria-label="Close photo viewer"
                        onClick={() => setSelectedPhoto(null)}
                        className="absolute inset-0"
                    />
                    <button
                        type="button"
                        aria-label="Close photo"
                        onClick={() => setSelectedPhoto(null)}
                        className="absolute right-5 top-5 z-20 text-4xl leading-none text-white"
                    >
                        ×
                    </button>
                    <Image
                        src={selectedPhoto.src}
                        alt={selectedPhoto.alt}
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
