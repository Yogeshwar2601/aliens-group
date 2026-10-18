export class ConstructionUpdate {
    constructor({
        projectSlug = "",
        projectName,
        title,
        description = "",
        milestone = "",
        progressPercent = null,
        updateDate,
        imageUrl = "",
        gallery = [],
        videoUrl = "",
        published = true,
    }) {
        this.projectSlug = projectSlug;
        this.projectName = projectName;
        this.title = title;
        this.description = description;
        this.milestone = milestone;
        this.progressPercent = progressPercent;
        this.updateDate = updateDate;
        this.imageUrl = imageUrl;
        this.gallery = gallery;
        this.videoUrl = videoUrl;
        this.published = published;
    }
}
