"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import { getProjectBySlug } from "@/lib/projectService";

export default function ProjectDetails({ slug }) {
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        async function fetchProject() {
            setLoading(true);
            setError("");

            try {
                const result = await getProjectBySlug(slug, {
                    signal: controller.signal,
                });
                setProject(result);
            } catch (fetchError) {
                if (controller.signal.aborted) return;

                if (fetchError.response?.status === 404) {
                    setError("This project could not be found.");
                } else {
                    console.error("Failed to fetch project details:", fetchError);
                    setError("Unable to load this project. Please try again.");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        fetchProject();
        return () => controller.abort();
    }, [slug]);

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-[#f7f5f0] px-6 pb-20 pt-32 text-[#17304f] md:px-10 md:pt-40">
                <div className="mx-auto max-w-[1120px]">
                    <nav
                        aria-label="Breadcrumb"
                        className="mb-8 flex items-center gap-3 text-sm text-[#6f7880]"
                    >
                        <Link href="/" className="transition-colors hover:text-[#b57f12]">
                            Home
                        </Link>
                        <span aria-hidden="true">››</span>
                        <Link href="/#projects" className="transition-colors hover:text-[#b57f12]">
                            Our Projects
                        </Link>
                        {project && (
                            <>
                                <span aria-hidden="true">››</span>
                                <span aria-current="page" className="truncate">
                                    {project.name}
                                </span>
                            </>
                        )}
                    </nav>

                    {loading ? (
                        <p role="status" className="py-20 text-center text-[#69737c]">
                            Loading project...
                        </p>
                    ) : error ? (
                        <div className="py-20 text-center">
                            <p role="alert" className="text-red-700">{error}</p>
                            <Link
                                href="/#projects"
                                className="mt-5 inline-block border-b border-[#b57f12] pb-1 text-sm text-[#9a6c0e]"
                            >
                                Back to projects
                            </Link>
                        </div>
                    ) : project ? (
                        <article>
                            <header className="mb-10">
                                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#9a6c0e]">
                                    {project.category} · {project.status || "Ongoing"}
                                </p>
                                <h1 className="font-serif text-3xl font-semibold sm:text-4xl md:text-5xl">
                                    {project.name}
                                </h1>
                                <p className="mt-4 text-base text-[#69737c]">
                                    {project.location}
                                </p>
                            </header>

                            {project.image && (
                                <div className="relative mb-12 aspect-[1.9/1] overflow-hidden bg-[#e6e2d9]">
                                    <Image
                                        src={project.image}
                                        alt={project.name}
                                        fill
                                        unoptimized
                                        priority
                                        sizes="(max-width: 768px) 100vw, 1120px"
                                        className="object-cover"
                                    />
                                </div>
                            )}

                            <div className="grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(220px,1fr)]">
                                <div>
                                    <section aria-labelledby="project-overview">
                                        <h2 id="project-overview" className="font-serif text-2xl font-semibold">
                                            Project overview
                                        </h2>
                                        <p className="mt-4 whitespace-pre-line text-base leading-7 text-[#69737c]">
                                            {project.description || "Project information will be added soon."}
                                        </p>
                                    </section>

                                    {project.highlights?.length > 0 && (
                                        <section className="mt-12" aria-labelledby="project-highlights">
                                            <h2 id="project-highlights" className="font-serif text-2xl font-semibold">
                                                Project highlights
                                            </h2>
                                            <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                                                {project.highlights.map((item, index) => (
                                                    <div key={`${item.label}-${index}`} className="bg-white p-5">
                                                        <dt className="text-xs uppercase tracking-[0.12em] text-[#8b9298]">
                                                            {item.label}
                                                        </dt>
                                                        <dd className="mt-2 font-serif text-lg font-semibold">
                                                            {item.value}
                                                        </dd>
                                                    </div>
                                                ))}
                                            </dl>
                                        </section>
                                    )}

                                    {project.amenityDetails?.length > 0 && (
                                        <section className="mt-12" aria-labelledby="project-amenities">
                                            <h2 id="project-amenities" className="font-serif text-2xl font-semibold">
                                                Amenities
                                            </h2>
                                            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                                                {project.amenityDetails.map((item) => (
                                                    <li key={item.name} className="bg-white p-5">
                                                        <h3 className="font-semibold">{item.name}</h3>
                                                        {item.description && (
                                                            <p className="mt-2 text-sm leading-6 text-[#69737c]">
                                                                {item.description}
                                                            </p>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </section>
                                    )}

                                    {project.nearbyPlaces?.length > 0 && (
                                        <section className="mt-12" aria-labelledby="project-location">
                                            <h2 id="project-location" className="font-serif text-2xl font-semibold">
                                                Nearby places
                                            </h2>
                                            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                                                {project.nearbyPlaces.map((item) => (
                                                    <li key={`${item.name}-${item.distance}`} className="flex justify-between gap-4 bg-white p-4 text-sm">
                                                        <span>{item.name}</span>
                                                        <span className="shrink-0 text-[#69737c]">{item.distance}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </section>
                                    )}
                                </div>

                                <aside className="h-fit bg-white p-6 shadow-[0_12px_40px_rgba(23,48,79,0.06)]">
                                    <h2 className="font-serif text-xl font-semibold">At a glance</h2>
                                    <dl className="mt-5 divide-y divide-[#17304f]/10">
                                        <div className="py-4">
                                            <dt className="text-xs uppercase tracking-[0.12em] text-[#8b9298]">
                                                Location
                                            </dt>
                                            <dd className="mt-2 text-sm">{project.location}</dd>
                                        </div>
                                        {project.areaRange && (
                                            <div className="py-4">
                                                <dt className="text-xs uppercase tracking-[0.12em] text-[#8b9298]">
                                                    Area
                                                </dt>
                                                <dd className="mt-2 text-sm">{project.areaRange}</dd>
                                            </div>
                                        )}
                                        {project.communityType && (
                                            <div className="py-4">
                                                <dt className="text-xs uppercase tracking-[0.12em] text-[#8b9298]">
                                                    Community
                                                </dt>
                                                <dd className="mt-2 text-sm">{project.communityType}</dd>
                                            </div>
                                        )}
                                    </dl>
                                    {project.brochureUrl && (
                                        <a
                                            href={project.brochureUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-4 inline-flex border-b border-[#b57f12] pb-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#9a6c0e]"
                                        >
                                            Download brochure
                                        </a>
                                    )}
                                </aside>
                            </div>

                            {project.gallery?.length > 0 && (
                                <section className="mt-14" aria-labelledby="project-gallery">
                                    <h2 id="project-gallery" className="font-serif text-2xl font-semibold">
                                        Gallery
                                    </h2>
                                    <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {project.gallery.map((image, index) => (
                                            <div key={`${image}-${index}`} className="relative aspect-[4/3] overflow-hidden bg-[#e6e2d9]">
                                                <Image
                                                    src={image}
                                                    alt={`${project.name} gallery image ${index + 1}`}
                                                    fill
                                                    unoptimized
                                                    sizes="(max-width: 768px) 100vw, 33vw"
                                                    className="object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </article>
                    ) : null}
                </div>
            </main>
            <Footer />
        </>
    );
}
