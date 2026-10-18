import Animation from "./Animation";

const heroWords = ["Futuristic", "Serene", "Yours"];
const heroTagline = heroWords.join(" • ");

export default function Hero() {
    return (
        <Animation as="section" className="relative h-[80svh] min-h-[560px] max-h-[760px] w-full overflow-hidden bg-black md:h-auto md:aspect-video md:min-h-[500px] md:max-h-none">
            {/* Background video */}
            <iframe
                className="pointer-events-none absolute left-1/2 top-1/2 h-[100svh] w-[177.78svh] max-w-none -translate-x-1/2 -translate-y-1/2 md:h-full md:w-full"
                src="https://www.youtube-nocookie.com/embed/k3vuwDIRZo0?autoplay=1&mute=1&loop=1&playlist=k3vuwDIRZo0&controls=0&modestbranding=1&rel=0&playsinline=1"
                title="Aliens Group hero video"
                allow="autoplay; encrypted-media; picture-in-picture"
                referrerPolicy="strict-origin-when-cross-origin"
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Hero content */}
            <div className="relative z-10 flex h-full items-center justify-center px-4 md:px-10">
                <p
                    aria-label={heroTagline}
                    className="hero-tagline max-w-full text-center text-[clamp(2.8rem,12vw,5rem)] leading-[1.5] text-white sm:whitespace-nowrap sm:text-[3rem] md:text-[5rem] lg:text-[6rem] xl:text-[8rem]"
                >
                    <span aria-hidden="true" className="hero-tagline-words">
                        {heroWords.map((word, index) => (
                            <span key={word}>
                                {index > 0 && (
                                    <span
                                        className="hero-tagline-separator"
                                        style={{
                                            "--word-delay": `${index * 750 - 250}ms`,
                                        }}
                                    >
                                        •
                                    </span>
                                )}
                                <span
                                    className="hero-tagline-word"
                                    style={{
                                        "--word-delay": `${index * 750}ms`,
                                    }}
                                >
                                    {word}
                                </span>
                            </span>
                        ))}
                    </span>
                </p>
            </div>
        </Animation>
    );
}