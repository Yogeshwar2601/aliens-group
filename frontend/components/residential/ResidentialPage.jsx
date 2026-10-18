"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import { getProjects } from "@/lib/projectService";

const projectStatuses = ["Ongoing", "Upcoming"];

export default function ResidentialPage() {
    const [status, setStatus] = useState("Ongoing");
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        async function fetchProjects() {
            setLoading(true);
            setError("");

            try {
                const data = await getProjects({
                    category: "Residential",
                    status,
                });

                if (active) {
                    setProjects(data);
                }
            } catch (fetchError) {
                console.error("Failed to fetch residential projects:", fetchError);

                if (active) {
                    setError("Unable to load residential projects. Please try again later.");
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        fetchProjects();

        return () => {
            active = false;
        };
    }, [status]);

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-[#f7f5f0] px-6 pb-20 pt-32 text-[#17304f] md:px-10 md:pt-40 lg:px-16">
                <div className="mx-auto max-w-[1120px]">
                    <nav
                        aria-label="Breadcrumb"
                        className="mb-12 flex items-center gap-3 text-sm text-[#6f7880]"
                    >
                        <Link href="/" className="transition-colors hover:text-[#b57f12]">
                            Home
                        </Link>
                        <span aria-hidden="true">››</span>
                        <span aria-current="page">Residential</span>
                    </nav>

                    <header className="mb-12 text-center md:mb-16">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#b57f12]">
                            Aliens Group
                        </p>
                        <h1 className="font-serif text-3xl font-semibold uppercase tracking-[0.06em] text-[#17304f] sm:text-4xl md:text-5xl">
                            Step into your ideal place
                        </h1>
                        <p className="mt-5 font-serif text-lg italic text-[#69737c] md:text-xl">
                            Spaces that inspire, reflect you, and support your journey
                        </p>
                        <p className="mt-3 text-xs text-[#8b9298]">
                            Project visuals are illustrative stock imagery.
                        </p>
                    </header>

                    <div
                        aria-label="Filter residential projects by status"
                        className="mb-10 flex justify-center gap-3 sm:gap-5"
                    >
                        {projectStatuses.map((projectStatus) => (
                            <button
                                key={projectStatus}
                                type="button"
                                aria-pressed={status === projectStatus}
                                onClick={() => setStatus(projectStatus)}
                                className={`border px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition-colors sm:px-8 sm:text-sm ${
                                    status === projectStatus
                                        ? "border-[#b57f12] bg-[#b57f12] text-white"
                                        : "border-[#17304f]/25 bg-transparent text-[#17304f] hover:border-[#b57f12] hover:text-[#9a6c0e]"
                                }`}
                            >
                                {projectStatus} Project
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <p role="status" className="py-16 text-center text-[#69737c]">
                            Loading residential projects...
                        </p>
                    ) : error ? (
                        <p role="alert" className="py-16 text-center text-red-700">
                            {error}
                        </p>
                    ) : projects.length === 0 ? (
                        <p className="py-16 text-center text-[#69737c]">
                            No {status.toLowerCase()} residential projects are available yet.
                        </p>
                    ) : (
                        <div className="grid gap-7 md:grid-cols-2">
                            {projects.map((project) => (
                                <article
                                    key={project._id || project.slug}
                                    className="flex h-full flex-col overflow-hidden border border-[#17304f]/10 bg-white shadow-[0_12px_40px_rgba(23,48,79,0.06)]"
                                >
                                    {project.image && (
                                        <Link
                                            href={
                                                project.slug === "aliens-space-station"
                                                    ? "/spacestation/overview"
                                                    : `/projects/${project.slug}`
                                            }
                                            className="relative block aspect-[16/8] overflow-hidden bg-[#e8e6df]"
                                            aria-label={`View ${project.name}`}
                                        >
                                            <Image
                                                src={project.image}
                                                alt={`${project.name} — illustrative project view`}
                                                fill
                                                unoptimized
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                                className="object-cover transition-transform duration-700 hover:scale-105"
                                            />
                                            <span className="absolute bottom-3 left-3 bg-[#17304f]/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                                                Illustrative image
                                            </span>
                                        </Link>
                                    )}
                                    <div className="flex flex-1 flex-col p-6 sm:p-8">
                                        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                                            <h2 className="font-serif text-2xl font-semibold text-[#17304f] sm:text-3xl">
                                                {project.name}
                                            </h2>
                                            <span className="shrink-0 border border-[#b57f12]/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9a6c0e]">
                                                {project.status || "Ongoing"}
                                            </span>
                                        </div>

                                        <p className="mb-6 text-sm leading-6 text-[#69737c]">
                                            {project.location}
                                        </p>

                                        <dl className="grid gap-5 border-y border-[#17304f]/10 py-5 sm:grid-cols-2">
                                            {project.areaRange && (
                                                <div>
                                                    <dt className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8b9298]">
                                                        From
                                                    </dt>
                                                    <dd className="text-sm font-medium text-[#17304f]">
                                                        {project.areaRange}
                                                    </dd>
                                                </div>
                                            )}
                                            {project.communityType && (
                                                <div>
                                                    <dt className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8b9298]">
                                                        Community type
                                                    </dt>
                                                    <dd className="text-sm font-medium text-[#17304f]">
                                                        {project.communityType}
                                                    </dd>
                                                </div>
                                            )}
                                        </dl>

                                        {project.description && (
                                            <p className="mt-5 text-sm leading-6 text-[#69737c]">
                                                {project.description}
                                            </p>
                                        )}

                                        <div className="mt-auto flex flex-wrap items-center gap-6 pt-7">
                                            <Link
                                                href={
                                                    project.slug === "aliens-space-station"
                                                        ? "/spacestation/overview"
                                                        : `/projects/${project.slug}`
                                                }
                                                className="inline-flex items-center gap-2 border-b border-[#b57f12] pb-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#9a6c0e] transition-colors hover:text-[#17304f]"
                                            >
                                                Know more <span aria-hidden="true">↗</span>
                                            </Link>
                                            {project.brochureUrl && (
                                                <a
                                                    href={project.brochureUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="border-b border-[#17304f]/30 pb-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#17304f] transition-colors hover:border-[#b57f12] hover:text-[#9a6c0e]"
                                                >
                                                    Download brochure
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
