import ProjectDetails from "@/components/projects/ProjectDetails";

export default async function ProjectPage({ params }) {
    const { slug } = await params;

    return <ProjectDetails slug={slug} />;
}
