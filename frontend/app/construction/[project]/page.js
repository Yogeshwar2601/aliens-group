import { notFound } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import ConstructionGallery from "@/components/construction/ConstructionGallery";

const constructionProjects = {
    hub: {
        projectSlug: "aliens-hub",
        projectName: "Aliens HUB",
    },
    "space-station": {
        projectSlug: "aliens-space-station",
        projectName: "Aliens Space Station",
    },
};

export async function generateMetadata({ params }) {
    const { project } = await params;
    const constructionProject = constructionProjects[project];

    return {
        title: constructionProject
            ? `${constructionProject.projectName} Construction Updates | Aliens Group`
            : "Construction Updates | Aliens Group",
    };
}

export default async function ProjectConstructionPage({ params }) {
    const { project } = await params;
    const constructionProject = constructionProjects[project];

    if (!constructionProject) notFound();

    return (
        <>
            <Navbar />
            <ConstructionGallery {...constructionProject} />
            <Footer />
        </>
    );
}
