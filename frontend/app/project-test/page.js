import { getProjects } from "@/lib/projectService";

export default async function ProjectsTestPage() {
    let projects = [];
    let error = "";

    try {
        projects = await getProjects();
    } catch {
        error = "Unable to fetch projects. Check whether the backend is running.";
    }

    return (
        <main className="min-h-screen p-10">
            <h1 className="mb-6 text-3xl font-bold">
                Projects API Test
            </h1>

            {error && <p className="text-red-600">{error}</p>}

            {!error && projects.length === 0 && (
                <p>No published projects found in the database.</p>
            )}

            <div className="grid gap-6 md:grid-cols-3">
                {projects.map((project) => (
                    <article
                        key={project._id}
                        className="rounded-lg border p-4"
                    >
                        {project.image && (
                            <img
                                src={project.image}
                                alt={project.name}
                                className="mb-4 h-48 w-full rounded object-cover"
                            />
                        )}

                        <h2 className="text-xl font-semibold">
                            {project.name}
                        </h2>

                        <p>{project.location}</p>
                        <p>{project.category}</p>
                    </article>
                ))}
            </div>
        </main>
    );
}