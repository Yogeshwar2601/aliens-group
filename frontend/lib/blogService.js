import api from "@/lib/api";

export async function getBlogs(filters = {}, { signal } = {}) {
    const response = await api.get("/blogs", {
        params: filters,
        signal,
    });

    return response.data;
}

export async function getBlogBySlug(slug, { signal } = {}) {
    const response = await api.get(`/blogs/${encodeURIComponent(slug)}`, {
        signal,
    });

    return response.data.data;
}
