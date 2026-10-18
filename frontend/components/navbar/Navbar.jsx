
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";

const initialFormData = {
    name: "",
    email: "",
    projectName: "Residential (Space Station)",
    countryCode: "+91",
    phone: "",
};

export default function Navbar() {
    const [showNavbar, setShowNavbar] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileProjectsOpen, setMobileProjectsOpen] = useState(false);
    const [formModal, setFormModal] = useState(null);
    const [newsletterOpen, setNewsletterOpen] = useState(false);

    const [formData, setFormData] = useState(initialFormData);
    const [submitting, setSubmitting] = useState(false);
    const [formStatus, setFormStatus] = useState("");
    const [formError, setFormError] = useState(false);

    useEffect(() => {
        let lastScrollY = window.scrollY;
        let hideTimer;

        const handleScroll = () => {
            if (menuOpen || formModal || newsletterOpen) return;

            const currentScrollY = window.scrollY;

            if (currentScrollY <= 10) {
                setShowNavbar(true);
                clearTimeout(hideTimer);
            } else if (currentScrollY < lastScrollY) {
                setShowNavbar(true);
                clearTimeout(hideTimer);

                hideTimer = setTimeout(() => {
                    if (window.scrollY > 10) {
                        setShowNavbar(false);
                    }
                }, 400);
            } else if (currentScrollY > lastScrollY) {
                clearTimeout(hideTimer);
                setShowNavbar(false);
            }

            lastScrollY = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, {
            passive: true,
        });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            clearTimeout(hideTimer);
        };
    }, [menuOpen, formModal, newsletterOpen]);

    useEffect(() => {
        const isOpen = menuOpen || formModal !== null || newsletterOpen;

        document.body.style.overflow = isOpen ? "hidden" : "";

        return () => {
            document.body.style.overflow = "";
        };
    }, [menuOpen, formModal, newsletterOpen]);

    useEffect(() => {
        if (!menuOpen && !formModal && !newsletterOpen) {
            return undefined;
        }

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setMenuOpen(false);
                setFormModal(null);
                setNewsletterOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [menuOpen, formModal, newsletterOpen]);

    const openForm = (type) => {
        setMenuOpen(false);
        setFormData(initialFormData);
        setFormStatus("");
        setFormError(false);
        setFormModal(type);
    };

    const handleFormChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        if (submitting) return;

        setSubmitting(true);
        setFormStatus("");
        setFormError(false);

        const nameParts = formData.name.trim().split(/\s+/);
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(" ");
        const phone = `${formData.countryCode}${formData.phone.trim()}`;

        try {
            await api.post("/site-visits", {
                firstName,
                lastName,
                email: formData.email.trim(),
                phone,
                projectName: formData.projectName,
            });

            setFormStatus(
                "Your request has been submitted successfully."
            );
            setFormData(initialFormData);
        } catch (error) {
            setFormError(true);
            setFormStatus(
                error.response?.data?.message ||
                "Unable to submit your request. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const getFormTitle = () => {
        if (formModal === "site-visit") return "Schedule Your Call Now";
        if (formModal === "enquire") return "Enquire Now";
        if (formModal === "reach-us") return "Reach Us";
        return "";
    };

    return (
        <>
            {/* NAVBAR */}
            <header
                className={`fixed left-0 top-0 z-[100] w-full bg-[#1d1d1b] transition-transform duration-300 ease-out ${showNavbar || menuOpen || formModal || newsletterOpen
                    ? "translate-y-0"
                    : "-translate-y-full"
                    }`}
            >
                <nav className="mx-auto flex h-[56px] items-center justify-between px-5 md:h-[64px] md:px-8 lg:px-[30px]">
                    <Link
                        href="/"
                        className="flex w-[140px] items-center md:w-[160px]"
                    >
                        <Image
                            src="/images/navbar/logo.svg"
                            alt="Aliens Group"
                            width={203}
                            height={56}
                            priority
                            className="h-auto w-full object-contain object-left"
                        />
                    </Link>

                    <div className="hidden items-center gap-8 md:flex">
                        <div className="group relative">
                            <Link
                                href="/projects"
                                onClick={() => setMenuOpen(false)}
                                aria-haspopup="true"
                                className="font-inter nav-underline relative text-[16px] font-semibold text-white"
                            >
                                Our Projects
                            </Link>
                            <div className="invisible absolute left-0 top-full z-30 min-w-52 translate-y-2 pt-5 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                                <div className="flex flex-col bg-[#1d1d1b] py-2 shadow-lg">
                                    <Link
                                        href="/residential"
                                        className="px-5 py-3 text-sm text-white transition-colors hover:bg-white/10 hover:text-[#d6a229]"
                                    >
                                        Residential
                                    </Link>
                                    <Link
                                        href="/alienshub/overview"
                                        className="px-5 py-3 text-sm text-white transition-colors hover:bg-white/10 hover:text-[#d6a229]"
                                    >
                                        Aliens HUB
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <Link
                            href="/blog"
                            className="font-inter nav-underline relative text-[16px] font-semibold text-white"
                        >
                            Blogs
                        </Link>

                        <Link
                            href="/contact"
                            className="font-inter nav-underline relative text-[16px] font-semibold text-white"
                        >
                            Contact us
                        </Link>

                        <button
                            type="button"
                            onClick={() => {
                                setMobileProjectsOpen(false);
                                setMenuOpen(true);
                            }}
                            aria-label="Open menu"
                            aria-expanded={menuOpen}
                            className="flex h-[42px] w-[46px] items-center justify-center bg-[#555]"
                        >
                            <span className="flex flex-col gap-[5px]">
                                <span className="h-[2px] w-[24px] bg-white" />
                                <span className="h-[2px] w-[24px] bg-white" />
                                <span className="h-[2px] w-[24px] bg-white" />
                            </span>
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setMobileProjectsOpen(false);
                            setMenuOpen(true);
                        }}
                        aria-label="Open menu"
                        aria-expanded={menuOpen}
                        className="flex h-[36px] w-[40px] items-center justify-center bg-white/30 md:hidden"
                    >
                        <span className="flex flex-col gap-[5px]">
                            <span className="h-[2px] w-[24px] bg-white" />
                            <span className="h-[2px] w-[24px] bg-white" />
                            <span className="h-[2px] w-[24px] bg-white" />
                        </span>
                    </button>
                </nav>
            </header>

            {/* FULLSCREEN MENU */}
            <div
                id="fullscreen-navigation"
                aria-hidden={!menuOpen}
                inert={!menuOpen}
                className={`fixed inset-0 z-[200] bg-black text-white transition-transform duration-[750ms] ease-[cubic-bezier(0.77,0,0.175,1)] ${menuOpen ? "translate-y-0" : "-translate-y-full"
                    }`}
            >
                <div className="relative h-full min-h-full w-full overflow-hidden">
                    <div className="absolute left-[4.2vw] top-[5.8vh]">
                        <Link
                            href="/"
                            onClick={() => setMenuOpen(false)}
                        >
                            <Image
                                src="/images/navbar/logo.svg"
                                alt="Aliens Group"
                                width={203}
                                height={56}
                                priority
                                className="object-contain"
                                style={{ height: "auto" }}
                            />
                        </Link>
                    </div>

                    <nav
                        aria-label="More navigation links"
                        className="absolute left-[3.1vw] top-[20.5vh] hidden flex-col gap-[10px] text-[32px] font-light leading-[1.25] md:flex md:text-[36px] lg:text-[37px]"
                    >
                        <button
                            type="button"
                            onClick={() => {
                                setMenuOpen(false);
                                setNewsletterOpen(true);
                            }}
                            className="text-left"
                        >
                            Newsletter
                        </button>

                        <Link
                            href="/leadership"
                            onClick={() => setMenuOpen(false)}
                        >
                            Our Leaders
                        </Link>

                        <Link
                            href="/customers"
                            onClick={() => setMenuOpen(false)}
                        >
                            Customers
                        </Link>

                        <Link
                            href="/construction"
                            onClick={() => setMenuOpen(false)}
                        >
                            Construction Updates
                        </Link>
                    </nav>

                    <div className="absolute bottom-[6.2vh] left-[3.1vw] flex flex-col gap-[7px] text-[16px] font-light leading-[1.2] md:text-[17px]">
                        <button
                            type="button"
                            onClick={() => openForm("site-visit")}
                            className="text-left"
                        >
                            SCHEDULE A SITE VISIT
                        </button>

                        <button
                            type="button"
                            onClick={() => openForm("enquire")}
                            className="text-left"
                        >
                            ENQUIRE
                        </button>

                        <button
                            type="button"
                            onClick={() => openForm("reach-us")}
                            className="text-left"
                        >
                            REACH US
                        </button>
                    </div>

                    <div className="absolute right-[3.1vw] top-[18vh] hidden w-[53vw] max-w-[950px] md:block">
                        <div className="relative aspect-[16/9] w-full">
                            <Image
                                src="/images/navbar/menu-building.png"
                                alt="Aliens Group building architectural sketch"
                                fill
                                priority
                                sizes="55vw"
                                className="object-contain object-center"
                            />
                        </div>
                    </div>

                    <div className="absolute bottom-[6.5vh] right-[3.1vw] hidden text-right md:block">
                        <p className="mb-[4px] pr-[13.9rem] font-lato text-[25px] font-light leading-none text-[#9b9b9b] lg:pr-[14.3rem]">
                            Experience
                        </p>

                        <p className="bg-gradient-to-r from-[#008edb] via-[#e50072] to-[#ff7a00] bg-clip-text font-lato text-[58px] font-normal leading-[0.95] text-transparent lg:text-[62px]">
                            The Urban Paradise
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setMenuOpen(false)}
                        aria-label="Close menu"
                        className="absolute right-[2.2vw] top-[2.8vh] z-30 text-white transition-transform duration-300 hover:scale-110"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                        </svg>
                    </button>

                    {/* MOBILE MENU */}
                    <nav className="absolute left-6 right-6 top-28 flex max-h-[calc(100dvh-190px)] flex-col gap-3 overflow-y-auto pb-4 text-xl font-light md:hidden">
                        <Link
                            href="/projects"
                            onClick={() => setMenuOpen(false)}
                        >
                            Our Projects
                        </Link>

                        <button
                            type="button"
                            onClick={() =>
                                setMobileProjectsOpen((open) => !open)
                            }
                            className="text-left"
                        >
                            {mobileProjectsOpen
                                ? "Hide project categories −"
                                : "Project categories +"}
                        </button>

                        {mobileProjectsOpen && (
                            <div className="flex flex-col gap-2 pl-4 text-base">
                                {[
                                    { name: "Residential", href: "/residential" },
                                    { name: "Aliens HUB", href: "/alienshub/overview" },
                                ].map((category) => (
                                    <Link
                                        key={category.name}
                                        href={category.href}
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        {category.name}
                                    </Link>
                                ))}
                            </div>
                        )}

                        <Link
                            href="/blog"
                            onClick={() => setMenuOpen(false)}
                        >
                            Blogs
                        </Link>

                        <Link
                            href="/contact"
                            onClick={() => setMenuOpen(false)}
                        >
                            Contact us
                        </Link>

                        <button
                            type="button"
                            onClick={() => {
                                setMenuOpen(false);
                                setNewsletterOpen(true);
                            }}
                            className="text-left"
                        >
                            Newsletter
                        </button>

                        <Link
                            href="/leadership"
                            onClick={() => setMenuOpen(false)}
                        >
                            Our Leaders
                        </Link>

                        <Link
                            href="/customers"
                            onClick={() => setMenuOpen(false)}
                        >
                            Customers
                        </Link>

                        <Link
                            href="/construction"
                            onClick={() => setMenuOpen(false)}
                        >
                            Construction Updates
                        </Link>

                        <button
                            type="button"
                            onClick={() => openForm("site-visit")}
                            className="mt-4 text-left text-sm"
                        >
                            SCHEDULE A SITE VISIT
                        </button>

                        <button
                            type="button"
                            onClick={() => openForm("enquire")}
                            className="text-left text-sm"
                        >
                            ENQUIRE
                        </button>

                        <button
                            type="button"
                            onClick={() => openForm("reach-us")}
                            className="text-left text-sm"
                        >
                            REACH US
                        </button>
                    </nav>
                </div>
            </div>

            {/* SITE VISIT / ENQUIRE / REACH US FORM */}
            {formModal && (
                <div
                    className="fixed inset-0 z-[400] flex items-center justify-center bg-black/70 px-3 py-4 backdrop-blur-[2px] sm:px-4"
                    onClick={(event) => {
                        if (
                            event.target === event.currentTarget &&
                            !submitting
                        ) {
                            setFormModal(null);
                        }
                    }}
                >
                    <div className="relative max-h-[calc(100dvh-2rem)] w-full max-w-[560px] overflow-y-auto bg-[#8f8f8f]/95 px-5 pb-8 pt-12 shadow-2xl sm:px-8 sm:pb-10 md:px-12">
                        <button
                            type="button"
                            onClick={() => {
                                if (!submitting) setFormModal(null);
                            }}
                            aria-label="Close form"
                            className="absolute right-5 top-4 flex h-[43px] w-[43px] items-center justify-center rounded-full border border-[#eee] text-[36px] font-light leading-none text-white sm:right-7 sm:top-7"
                        >
                            ×
                        </button>

                        <h2 className="mb-7 text-center font-serif text-[30px] text-white md:text-[34px]">
                            {getFormTitle()}
                        </h2>

                        <form
                            onSubmit={handleFormSubmit}
                            className="flex flex-col"
                        >
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleFormChange}
                                placeholder="Your Name"
                                autoComplete="name"
                                required
                                minLength={2}
                                className="h-[58px] border-b border-white bg-transparent text-[18px] text-white outline-none placeholder:text-white"
                            />

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleFormChange}
                                placeholder="Your Email"
                                autoComplete="email"
                                required
                                className="h-[65px] border-b border-white bg-transparent text-[18px] text-white outline-none placeholder:text-white"
                            />

                            <select
                                name="projectName"
                                value={formData.projectName}
                                onChange={handleFormChange}
                                required
                                className="h-[65px] border-b border-white bg-transparent text-[18px] text-white outline-none"
                            >
                                <option
                                    value="Residential (Space Station)"
                                    className="text-black"
                                >
                                    Residential (Space Station)
                                </option>
                                <option
                                    value="Aliens Hub"
                                    className="text-black"
                                >
                                    Aliens Hub
                                </option>
                                <option
                                    value="Other"
                                    className="text-black"
                                >
                                    Other
                                </option>
                            </select>

                            <div className="flex h-[65px] border-b border-white">
                                <select
                                    name="countryCode"
                                    value={formData.countryCode}
                                    onChange={handleFormChange}
                                    aria-label="Country calling code"
                                    className="w-[85px] shrink-0 bg-transparent text-[16px] text-white outline-none sm:w-[100px] sm:text-[18px]"
                                >
                                    <option
                                        value="+91"
                                        className="text-black"
                                    >
                                        +91
                                    </option>
                                    <option
                                        value="+1"
                                        className="text-black"
                                    >
                                        +1
                                    </option>
                                    <option
                                        value="+44"
                                        className="text-black"
                                    >
                                        +44
                                    </option>
                                    <option
                                        value="+61"
                                        className="text-black"
                                    >
                                        +61
                                    </option>
                                </select>

                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleFormChange}
                                    placeholder="Enter Phone Number"
                                    autoComplete="tel-national"
                                    required
                                    minLength={7}
                                    maxLength={15}
                                    className="min-w-0 flex-1 bg-transparent text-[18px] text-white outline-none placeholder:text-white"
                                />
                            </div>

                            <label className="mt-6 flex cursor-pointer items-start gap-3 text-[14px] leading-6 text-white">
                                <input
                                    type="checkbox"
                                    defaultChecked
                                    className="mt-1 h-[20px] w-[20px] shrink-0 accent-[#e6d9b8]"
                                />
                                <span>
                                    Yes, I would like to receive updates and
                                    promotional offers from Aliens Group.
                                </span>
                            </label>

                            {formStatus && (
                                <p
                                    role="status"
                                    aria-live="polite"
                                    className={`mt-4 text-center text-sm ${formError
                                        ? "text-red-100"
                                        : "text-white"
                                        }`}
                                >
                                    {formStatus}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="mx-auto mt-8 flex h-[58px] w-[180px] items-center justify-center gap-3 border border-white text-[20px] text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {submitting ? "Submitting..." : "Submit"}
                                {!submitting && (
                                    <span className="text-[27px]">→</span>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* NEWSLETTER MODAL */}
            {newsletterOpen && (
                <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/85 px-2 py-3 sm:px-3">
                    <div className="relative h-[94dvh] w-full max-w-[1070px] overflow-hidden rounded-lg bg-white">
                        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 sm:h-[82px] sm:px-5 md:px-7">
                            <h2 className="font-serif text-xl text-black sm:text-[30px] md:text-[34px]">
                                Aliens Newsletter
                            </h2>

                            <button
                                type="button"
                                onClick={() => setNewsletterOpen(false)}
                                aria-label="Close newsletter"
                                className="text-[40px] font-light leading-none text-black"
                            >
                                ×
                            </button>
                        </div>

                        <div className="h-[calc(100%-64px)] bg-[#333] sm:h-[calc(100%-82px)]">
                            <iframe
                                src="/videos/news_sletter.pdf"
                                title="Aliens Newsletter"
                                className="h-full w-full border-0"
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
