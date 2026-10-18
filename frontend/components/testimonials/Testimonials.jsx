import Animation from "./Animation";
import testimonials from "@/lib/customerTestimonials";

export default function Testimonials() {
    return (
        <Animation
            as="section"
            className="relative bg-white py-10 lg:py-20"
            threshold={0.2}
        >
            <div data-reveal="up" className="mx-auto mb-10 flex max-w-5xl items-center justify-center gap-4 px-4 transition-all duration-700 lg:mb-10">
                <div className="hidden h-px flex-1 bg-gradient-to-r from-[#80808040] to-[#B57F12CC] lg:block" />
                <h2 className="whitespace-nowrap text-center font-cormorant text-xl font-bold uppercase tracking-wider text-[#B57F12] sm:text-3xl">
                    Testimonials
                </h2>
                <div className="hidden h-px flex-1 bg-gradient-to-r from-[#B57F12CC] to-[#80808040] lg:block" />
            </div>

            <div
                className="hide-scrollbar mb-10 flex gap-6 overflow-x-auto px-4 pb-2 md:px-10"
                aria-label="Aliens Group customer testimonial videos"
            >
                {testimonials.map((testimonial, index) => {
                    const videoId = new URL(testimonial.youtubeUrl).pathname.slice(1);
                    const embedUrl = new URL(
                        `https://www.youtube-nocookie.com/embed/${videoId}`
                    );
                    embedUrl.search = new URLSearchParams({
                        rel: "0",
                        modestbranding: "1",
                        autoplay: "0",
                        loop: "0",
                        mute: "1",
                        controls: testimonial.controls ? "1" : "0",
                    }).toString();

                    return (
                        <article
                            key={testimonial.id}
                            data-reveal="up"
                            className="w-[min(85vw,340px)] flex-shrink-0 overflow-hidden rounded border border-gray-200 bg-white shadow-md transition-all duration-700"
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            <div className="relative aspect-video bg-black">
                                <iframe
                                    className="absolute inset-0 h-full w-full"
                                    src={embedUrl.toString()}
                                    title={testimonial.title}
                                    loading="lazy"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    allowFullScreen
                                />
                            </div>
                            <div className="p-3">
                                <h3 className="line-clamp-2 text-sm font-medium text-gray-900">
                                    {testimonial.title}
                                </h3>
                                <p className="mt-2 line-clamp-2 whitespace-pre-line text-xs leading-relaxed text-gray-600">
                                    {testimonial.description}
                                </p>
                                <a
                                    href={testimonial.youtubeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-3 inline-flex items-center gap-2 text-xs text-gray-600 transition-colors hover:text-[#B57F12] hover:underline"
                                >
                                    Watch on YouTube
                                    <span aria-hidden="true">↗</span>
                                </a>
                            </div>
                        </article>
                    );
                })}
            </div>
            <div className="flex justify-center">
                <a
                    href="https://www.youtube.com/@AliensGroup-Tellapur"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-black px-4 py-2 text-xs text-black transition-colors hover:border-[#B57F12] hover:bg-[#B57F12] hover:text-white sm:text-sm"
                >
                    View More
                    <span aria-hidden="true">→</span>
                </a>
            </div>
        </Animation>
    );
}
