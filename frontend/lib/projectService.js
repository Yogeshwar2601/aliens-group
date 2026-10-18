import api from "@/lib/api";
export async function getProjects(filters = {}) {
    const response = await api.get("/projects", {
        params: filters,
    });

    return response.data.data;
}

export async function getProjectCategories() {
    const response = await api.get("/projects/categories");

    return response.data.data;
}

export async function getProjectBySlug(slug, options = {}) {
    const response = await api.get(
        `/projects/${encodeURIComponent(slug)}`,
        options
    );

    return response.data.data;
}