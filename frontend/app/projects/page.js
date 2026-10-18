import Navbar from "@/components/navbar/Navbar";
import Projects from "@/components/projects/Projects";
import Footer from "@/components/footer/Footer";

export const metadata = {
    title: "Our Projects | Aliens Group",
    description: "Explore residential, luxury, golf villa, and township projects by Aliens Group.",
};

export default function ProjectsPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-[#f7f5f0] pt-16 md:pt-[74px]">
                <Projects />
            </main>
            <Footer />
        </>
    );
}
