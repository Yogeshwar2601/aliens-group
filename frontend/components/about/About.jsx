import Image from "next/image";
import Animation from "./Animation";

export default function About() {
    return (
        <Animation
            as="section"
            id="about"
            className="about-reveal-root w-full overflow-hidden bg-white px-4 py-8 sm:px-6 sm:py-[40px] md:py-[80px] lg:px-8"
        >
            {/* ABOUT US */}
            <div className="mx-auto mb-6 flex max-w-[1400px] items-center justify-center sm:mb-[35px] md:mb-[32px]">
                <h2 data-reveal="up" className="whitespace-nowrap font-serif text-[24px] font-bold tracking-[1.5px] text-[#b57f12] transition-all duration-[900ms] ease-out md:text-[30px]">
                    ABOUT US
                </h2>
            </div>

            {/* IMAGE + CONTENT */}
            <div className="mx-auto flex w-full max-w-[1264px] flex-col items-center gap-6 sm:gap-10 lg:flex-row lg:gap-12 xl:gap-[168px]">

                {/* IMAGE — comes from left */}
                <div data-reveal="left" className="relative w-full transform transition-all duration-[1000ms] ease-out lg:w-1/2 xl:w-[550px]">
                    <div className="relative aspect-[1.55/1] w-full overflow-hidden sm:aspect-[1.45/1] xl:aspect-[4/3]">
                        <Image
                            src="/images/about/aboutus.avif"
                            alt="About Aliens Group"
                            fill
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover"
                        />
                    </div>
                </div>

                {/* TEXT — comes from bottom */}
                <div className="w-full lg:w-1/2 xl:w-[426px]">
                    <h3
                        data-reveal="up"
                        className="font-serif text-[24px] font-bold leading-[1.3] text-[#172536]"
                    >
                        Redefining Intelligent Luxury
                    </h3>

                    <p
                        data-reveal="up"
                        className="font-lato mt-3 max-w-[600px] text-[14px] leading-7 text-[#687586] sm:mt-5"
                        style={{ transitionDelay: "120ms" }}
                    >
                        At Aliens Group, we are redefining luxury living for the modern
                        world. Headquartered in Gachibowli, Hyderabad, Aliens Group -
                        comprising Aliens Developers and Aliens Smart City is the
                        brainchild of visionary brothers Hari Challa and Venkat Challa.
                    </p>

                    <span
                        data-reveal="up"
                        style={{ transitionDelay: "240ms" }}
                        className="group mt-7 inline-flex items-center gap-6 border border-black px-5 py-3 text-[14px] font-medium text-black transition-colors duration-300 hover:border-[#4caf50] hover:bg-[#4caf50] hover:text-white"
                    >
                        <span>Know more</span>
                        <span className="text-[24px] leading-none transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </span>
                </div>
            </div>
        </Animation>
    );
}