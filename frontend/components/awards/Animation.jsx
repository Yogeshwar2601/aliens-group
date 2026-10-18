"use client";

import Image from "next/image";
import { useState } from "react";
import useScrollReveal from "@/components/hooks/useScrollReveal";

const awards = [
    {
        title:
            "PLATINUM PRE-CERTIFICATION BY INDIAN GREEN BUILDING COUNCIL",
        image: "/images/awards/igbc.png",
    },
    {
        title: "BEST RESIDENTIAL DEVELOPMENT – FUTURE",
        image: "/images/awards/cityscape.png",
    },
    {
        title:
            "WINNER OF TWO PRESTIGIOUS INTERNATIONAL PROPERTY AWARDS-2012-13",
        image: "/images/awards/property-awards.png",
    },
    {
        title:
            "WINNER OF INTERNATIONAL QUALITY CROWN (QC) AWARD",
        image: "/images/awards/quality-crown.png",
    },
];

export default function AwardsAnimation() {
    const { sectionRef, visible } = useScrollReveal();
    const [page, setPage] = useState(0);
    const [changing, setChanging] = useState(false);

    const totalPages = Math.ceil(awards.length / 2);

    const changePage = (direction) => {
        if (changing) return;

        setChanging(true);

        // Fade current cards out
        setTimeout(() => {
            setPage((current) =>
                direction === "next"
                    ? (current + 1) % totalPages
                    : current === 0
                        ? totalPages - 1
                        : current - 1
            );

            // Fade new cards in
            setTimeout(() => {
                setChanging(false);
            }, 100);
        }, 500);
    };

    const visibleAwards = awards.slice(page * 2, page * 2 + 2);

    return (
        <section
            ref={sectionRef}
            className="relative w-full overflow-hidden bg-[#f8f5ec] px-6 py-[40px] md:px-10 md:pb-[28px] md:pt-[80px] lg:px-16"
        >
            {/* Heading */}
            <div
                className={`mx-auto mb-[35px] flex max-w-[930px] items-center justify-center transition-all duration-[900ms] ease-out md:mb-[40px] ${visible
                        ? "translate-y-0 opacity-100"
                        : "translate-y-16 opacity-0"
                    }`}
            >
                <h2 className="text-center font-serif text-[18px] font-bold leading-tight tracking-[1px] text-[#b57f12] sm:whitespace-nowrap sm:text-[24px] sm:tracking-[1.5px] md:text-[30px]">
                    AWARDS AND CERTIFICATIONS
                </h2>
            </div>

            {/* Cards */}
            <div className="relative mx-auto max-w-[1080px]">
                <div className="hide-scrollbar -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 md:hidden">
                    {awards.map((award) => (
                        <article
                            key={award.title}
                            className="w-[min(82vw,360px)] flex-shrink-0 snap-center overflow-hidden rounded-[5px] bg-white shadow-sm"
                        >
                            <div className="relative h-[220px] w-full bg-white">
                                <Image
                                    src={award.image}
                                    alt={award.title}
                                    fill
                                    sizes="82vw"
                                    className="object-contain"
                                />
                            </div>
                            <div className="flex min-h-[84px] items-center justify-center bg-[#464950] px-4 py-3">
                                <h3 className="text-center text-[14px] font-semibold uppercase leading-[1.4] text-white">
                                    {award.title}
                                </h3>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Left */}
                <button
                    type="button"
                    onClick={() => changePage("prev")}
                    className="absolute left-[-70px] top-1/2 z-20 hidden h-[50px] w-[50px] -translate-y-1/2 items-center justify-center rounded-full bg-white text-[32px] text-[#555] shadow-sm md:flex"
                >
                    ‹
                </button>

                {/* Award cards */}
                <div
                    className={`hidden grid-cols-1 gap-[30px] transition-opacity duration-500 ease-in-out md:grid md:grid-cols-2 ${changing ? "opacity-0" : "opacity-100"
                        }`}
                >
                    {visibleAwards.map((award, index) => (
                        <div
                            key={`${award.title}-${page}`}
                            className={`overflow-hidden rounded-[5px] bg-white shadow-sm transition-all duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${visible
                                    ? "translate-y-0 opacity-100"
                                    : "translate-y-24 opacity-0"
                                }`}
                            style={{
                                transitionDelay: `${index * 220}ms`,
                            }}
                        >
                            {/* Image */}
                            <div className="relative h-[300px] w-full bg-white md:h-[320px]">
                                <Image
                                    src={award.image}
                                    alt={award.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 540px"
                                    className="object-contain"
                                />
                            </div>

                            {/* Title */}
                            <div className="flex min-h-[80px] items-center justify-center bg-[#464950] px-7 py-4">
                                <h3 className="text-center text-[17px] font-semibold uppercase leading-[1.45] text-white md:text-[18px]">
                                    {award.title}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right */}
                <button
                    type="button"
                    onClick={() => changePage("next")}
                    className="absolute right-[-70px] top-1/2 z-20 hidden h-[50px] w-[50px] -translate-y-1/2 items-center justify-center rounded-full bg-white text-[32px] text-[#555] shadow-sm md:flex"
                >
                    ›
                </button>
            </div>

            {/* Learn More */}
            <div
                className={`mt-6 flex justify-center transition-all duration-[1200ms] ease-out sm:mt-[42px] ${visible
                        ? "translate-y-0 opacity-100"
                        : "translate-y-16 opacity-0"
                    }`}
                style={{ transitionDelay: "500ms" }}
            >
                <button
                    type="button"
                    className="inline-flex items-center gap-6 border border-[#222] px-5 py-3 text-[14px] text-[#111] transition-colors duration-300 hover:bg-[#111] hover:text-white"
                >
                    <span>Learn More</span>
                    <span className="text-[24px] leading-none">→</span>
                </button>
            </div>
        </section>
    );
}