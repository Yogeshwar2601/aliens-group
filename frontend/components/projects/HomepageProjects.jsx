"use client";

import { useEffect, useState } from "react";
import Animation from "./Animation";
import { getProjects } from "@/lib/projectService";

export default function HomepageProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        async function fetchProjects() {
            try {
                const data = await getProjects();

                if (active) {
                    setProjects(data);
                }
            } catch (error) {
                console.error("Failed to fetch projects:", error);
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
    }, []);

    return (
        <Animation
            as="section"
            id="projects"
            className="w-full overflow-hidden bg-[#f7f5f0] px-6 py-[40px] md:px-10 md:py-[80px] lg:px-16"
        >
            <div
                data-reveal="up"
                className="mx-auto mb-[35px] flex max-w-[930px] items-center justify-center transition-all duration-[900ms] ease-out md:mb-[40px]"
            >
                <h2 className="whitespace-nowrap text-center font-serif text-[22px] font-bold tracking-[1px] text-[#b57f12] sm:text-[24px] md:text-[30px] md:tracking-[1.5px]">
                    OUR PROJECTS
                </h2>
            </div>

            {loading ? (
                <p className="py-10 text-center text-gray-500">
                    Loading projects...
                </p>
            ) : projects.length === 0 ? (
                <p className="py-10 text-center text-gray-500">
                    No projects available.
                </p>
            ) : (
                <div className="mx-auto grid max-w-[1050px] grid-cols-1 gap-6 md:grid-cols-2 md:gap-[52px]">
                    {projects.map((project, index) => (
                        <div
                            key={project._id || project.slug}
                            data-reveal="up"
                            className="transform transition-all duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                            style={{
                                transitionDelay: `${index * 250}ms`,
                            }}
                        >
                            <div className="group relative aspect-[1.55/1] w-full overflow-hidden md:aspect-[4/3]">
                                {project.image ? (
                                    <img
                                        src={project.image}
                                        alt={project.name}
                                        loading="lazy"
                                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gray-300" />
                                )}

                                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

                                <h3 className="absolute bottom-4 left-4 max-w-[78%] text-[21px] font-semibold leading-tight text-white sm:bottom-5 sm:left-5 sm:text-[25px] md:text-[27px]">
                                    {project.name}
                                </h3>

                                <span className="absolute bottom-4 right-4 text-[30px] leading-none text-white transition-transform duration-300 group-hover:translate-x-2 sm:bottom-5 sm:right-5 sm:text-[35px]">
                                    →
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Animation>
    );
}
