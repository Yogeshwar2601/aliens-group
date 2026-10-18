import Animation from "./Animation";

const latestVideo = {
    title: "Shaping Real Estate’s Future Together",
    description:
        "Watch Aliens Group MD Hari Challa in an insightful conversation with the CEO & MD of GRI Institute. They discuss the evolving real estate landscape, sustainable development, and the vision driving the industry forward. This engaging dialogue offers valuable perspectives for investors, partners, and enthusiasts eager to understand what’s next for the sector. A must-watch for anyone passionate about real estate innovation and growth.",
    youtubeUrl: "https://youtu.be/L5Q-XxMbBfA?si=AsxEjbJyZOUVzVKv",
};

export default function LatestFromAliens() {
    return (
        <Animation
            as="section"
            className="bg-white px-4 py-8 sm:px-6 sm:py-10 md:px-10 lg:pb-[24px] lg:pt-[80px]"
            threshold={0.2}
        >
            <div className="mx-auto max-w-[1440px]">
                <div data-reveal="up" className="mx-auto mb-6 flex max-w-5xl items-center justify-center gap-3 transition-all duration-700 sm:mb-10 sm:gap-4 lg:mb-[40px]">
                    <div className="hidden h-px flex-1 bg-gradient-to-r from-[#80808040] to-[#B57F12CC] sm:block" />
                    <h2 className="whitespace-nowrap text-center font-cormorant text-lg font-bold uppercase tracking-wide text-[#B57F12] sm:text-3xl sm:tracking-wider">
                        LATEST FROM ALIENS
                    </h2>
                    <div className="hidden h-px flex-1 bg-gradient-to-r from-[#B57F12CC] to-[#80808040] sm:block" />
                </div>

                <div className="mx-auto grid items-center gap-5 sm:gap-8 lg:max-w-[1224px] lg:grid-cols-2 lg:gap-12">
                    <div data-reveal="left" className="overflow-hidden border border-gray-200 bg-black shadow-md transition-all duration-700">
                        <div className="relative aspect-video w-full">
                            <iframe
                                className="absolute inset-0 h-full w-full"
                                src="https://www.youtube-nocookie.com/embed/L5Q-XxMbBfA?rel=0&modestbranding=1&playsinline=1"
                                title={latestVideo.title}
                                loading="lazy"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            />
                        </div>
                    </div>

                    <div data-reveal="up" className="transition-all delay-200 duration-700">
                        <h3 className="mb-3 font-cormorant text-2xl font-semibold leading-tight text-black sm:mb-4 sm:text-3xl">
                            {latestVideo.title}
                        </h3>
                        <p className="mb-4 line-clamp-5 text-sm leading-relaxed text-gray-600 sm:mb-6 sm:line-clamp-none sm:text-base">
                            {latestVideo.description}
                        </p>
                        <a
                            href={latestVideo.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 border border-black px-4 py-2 text-xs text-black transition-colors hover:border-[#B57F12] hover:bg-[#B57F12] hover:text-white sm:px-5 sm:text-sm"
                        >
                            Watch on YouTube
                            <span aria-hidden="true">→</span>
                        </a>
                    </div>
                </div>
            </div>
        </Animation>
    );
}