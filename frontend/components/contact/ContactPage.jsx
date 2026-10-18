
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import api from "@/lib/api";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import Animation from "./Animation";

function MailIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
        </svg>
    );
}

function OfficeIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 21V6l8-3v18" />
            <path d="M12 21h8V9l-8-3" />
            <path d="M7 9h2M7 13h2M7 17h2M15 12h2M15 16h2" />
        </svg>
    );
}

function PhoneIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 3.08 5.18 2 2 0 0 1 5.06 3h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L9 10.73a16 16 0 0 0 4.27 4.27l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
        </svg>
    );
}

export default function ContactPage() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        propertyType: "",
        message: "",
    });

    const [status, setStatus] = useState("");
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus("");
        setIsError(false);

        try {
            await api.post("/enquiries", {
                ...formData,
                phone: formData.phone.trim(),
                source: "contact",
            });

            setStatus("Your enquiry has been submitted successfully.");
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                propertyType: "",
                message: "",
            });
        } catch (error) {
            setIsError(true);
            setStatus(
                error.response?.data?.message ||
                "Unable to submit your enquiry. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />

            <Animation as="main" className="bg-white pt-28">
                <div className="mx-auto max-w-[1050px] px-6">
                    <div className="mb-7 flex items-center gap-3 text-[16px]">
                        <Link href="/" className="text-[#315b82] transition-colors hover:text-black">
                            Home
                        </Link>
                        <span className="text-[#315b82]">»</span>
                        <span className="font-semibold text-black">Contact us</span>
                    </div>
                </div>

                <section data-reveal="up" className="mx-auto max-w-[1050px] px-4 pb-8 sm:px-6">
                    <div className="grid grid-cols-1 gap-8 sm:gap-14 lg:grid-cols-[1.08fr_0.92fr]">
                        <div className="relative h-[min(72vw,360px)] min-h-[240px] overflow-hidden sm:h-[420px] lg:h-[620px]">
                            <Image
                                src="/images/contact/sidePicture.png"
                                alt="Aliens Group property"
                                fill
                                priority
                                className="object-cover"
                            />
                        </div>

                        <div>
                            <h1 className="mb-6 text-[30px] font-semibold leading-tight text-[#071b35] sm:mb-8 sm:text-[38px]">
                                Contact Us
                            </h1>

                            <form className="space-y-5" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="firstName" className="mb-2 block text-[16px] font-semibold">
                                            First Name
                                        </label>
                                        <input
                                            id="firstName"
                                            name="firstName"
                                            type="text"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            placeholder="First name"
                                            required
                                            maxLength={100}
                                            className="h-[42px] w-full rounded border border-[#999] px-4 text-[16px] outline-none placeholder:text-[#718096] focus:border-black"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="lastName" className="mb-2 block text-[16px] font-semibold">
                                            Last Name
                                        </label>
                                        <input
                                            id="lastName"
                                            name="lastName"
                                            type="text"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            placeholder="Last name"
                                            maxLength={100}
                                            className="h-[42px] w-full rounded border border-[#999] px-4 text-[16px] outline-none placeholder:text-[#718096] focus:border-black"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="mb-2 block text-[16px] font-semibold">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#718096]">
                                            <MailIcon />
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Your email"
                                            required
                                            maxLength={254}
                                            className="h-[42px] w-full rounded border border-[#999] pl-11 pr-4 text-[16px] outline-none placeholder:text-[#718096] focus:border-black"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="phone" className="mb-2 block text-[16px] font-semibold">
                                        Phone Number
                                    </label>
                                    <div className="flex h-[42px] min-w-0 overflow-hidden rounded border border-[#999]">
                                        <span className="flex w-[118px] flex-shrink-0 items-center border-r border-[#999] bg-white px-2 text-sm sm:w-[135px] sm:px-3 sm:text-[16px]">
                                            +91 / India
                                        </span>
                                        <input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Phone number"
                                            required
                                            minLength={7}
                                            maxLength={15}
                                            className="min-w-0 flex-1 px-3 text-sm outline-none placeholder:text-[#718096] sm:px-4 sm:text-[16px]"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="propertyType" className="mb-2 block text-[16px] font-semibold">
                                        Property Type
                                    </label>
                                    <select
                                        id="propertyType"
                                        name="propertyType"
                                        value={formData.propertyType}
                                        onChange={handleChange}
                                        className="h-[42px] w-full rounded border border-[#999] bg-white px-4 text-[16px] text-[#111] outline-none"
                                    >
                                        <option value="">Select property type ...</option>
                                        <option value="Residential">Residential</option>
                                        <option value="Luxury Golf Villa Hill Township">
                                            Luxury Golf Villa Hill Township
                                        </option>
                                        <option value="Commercial">Commercial</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="message" className="mb-2 block text-[16px] font-semibold">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={4}
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Type your message here ..."
                                        maxLength={2000}
                                        className="w-full resize-none rounded border border-[#999] px-4 py-4 text-[16px] outline-none placeholder:text-[#718096] focus:border-black"
                                    />
                                </div>

                                {status && (
                                    <p
                                        role="status"
                                        aria-live="polite"
                                        className={`text-sm ${isError ? "text-red-600" : "text-green-700"}`}
                                    >
                                        {status}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="h-[55px] w-full rounded border border-[#999] bg-white text-[16px] font-semibold transition-colors hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loading ? "Submitting..." : "Submit Form →"}
                                </button>
                            </form>
                        </div>
                    </div>
                </section>

                <section data-reveal="up" className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 sm:py-16">
                    <h2 className="mb-10 text-[30px] font-normal text-black sm:mb-16 sm:text-[38px]">
                        Reach Out To Us
                    </h2>

                    <div className="grid grid-cols-1 gap-10 sm:gap-14 md:grid-cols-3">
                        <div>
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#e8e8e8]">
                                <MailIcon />
                            </div>
                            <h3 className="mb-5 text-[21px] font-semibold">Email Support</h3>
                            <div className="space-y-4 text-[17px]">
                                <p>aliens@aliensgroup.in</p>
                                <p>marketing@aliensgroup.in</p>
                                <p>sales@aliensgroup.in</p>
                            </div>
                        </div>

                        <div>
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#e8e8e8]">
                                <OfficeIcon />
                            </div>
                            <h3 className="mb-5 text-[21px] font-semibold">Visit Our Office</h3>
                            <p className="text-[17px]">Gachibowli Tellapur, Hyderabad</p>
                        </div>

                        <div>
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#e8e8e8]">
                                <PhoneIcon />
                            </div>
                            <h3 className="mb-5 text-[21px] font-semibold">Call Us Directly</h3>
                            <div className="flex flex-col gap-2 text-[16px] sm:flex-row sm:gap-8 sm:text-[17px]">
                                <div className="space-y-4">
                                    <p>+91-9966234127</p>
                                    <p>+91-7330640040</p>
                                </div>
                                <p className="self-center text-[#718096]">(11 am - 8 pm IST)</p>
                            </div>
                        </div>
                    </div>
                </section>
            </Animation>

            <Footer />
        </>
    );
}
