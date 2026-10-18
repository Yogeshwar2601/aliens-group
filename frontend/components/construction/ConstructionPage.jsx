import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import Animation from "./Animation";

const constructionImages = [
    "/images/construction/ss_construction_card.png",
    "/images/construction/hub_construction_card.png",
];

export default function ConstructionPage() {
    return (
        <>
            <Navbar />
            <Animation as="main" className="min-h-screen bg-white pt-[74px]">
                <section data-reveal="up" className="px-6 pb-10 pt-12 md:px-10 md:pt-16">
                    <div className="mx-auto max-w-[1440px]">
                        <p className="mb-8 text-xs text-gray-500 sm:text-sm">
                            <Link href="/" className="transition-colors hover:text-[#B57F12]">
                                Home
                            </Link>
                            <span className="mx-2 text-[#B57F12]">››</span>
                            Construction Updates
                        </p>

                        <div className="mx-auto flex max-w-5xl items-center justify-center gap-2 sm:gap-4">
                            <div className="hidden h-px flex-1 bg-gradient-to-r from-[#80808040] to-[#B57F12CC] sm:block" />
                            <h1 className="max-w-[22rem] text-center font-cormorant text-2xl font-bold uppercase leading-tight tracking-wide text-[#B57F12] sm:max-w-none sm:whitespace-nowrap sm:text-3xl sm:tracking-wider md:text-4xl">
                                Construction Updates
                            </h1>
                            <div className="hidden h-px flex-1 bg-gradient-to-r from-[#B57F12CC] to-[#80808040] sm:block" />
                        </div>

                        <p className="mt-5 text-center text-sm italic text-gray-600 sm:text-base">
                            “Tracking every stage of construction with transparency.”
                        </p>
                    </div>
                </section>

                <section data-reveal="up" className="mx-auto max-w-[1440px] px-6 pb-20 md:px-10 md:pb-28">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
                        {constructionImages.map((image, index) => {
                            const projectName = index === 0 ? "Aliens Space Station" : "Aliens HUB";

                            const projectSlug = index === 0 ? "space-station" : "hub";

                            return (
                                <Link
                                    key={image}
                                    href={`/construction/${projectSlug}`}
                                    className="group block overflow-hidden border border-gray-200 bg-white shadow-sm"
                                >
                                    <div className="relative aspect-[3/2] w-full overflow-hidden bg-gray-100">
                                        <Image
                                            src={image}
                                            alt={`${projectName} construction progress`}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                        />
                                    </div>
                                    <h2 className="px-5 py-4 font-cormorant text-xl font-semibold text-gray-900 sm:text-2xl">
                                        {projectName}
                                    </h2>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            </Animation>
            <Footer />
        </>
    );
}