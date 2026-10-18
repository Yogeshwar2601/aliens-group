import api from "@/lib/api";

export async function getConstructionGallery(filters, options = {}) {
    const response = await api.get("/construction-updates/gallery", {
        params: filters,
        ...options,
    });

    return response.data;
}
