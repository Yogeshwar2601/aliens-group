"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import Animation from "./Animation";
import { getProjectCategories, getProjects } from "@/lib/projectService";

function getProjectHref(project) {
    return project.slug === "aliens-hub"
        ? "/alienshub/overview"
        : `/projects/${encodeURIComponent(project.slug)}`;
}

export default function Projects() {
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState("Residential");
    const [projects, setProjects] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        async function fetchCategories() {
            try {
                const data = await getProjectCategories();
                if (active) {
                    setCategories(data);
                    if (data.length > 0) {
                        setActiveCategory((current) =>
                            data.some((category) => category.name === current)
                                ? current
                                : data[0].name
                        );
                    }
                }
            } catch (fetchError) {
                console.error("Failed to fetch project categories:", fetchError);
                if (active) {
                    setError("Unable to load project categories. Please try again later.");
                }
            } finally {
                if (active) {
                    setLoadingCategories(false);
                }
            }
        }

        fetchCategories();

        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        let active = true;

        async function fetchProjects() {
            setLoadingProjects(true);
            setError("");

            try {
                const data = await getProjects({ category: activeCategory });
                if (active) {
                    setProjects(data);
                }
            } catch (fetchError) {
                console.error("Failed to fetch projects:", fetchError);
                if (active) {
                    setError("Unable to load projects. Please try again later.");
                }
            } finally {
                if (active) {
                    setLoadingProjects(false);
                }
            }
        }

        fetchProjects();

        return () => {
            active = false;
        };
    }, [activeCategory]);

    return (
        <Animation
            as="section"
            id="projects"
            className="w-full overflow-hidden bg-[#f7f5f0] px-6 py-12 md:px-10 md:py-20 lg:px-16"
        >
            <div
                data-reveal="up"
                className="mx-auto mb-8 max-w-[1120px] text-center transition-all duration-[900ms] ease-out md:mb-10"
            >
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#17304f]/60">
                    Discover Aliens Group
                </p>
                <h2 className="font-serif text-[24px] font-bold tracking-[1px] text-[#b57f12] sm:text-[28px] md:text-[34px] md:tracking-[1.5px]">
                    OUR PROJECTS
                </h2>
            </div>

            {loadingCategories ? (
                <p role="status" className="py-5 text-center text-[#69737c]">
                    Loading project categories...
                </p>
            ) : (
                <div
                    role="tablist"
                    aria-label="Project categories"
                    className="mx-auto mb-9 flex max-w-[1120px] gap-2 overflow-x-auto border-b border-[#17304f]/15 sm:justify-center sm:gap-5"
                >
                    {categories.map((category) => (
                        <button
                            key={category.name}
                            id={`project-tab-${category.name.toLowerCase().replaceAll(" ", "-")}`}
                            type="button"
                            role="tab"
                            aria-selected={activeCategory === category.name}
                            aria-controls="project-category-panel"
                            onClick={() => setActiveCategory(category.name)}
                            className={`relative flex shrink-0 items-center gap-2 px-3 py-3 text-xs font-semibold uppercase tracking-[0.1em] transition-colors sm:px-5 sm:text-sm ${
                                activeCategory === category.name
                                    ? "text-[#9a6c0e] after:absolute after:inset-x-3 after:bottom-0 after:h-[2px] after:bg-[#b57f12] sm:after:inset-x-5"
                                    : "text-[#69737c] hover:text-[#17304f]"
                            }`}
                        >
                            {category.name}
                            <span className="text-[10px] text-current/70">
                                {category.count}
                            </span>
                        </button>
                    ))}
                </div>
            )}

            <div
                id="project-category-panel"
                role="tabpanel"
                aria-label={`${activeCategory} projects`}
                className="mx-auto max-w-[1120px]"
            >
                {error ? (
                    <p role="alert" className="py-10 text-center text-red-700">
                        {error}
                    </p>
                ) : loadingProjects ? (
                    <p role="status" className="py-10 text-center text-[#69737c]">
                        Loading {activeCategory.toLowerCase()} projects...
                    </p>
                ) : projects.length === 0 ? (
                    <p className="py-10 text-center text-[#69737c]">
                        No {activeCategory.toLowerCase()} projects are available yet.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
                        {projects.map((project, index) => (
                            <Link
                                key={project._id || project.slug}
                                href={getProjectHref(project)}
                                data-reveal="up"
                                className="group block transform transition-all duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b57f12]"
                                style={{ transitionDelay: `${index * 150}ms` }}
                            >
                                <article className="overflow-hidden bg-white shadow-[0_12px_40px_rgba(23,48,79,0.08)]">
                                    <div className="relative aspect-[1.7/1] w-full overflow-hidden bg-[#e6e2d9]">
                                        {project.image ? (
                                            <Image
                                                src={project.image}
                                                alt={project.name}
                                                fill
                                                unoptimized
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#d5d0c5] to-[#f0ede6]">
                                                <span className="font-serif text-xl text-[#17304f]/55">
                                                    {project.name}
                                                </span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                                        <span className="absolute left-5 top-5 border border-white/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                                            {project.status || "Ongoing"}
                                        </span>
                                        <h3 className="absolute bottom-5 left-5 max-w-[80%] font-serif text-[25px] font-semibold leading-tight text-white sm:text-[30px]">
                                            {project.name}
                                        </h3>
                                        <span
                                            aria-hidden="true"
                                            className="absolute bottom-5 right-5 text-[30px] leading-none text-white transition-transform duration-300 group-hover:translate-x-2"
                                        >
                                            →
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-start justify-between gap-3 px-5 py-4 text-sm text-[#69737c] sm:px-6">
                                        <div>
                                            <p>{project.location}</p>
                                            {project.areaRange && (
                                                <p className="mt-1 text-xs">
                                                    Area: {project.areaRange}
                                                </p>
                                            )}
                                        </div>
                                        <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[#9a6c0e]">
                                            Explore project
                                        </span>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </Animation>
    );
}
