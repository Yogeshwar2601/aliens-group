"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { useEffect, useRef, useState } from "react";

const leaders = [
    {
        name: "Hari Challa",
        role: "Managing Director",
        image:
            "https://d1b9peg0jj5bry.cloudfront.net/leadership/harisir.png",
        description:
            "Hari is a visionary leader who serves as our managing director. He co-founded Aliens Group in 2004 with the aim to revolutionize the real estate sector in Hyderabad through highly innovative and customer-centric projects. This vision stemmed from a keen understanding of consumer behaviour and industry trends. Hari realized that there was widespread discontent with similar and ordinary residential projects, which did not offer good facilities or a convenient life.",
    },
    {
        name: "Venkat Challa",
        role: "Joint Managing Director",
        image:
            "https://d1b9peg0jj5bry.cloudfront.net/leadership/venkatsir.png",
        description:
            "Venkat is a co-founder of Aliens Group and serves as its Joint Managing Director. He is widely appreciated for bringing a process orientation and a structured approach to the operations of the organization. His vision has led to the high levels of home automation seen in the Aliens Group projects. He drives technological innovation in construction technology in the group's projects. His keen eye for detail makes sure that the residents of our projects have the best experience possible in their homes.",
    },
];

function LeaderSection({ leader, index }) {
    const sectionRef = useRef(null);
    const [visible, setVisible] = useState(false);
    const [bioExpanded, setBioExpanded] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // TRUE when entering screen
                // FALSE when leaving screen
                setVisible(entry.isIntersecting);
            },
            {
                threshold: 0.25,
            }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    const isFirst = index === 0;

    return (
        <div
            ref={sectionRef}
            className={`grid items-center gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-20 ${!isFirst ? "lg:[&>div:first-child]:order-2" : ""
                }`}
        >
            {/* ================= IMAGE ================= */}
            <div
                className={
                    visible
                        ? isFirst
                            ? "leader-image-left"
                            : "leader-image-right"
                        : "leader-image-hidden"
                }
            >
                <div className="relative aspect-[4/4.4] w-full overflow-hidden rounded-[4px] sm:aspect-[4/5]">
                    <Image
                        src={leader.image}
                        alt={leader.name}
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                </div>
            </div>

            {/* ================= TEXT ================= */}
            <div
                className={
                    visible
                        ? "leader-text-visible"
                        : "leader-text-hidden"
                }
            >
                <h2 className="text-3xl font-normal sm:text-4xl md:text-5xl">
                    {leader.name}
                </h2>

                <p className="mt-4 text-base font-medium text-gray-700">
                    {leader.role}
                </p>

                <p
                    id={`leader-bio-${index}`}
                    className={`mt-5 text-sm leading-6 text-gray-500 sm:mt-7 sm:leading-7 md:text-base ${
                        bioExpanded ? "" : "line-clamp-4"
                    }`}
                >
                    {leader.description}
                </p>

                <button
                    type="button"
                    aria-expanded={bioExpanded}
                    aria-controls={`leader-bio-${index}`}
                    onClick={() => setBioExpanded((expanded) => !expanded)}
                    className="mt-6 inline-flex items-center gap-4 border border-black px-5 py-3 text-sm font-medium transition hover:bg-black hover:text-white sm:mt-8 sm:px-7 sm:py-4"
                >
                    {bioExpanded ? "Read Less" : "Read More"}
                    <span
                        aria-hidden="true"
                        className={`text-xl transition-transform ${
                            bioExpanded ? "-rotate-90" : "rotate-0"
                        }`}
                    >
                        →
                    </span>
                </button>
            </div>

            {/* ================= ANIMATIONS ================= */}
            <style jsx>{`
        /* Initial image state */

        .leader-image-hidden {
          opacity: 0;
          transform: translateX(-100px);
        }


        /* First person image
           LEFT → RIGHT */

        .leader-image-left {
          opacity: 0;
          transform: translateX(-100px);

          animation: imageLeft 1.1s ease-out forwards;
        }


        /* Second person image
           RIGHT → LEFT */

        .leader-image-right {
          opacity: 0;
          transform: translateX(100px);

          animation: imageRight 1.1s ease-out forwards;
        }


        /* Text initial state
           BOTTOM */

        .leader-text-hidden {
          opacity: 0;
          transform: translateY(100px);
        }


        /* Text animation
           BOTTOM → TOP */

        .leader-text-visible {
          opacity: 0;
          transform: translateY(100px);

          animation: textBottom 1.1s ease-out forwards;
          animation-delay: 0.2s;
        }


        /* ================= KEYFRAMES ================= */

        @keyframes imageLeft {
          from {
            opacity: 0;
            transform: translateX(-100px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }


        @keyframes imageRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }


        @keyframes textBottom {
          from {
            opacity: 0;
            transform: translateY(100px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }


        /* ================= MOBILE ================= */

        @media (max-width: 1024px) {
          .leader-image-left,
          .leader-image-right {
            animation: mobileImage 1s ease-out forwards;
          }

          @keyframes mobileImage {
            from {
              opacity: 0;
              transform: translateY(70px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        }


        /* ================= REDUCED MOTION ================= */

        @media (prefers-reduced-motion: reduce) {
          .leader-image-hidden,
          .leader-image-left,
          .leader-image-right,
          .leader-text-hidden,
          .leader-text-visible {
            opacity: 1;
            transform: none;
            animation: none;
          }
        }
      `}</style>
        </div>
    );
}


export default function LeadershipAnimation() {
    return (
        <>
            <Navbar />

            <main className="bg-white text-black">

                {/* ================= HERO ================= */}

                <section className="relative flex h-[360px] items-center justify-center overflow-hidden sm:h-[430px]">
                    <Image
                        src="https://d1b9peg0jj5bry.cloudfront.net/leadership/leadershipbanner.png"
                        alt="Leadership Boardroom"
                        fill
                        priority
                        className="object-cover"
                    />

                    <div className="absolute inset-0 bg-black/45" />

                    <div className="relative z-10 px-6 text-center text-white">
                        <h1 className="text-3xl font-medium leading-tight sm:text-4xl md:text-5xl">
                            Meet the Visionaries Behind the Aliens Group
                        </h1>

                        <p className="mt-4 text-sm md:text-lg">
                            Leaders driving innovation and excellence in luxury real estate.
                        </p>
                    </div>
                </section>


                {/* ================= BREADCRUMB ================= */}

                <div className="mx-auto max-w-[1400px] px-6 py-8 text-sm text-gray-500 md:px-10">
                    <Link
                        href="/"
                        className="hover:text-black"
                    >
                        Home
                    </Link>

                    <span className="mx-2">
                        »
                    </span>

                    <span className="text-black">
                        Our Leaders
                    </span>
                </div>


                {/* ================= LEADERS INTRO ================= */}

                <section className="mx-auto max-w-[1400px] px-6 pb-20 md:px-10">

                    <div className="mb-16 text-center">

                        <h2 className="text-3xl font-medium tracking-wide md:text-4xl">
                            OUR LEADERS
                        </h2>

                        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-gray-500 md:text-base">
                            Our success is led by experienced leaders committed to our
                            vision and exceptional results.
                        </p>

                    </div>


                    {/* ================= LEADERS ================= */}

                    <div className="space-y-16 sm:space-y-32">

                        {leaders.map((leader, index) => (
                            <LeaderSection
                                key={leader.name}
                                leader={leader}
                                index={index}
                            />
                        ))}

                    </div>

                </section>

            </main>


            {/* ================= FOOTER ================= */}

            <Footer />
        </>
    );
}