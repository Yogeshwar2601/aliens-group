"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import useScrollReveal from "@/components/hooks/useScrollReveal";

const categories = [
    {
        title: "SkyVilla",
        location: "Tellapur-Gachibowli, Hyderabad",
        area: "5196 - 6762 sq.ft.",
        image: "/images/featured/skyvilla.png",
    },
    {
        title: "Duplex",
        location: "Tellapur-Gachibowli, Hyderabad",
        area: "3751 - 4112 sq.ft.",
        image: "/images/featured/duplex.png",
    },
    {
        title: "Signature Plots",
        location: "Srisailam Highway, Hyderabad",
        area: "500 - 2000 sq.yd.",
        image: "/images/featured/signature-plots.png",
    },
    {
        title: "Palace Plots",
        location: "Srisailam Highway, Hyderabad",
        area: "500 - 2000 sq.yd.",
        image: "/images/featured/palace-plots.png",
    },
];

export default function FeaturedCategoriesAnimation() {
    const { sectionRef, visible } = useScrollReveal();
    const [active, setActive] = useState(0);

    /* Automatic category switching */
    useEffect(() => {
        const interval = setInterval(() => {
            setActive((current) => (current + 1) % categories.length);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    const category = categories[active];

    return (
        <section
            ref={sectionRef}
            className="relative w-full overflow-hidden bg-white pt-2"
        >
            {/* Heading */}
            <div
                className={`mx-auto flex w-full max-w-[1000px] items-center justify-center px-6 py-[35px] transition-all duration-[600ms] ease-out md:pb-[40px] md:pt-[78px] ${visible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-16 opacity-0"
                    }`}
            >
                <h2 className="whitespace-nowrap text-center font-serif text-[20px] font-bold tracking-[1px] text-[#b57f12] sm:text-[24px] md:text-[30px] md:tracking-[1.5px]">
                    FEATURED CATEGORIES
                </h2>
            </div>

            {/* Featured image */}
            <div className="relative h-[min(42svh,380px)] min-h-[320px] w-full overflow-hidden md:h-auto md:aspect-[1.95/1] md:min-h-0">
                {categories.map((item, index) => (
                    <div
                        key={item.title}
                        className={`absolute inset-0 transition-opacity duration-[600ms] ease-in-out ${active === index ? "opacity-100" : "opacity-0"
                            }`}
                    >
                        <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            priority={index === 0}
                            sizes="100vw"
                            className="object-cover"
                        />

                        {/* Dark overlay */}
                        <div className="absolute inset-0 bg-black/10" />
                    </div>
                ))}

                {/* Category information */}
                <div
                    key={category.title}
                    className={`absolute bottom-[105px] left-[4%] w-[92%] max-w-[410px] bg-black/30 px-4 py-4 text-white backdrop-blur-[2px] transition-all duration-500 sm:bottom-[95px] sm:px-5 sm:py-5 md:px-7 md:py-6 ${visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                >
                    <h3 className="font-serif text-[22px] font-bold leading-tight sm:text-[32px] md:text-[38px]">
                        {category.title}
                    </h3>

                    <p className="mt-2 hidden text-[14px] sm:mt-3 sm:text-[20px] sm:block">
                        {category.location}
                    </p>

                    <p className="mt-1 hidden text-[14px] sm:block sm:text-[20px]">
                        Area : {category.area}
                    </p>
                </div>

                {/* Know more */}
                <button
                    type="button"
                    className="absolute bottom-[58px] left-1/2 -translate-x-1/2 whitespace-nowrap border border-white px-4 py-2 text-xs text-white transition-colors duration-200 hover:border-[#4caf50] hover:bg-[#4caf50] hover:text-white sm:bottom-[75px] sm:px-5 sm:py-3 sm:text-sm"
                >
                    Know more
                    <span className="ml-3 text-lg">→</span>
                </button>

                {/* Dots */}
                <div className="absolute bottom-[20px] left-1/2 flex -translate-x-1/2 gap-3 sm:bottom-[35px]">
                    {categories.map((item, index) => (
                        <button
                            key={item.title}
                            type="button"
                            aria-label={`Show ${item.title}`}
                            onClick={() => setActive(index)}
                            className={`h-2.5 w-2.5 rounded-full border border-white transition-all duration-200 sm:h-3 sm:w-3 ${active === index
                                ? "bg-white"
                                : "bg-white/30"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}