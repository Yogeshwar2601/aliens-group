import Image from "next/image";
import Link from "next/link";
import Animation from "./Animation";

export default function Footer() {
    return (
        <Animation as="footer" className="w-full bg-[#f7f7f7] text-[#17304f]">

            {/* Main footer */}
            <div data-reveal="up" className="px-6 py-[55px] transition-all duration-1000 md:px-10 md:py-[70px] lg:px-12">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-[2.2fr_1fr_0.7fr_1fr_0.8fr]">

                    {/* About */}
                    <div>
                        <h3 className="mb-6 text-[18px] font-normal text-[#111]">
                            ABOUT ALIENS GROUP
                        </h3>

                        <p className="max-w-[470px] text-[16px] leading-[1.55]">
                            Established in 2004, Aliens Group is a Hyderabad-based
                            real estate developer known for innovative, futuristic
                            designs and smart living spaces. With projects like Aliens
                            Space Station, the group is redefining urban living
                            through technology and sustainability.
                        </p>

                        <h3 className="mt-8 text-2xl font-normal text-black sm:text-[32px]">
                            FOLLOW US ON
                        </h3>

                        <div className="mt-5 space-y-4">
                            <SocialRow title="Space Station" />
                            <SocialRow title="HUB" />
                        </div>
                    </div>

                    {/* Projects */}
                    <div>
                        <h3 className="mb-6 text-[18px] text-[#111]">
                            OUR PROJECTS
                        </h3>

                        <div className="space-y-4 text-[16px]">
                            <Link
                                href="/residential"
                                className="block transition-colors hover:text-[#b88624]"
                            >
                                Residential
                            </Link>
                            <Link
                                href="/alienshub/overview"
                                className="block transition-colors hover:text-[#b88624]"
                            >
                                Aliens HUB
                            </Link>
                        </div>
                    </div>

                    {/* Investors */}
                    <div>
                        <h3 className="mb-6 text-[18px] text-[#111]">
                            INVESTORS
                        </h3>

                        <div className="space-y-4 text-[16px]">
                            <p>Swamih</p>
                            <p>Phoenix</p>
                            <p>Nifco</p>
                        </div>
                    </div>

                    {/* Quick links */}
                    <div>
                        <h3 className="mb-6 text-[18px] text-[#111]">
                            QUICK LINKS
                        </h3>

                        <div className="space-y-4 text-[16px]">
                            <p>Reach Us</p>
                            <p>Enquire Now</p>
                            <p>Schedule a Site Visit</p>
                            <p>Privacy Policy</p>
                        </div>
                    </div>

                    {/* Logo */}
                    <div className="flex items-start justify-center lg:justify-end">
                        <Image
                            src="/images/footer/aliensgroupfootericon.svg"
                            alt="Aliens Group"
                            width={170}
                            height={184}
                            className="h-auto w-[150px] object-contain md:w-[170px]"
                        />
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div data-reveal="up" className="flex flex-col gap-6 border-t border-[#eeeeee] bg-white px-6 py-7 transition-all delay-100 duration-1000 md:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-12">

                <Image
                    src="/images/footer/aliensgroupnavlogo.svg"
                    alt="Aliens Group"
                    width={170}
                    height={47}
                    className="h-auto w-[150px] md:w-[170px]"
                />

                <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-[13px] sm:gap-8 sm:text-[14px]">
                    <span>Copyright © 2025 Aliens Group</span>
                    <span>Disclaimer</span>
                    <span>Site Layout</span>
                </div>
            </div>

        </Animation>
    );
}

function SocialRow({ title }) {
    return (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:flex-nowrap sm:gap-6">
            <span className="w-[112px] text-[16px] sm:w-[125px] sm:text-[20px]">
                {title}
            </span>

            <div className="flex items-center gap-4 text-[20px] text-[#b88624] sm:gap-5 sm:text-[22px]">
                <span>▶</span>
                <span>f</span>
                <span>◎</span>
                <span>in</span>
                <span>𝕏</span>
            </div>
        </div>
    );
}