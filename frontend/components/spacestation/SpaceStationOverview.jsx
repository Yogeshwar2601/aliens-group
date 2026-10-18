"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import { getProjectBySlug } from "@/lib/projectService";

const sections = [
    ["overview", "Overview"],
    ["design", "Design"],
    ["categories", "Categories"],
    ["amenities", "Amenities"],
    ["plans", "Plans"],
    ["location", "Location"],
    ["gallery", "Gallery"],
];

export default function SpaceStationOverview() {
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        async function fetchProject() {
            try {
                const data = await getProjectBySlug("aliens-space-station");
                if (active) setProject(data);
            } catch (fetchError) {
                if (!active) return;
                console.error("Failed to fetch Space Station details:", fetchError);
                setError(
                    fetchError.response?.status === 404
                        ? "Space Station details are not available."
                        : "Unable to load Space Station details. Please try again later."
                );
            } finally {
                if (active) setLoading(false);
            }
        }

        fetchProject();
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
                            <Link
                                href="/residential"
                                className="transition-colors hover:text-[#b57f12]"
                            >
                                Residential
                            </Link>
                            <span aria-hidden="true">››</span>
                            <span aria-current="page">Space Station</span>
                        </nav>

                        <nav
                            aria-label="Space Station sections"
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
                            <p role="status" className="py-20 text-center text-[#69737c]">
                                Loading Space Station...
                            </p>
                        ) : error ? (
                            <p role="alert" className="py-20 text-center text-red-700">
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
                                                    alt={`${project.name} illustrative exterior`}
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
                                                Space Station
                                            </h1>
                                            <p className="mt-6 max-w-xl text-sm leading-7 text-white/75 sm:text-base">
                                                A high-rise residential township in Tellapur, planned
                                                around private residences, open space, and shared
                                                lifestyle amenities.
                                            </p>
                                            <div className="mt-8 flex flex-wrap gap-4">
                                                <a
                                                    href="#categories"
                                                    className="bg-[#b68a35] px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#9a6c0e]"
                                                >
                                                    Explore residences
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
                                    aria-label="Project highlights"
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
                                    <section className="py-14 md:py-20">
                                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#b57f12]">
                                            Intelligent living
                                        </p>
                                        <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
                                            Designed around the way you live
                                        </h2>
                                        <p className="mt-5 max-w-3xl text-sm leading-7 text-[#69737c] sm:text-base">
                                            {project.description}
                                        </p>
                                        <p className="mt-3 text-xs leading-5 text-[#8b9298]">
                                            Project visuals on this page are illustrative stock
                                            images, not actual Space Station photography.
                                        </p>
                                    </section>

                                    <section
                                        id="design"
                                        className="scroll-mt-32 border-t border-[#17304f]/15 py-14 md:py-16"
                                    >
                                        <SectionHeading
                                            eyebrow="The 3 pillars"
                                            title="Thoughtful details. A more private home."
                                        />
                                        <div className="mt-8 grid gap-4 md:grid-cols-3">
                                            {(project.designFeatures || []).map((feature, index) => (
                                                <article
                                                    key={feature.name}
                                                    className="border border-[#17304f]/10 bg-white p-6 sm:p-7"
                                                >
                                                    <span className="text-xs font-semibold tracking-[0.14em] text-[#b57f12]">
                                                        0{index + 1}
                                                    </span>
                                                    <h3 className="mt-4 font-serif text-xl font-semibold">
                                                        {feature.name}
                                                    </h3>
                                                    <p className="mt-3 text-sm leading-6 text-[#69737c]">
                                                        {feature.description}
                                                    </p>
                                                </article>
                                            ))}
                                        </div>
                                    </section>

                                    <section
                                        id="categories"
                                        className="scroll-mt-32 border-t border-[#17304f]/15 py-14 md:py-16"
                                    >
                                        <SectionHeading
                                            eyebrow="Categories"
                                            title="Find the space that fits"
                                        />
                                        <div className="mt-8 grid gap-4 md:grid-cols-3">
                                            {(project.unitTypes || []).map((unit) => (
                                                <article
                                                    key={unit.name}
                                                    className="flex min-h-48 flex-col justify-between border border-[#17304f]/10 bg-white p-6 sm:p-7"
                                                >
                                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8b9298]">
                                                        Residence type
                                                    </p>
                                                    <div className="mt-8">
                                                        <h3 className="font-serif text-2xl font-semibold">
                                                            {unit.name}
                                                        </h3>
                                                        <p className="mt-2 text-sm text-[#69737c]">
                                                            Area: {unit.area}
                                                        </p>
                                                    </div>
                                                </article>
                                            ))}
                                        </div>
                                    </section>

                                    <section
                                        id="amenities"
                                        className="scroll-mt-32 border-t border-[#17304f]/15 py-14 md:py-16"
                                    >
                                        <SectionHeading
                                            eyebrow="Amenities"
                                            title="Room for work, play and pause"
                                        />
                                        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                            {(project.amenityDetails || []).map((amenity) => (
                                                <article
                                                    key={amenity.name}
                                                    className="border border-[#17304f]/10 bg-white p-6"
                                                >
                                                    <h3 className="font-serif text-xl font-semibold">
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
                                        id="plans"
                                        className="scroll-mt-32 border-t border-[#17304f]/15 py-14 md:py-16"
                                    >
                                        <SectionHeading
                                            eyebrow="Floor plans"
                                            title="Spaces planned around you"
                                        />
                                        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                            {(project.layouts || []).map((layout) => (
                                                <div
                                                    key={layout}
                                                    className="border border-[#17304f]/10 bg-white p-5 font-medium"
                                                >
                                                    {layout}
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    <section
                                        id="location"
                                        className="scroll-mt-32 border-t border-[#17304f]/15 py-14 md:py-16"
                                    >
                                        <SectionHeading
                                            eyebrow="Tellapur, Hyderabad"
                                            title="Connected to the city"
                                        />
                                        <p className="mt-4 text-sm leading-6 text-[#69737c]">
                                            {project.location}
                                        </p>
                                        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                            {(project.nearbyPlaces || []).map((place) => (
                                                <li
                                                    key={place.name}
                                                    className="flex items-center justify-between gap-4 border border-[#17304f]/10 bg-white p-5"
                                                >
                                                    <span className="text-sm font-medium">
                                                        {place.name}
                                                    </span>
                                                    <span className="shrink-0 text-xs text-[#9a6c0e]">
                                                        {place.distance}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
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
                                        className="scroll-mt-32 border-t border-[#17304f]/15 py-14 md:py-16"
                                    >
                                        <SectionHeading
                                            eyebrow="Gallery"
                                            title="A glimpse of elevated living"
                                        />
                                        <p className="mt-4 text-xs leading-5 text-[#8b9298]">
                                            Illustrative stock imagery for visual reference; these
                                            are not photographs of the project.
                                        </p>
                                        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                            {(project.gallery || []).map((image, index) => (
                                                <div
                                                    key={image}
                                                    className="relative aspect-[4/3] overflow-hidden bg-[#e8e6df]"
                                                >
                                                    <Image
                                                        src={image}
                                                        alt={`Illustrative residential image ${index + 1}`}
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
