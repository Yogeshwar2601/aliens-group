"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import { getProjectBySlug } from "@/lib/projectService";

const sections = [
    ["overview", "Overview"],
    ["growth-axis", "Growth Axis"],
    ["villa-concept", "Villas"],
    ["master-plan", "Master Plan"],
    ["amenities", "Amenities"],
    ["location", "Location"],
    ["gallery", "Gallery"],
];

export default function AliensHubOverview() {
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        async function fetchHubProject() {
            try {
                const data = await getProjectBySlug("aliens-hub");

                if (active) {
                    setProject(data);
                }
            } catch (fetchError) {
                if (active) {
                    console.error("Failed to fetch Aliens HUB details:", fetchError);
                    setError(
                        fetchError.response?.status === 404
                            ? "Aliens HUB details are not available."
                            : "Unable to load Aliens HUB details. Please try again later."
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        fetchHubProject();

        return () => {
            active = false;
        };
    }, []);

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-[#f7f5f0] pb-20 text-[#17304f]">
                <div className="px-6 pt-32 md:px-10 md:pt-36 lg:px-16">
                    <div className="mx-auto max-w-[1320px]">
                        <nav
                            aria-label="Breadcrumb"
                            className="mb-7 flex items-center gap-3 text-sm text-[#6f7880]"
                        >
                            <Link href="/" className="transition-colors hover:text-[#b57f12]">
                                Home
                            </Link>
                            <span aria-hidden="true">››</span>
                            <span aria-current="page">Aliens HUB</span>
                        </nav>

                        <nav
                            aria-label="Aliens HUB sections"
                            className="hide-scrollbar mb-7 flex gap-7 overflow-x-auto border-b border-[#17304f]/15 pb-4 text-sm"
                        >
                            {sections.map(([id, title]) => (
                                <a
                                    key={id}
                                    href={`#${id}`}
                                    className="shrink-0 transition-colors hover:text-[#9a6c0e]"
                                >
                                    {title}
                                </a>
                            ))}
                            <Link
                                href="/contact"
                                className="ml-auto shrink-0 font-semibold text-[#9a6c0e]"
                            >
                                Enquire
                            </Link>
                        </nav>

                        {loading ? (
                            <p role="status" className="py-16 text-center text-[#69737c]">
                                Loading Aliens HUB...
                            </p>
                        ) : error ? (
                            <p role="alert" className="py-16 text-center text-red-700">
                                {error}
                            </p>
                        ) : (
                            <>
                                <section
                                id="overview"
                                className="scroll-mt-32 overflow-hidden bg-[#17304f] text-white"
                            >
                                <div className="grid min-h-[470px] lg:grid-cols-[1.08fr_0.92fr]">
                                    <div className="relative min-h-[300px]">
                                        {project.image && (
                                            <Image
                                                src={project.image}
                                                alt="Illustrative Aliens HUB landscape"
                                                fill
                                                priority
                                                unoptimized
                                                sizes="(max-width: 1024px) 100vw, 55vw"
                                                className="object-cover"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#10243a]/70 via-transparent to-transparent" />
                                        <span className="absolute bottom-5 left-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/85">
                                            Illustrative stock imagery
                                        </span>
                                    </div>
                                    <div className="flex flex-col justify-center px-7 py-10 sm:px-12 lg:px-14">
                                        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#d4b463]">
                                            {project.location}
                                        </p>
                                        <h1 className="font-serif text-4xl font-semibold leading-tight sm:text-5xl">
                                            Aliens HUB
                                        </h1>
                                        <p className="mt-6 max-w-xl text-sm leading-7 text-white/75 sm:text-base">
                                            {project.description}
                                        </p>
                                        <p className="mt-3 text-xs leading-5 text-white/60">
                                            Illustrative stock images are used for visual reference;
                                            they are not actual Aliens HUB project photography.
                                        </p>
                                        <div className="mt-8 flex flex-wrap gap-4">
                                            <a
                                                href="#master-plan"
                                                className="bg-[#b68a35] px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#9a6c0e]"
                                            >
                                                Explore the township
                                            </a>
                                            <Link
                                                href="/contact"
                                                className="border border-white/50 px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:border-white"
                                            >
                                                Enquire now
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section
                                aria-label="Aliens HUB highlights"
                                className="grid grid-cols-2 border-x border-b border-[#17304f]/10 bg-white sm:grid-cols-3 lg:grid-cols-4"
                            >
                                {(project.highlights || []).map((highlight, index) => (
                                    <div
                                        key={`${highlight.label}-${index}`}
                                        className="border-b border-r border-[#17304f]/10 p-5 sm:p-6"
                                    >
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8b9298]">
                                            {highlight.label}
                                        </p>
                                        <p className="mt-2 font-serif text-lg font-semibold sm:text-xl">
                                            {highlight.value}
                                        </p>
                                    </div>
                                ))}
                            </section>

                            <div className="mx-auto max-w-[1120px] px-6 md:px-10">
                                <section
                                    id="growth-axis"
                                    className="scroll-mt-32 border-b border-[#17304f]/15 py-14 md:py-16"
                                >
                                    <SectionHeading
                                        eyebrow="The growth axis: Srisailam"
                                        title="Connected to a growing region"
                                    />
                                    <DataGrid
                                        items={project.growthAxis || []}
                                        getKey={(item) => item.name}
                                        getTitle={(item) => item.name}
                                        getDetail={(item) => item.distance}
                                    />
                                </section>

                                <section
                                    id="villa-concept"
                                    className="scroll-mt-32 border-b border-[#17304f]/15 py-14 md:py-16"
                                >
                                    <div className="grid gap-8 md:grid-cols-2 md:items-center">
                                        <div>
                                            <SectionHeading
                                                eyebrow="Villa and layout concept"
                                                title="Villas crafted along the contour"
                                            />
                                            <p className="mt-5 text-sm leading-7 text-[#69737c]">
                                                {project.communityType}. Explore a plotted township
                                                planned around hillside views, privacy, and the
                                                surrounding landscape.
                                            </p>
                                            <a
                                                href="#master-plan"
                                                className="mt-7 inline-flex border-b border-[#b57f12] pb-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#9a6c0e]"
                                            >
                                                Explore the layouts
                                            </a>
                                        </div>
                                        {project.gallery?.[0] && (
                                            <div className="relative aspect-[4/3] overflow-hidden bg-[#e8e6df]">
                                                <Image
                                                    src={project.gallery[0]}
                                                    alt="Illustrative hillside villa setting"
                                                    fill
                                                    unoptimized
                                                    sizes="(max-width: 768px) 100vw, 50vw"
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </section>

                                <section
                                    id="master-plan"
                                    className="scroll-mt-32 border-b border-[#17304f]/15 py-14 md:py-16"
                                >
                                    <SectionHeading
                                        eyebrow="Master plan"
                                        title="Six distinct plotted communities"
                                    />
                                    <p className="mt-4 text-sm leading-6 text-[#69737c]">
                                        {project.areaRange} across a collection of individual layouts.
                                        Layout names are shown here; detailed plan drawings can be
                                        added when available.
                                    </p>
                                    <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                        {(project.layouts || []).map((layout, index) => (
                                            <li
                                                key={layout}
                                                className="flex items-center gap-4 border border-[#17304f]/10 bg-white p-5"
                                            >
                                                <span className="font-serif text-xl text-[#b57f12]">
                                                    0{index + 1}
                                                </span>
                                                <span className="font-medium">{layout}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </section>

                                <section
                                    id="amenities"
                                    className="scroll-mt-32 border-b border-[#17304f]/15 py-14 md:py-16"
                                >
                                    <SectionHeading
                                        eyebrow="Amenities"
                                        title="Experiences inspired by nature"
                                    />
                                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                                        {(project.amenityDetails || []).map((amenity, index) => (
                                            <article
                                                key={amenity.name}
                                                className="border border-[#17304f]/10 bg-white p-6 sm:p-7"
                                            >
                                                <span className="text-xs font-semibold tracking-[0.14em] text-[#b57f12]">
                                                    0{index + 1}
                                                </span>
                                                <h3 className="mt-4 font-serif text-xl font-semibold">
                                                    {amenity.name}
                                                </h3>
                                                <p className="mt-3 text-sm leading-6 text-[#69737c]">
                                                    {amenity.description}
                                                </p>
                                            </article>
                                        ))}
                                    </div>
                                </section>

                                <section
                                    id="location"
                                    className="scroll-mt-32 border-b border-[#17304f]/15 py-14 md:py-16"
                                >
                                    <SectionHeading
                                        eyebrow="Srisailam Highway, Hyderabad"
                                        title="Seamless connectivity"
                                    />
                                    <p className="mt-4 text-sm text-[#69737c]">
                                        {project.location}
                                    </p>
                                    <DataGrid
                                        items={project.nearbyPlaces || []}
                                        getKey={(item) => item.name}
                                        getTitle={(item) => item.name}
                                        getDetail={(item) => item.distance}
                                    />
                                    {project.mapUrl && (
                                        <a
                                            href={project.mapUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-7 inline-flex border-b border-[#b57f12] pb-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#9a6c0e]"
                                        >
                                            View on map <span className="ml-2">↗</span>
                                        </a>
                                    )}
                                </section>

                                <section
                                    id="gallery"
                                    className="scroll-mt-32 py-14 md:py-16"
                                >
                                    <SectionHeading
                                        eyebrow="Gallery"
                                        title="A glimpse of hill-country living"
                                    />
                                    <p className="mt-4 text-xs leading-5 text-[#8b9298]">
                                        Illustrative stock imagery for visual reference; these are
                                        not photographs or master-plan images of Aliens HUB.
                                    </p>
                                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {(project.gallery || []).map((image, index) => (
                                            <div
                                                key={image}
                                                className="relative aspect-[4/3] overflow-hidden bg-[#e8e6df]"
                                            >
                                                <Image
                                                    src={image}
                                                    alt={`Illustrative Aliens HUB landscape ${index + 1}`}
                                                    fill
                                                    unoptimized
                                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                    className="object-cover transition-transform duration-700 hover:scale-105"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </section>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

function DataGrid({ items, getKey, getTitle, getDetail }) {
    return (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
                <li
                    key={`${getKey(item)}-${index}`}
                    className="border border-[#17304f]/10 bg-white p-5"
                >
                    <h3 className="font-serif text-lg font-semibold">{getTitle(item)}</h3>
                    {getDetail(item) && (
                        <p className="mt-2 text-sm text-[#69737c]">{getDetail(item)}</p>
                    )}
                </li>
            ))}
        </ul>
    );
}

function SectionHeading({ eyebrow, title }) {
    return (
        <>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#b57f12]">
                {eyebrow}
            </p>
            <h2 className="font-serif text-2xl font-semibold sm:text-3xl">{title}</h2>
        </>
    );
}
