
export class Project {
    constructor({
        name,
        slug,
        category,
        location,
        status = "Ongoing",
        description = "",
        areaRange = "",
        communityType = "",
        highlights = [],
        unitTypes = [],
        designFeatures = [],
        growthAxis = [],
        layouts = [],
        amenityDetails = [],
        nearbyPlaces = [],
        mapUrl = "",
        image = "",
        gallery = [],
        brochureUrl = "",
        amenities = [],
        featured = false,
    }) {
        this.name = name;
        this.slug = slug;
        this.category = category;
        this.location = location;
        this.status = status;
        this.description = description;
        this.areaRange = areaRange;
        this.communityType = communityType;
        this.highlights = highlights;
        this.unitTypes = unitTypes;
        this.designFeatures = designFeatures;
        this.growthAxis = growthAxis;
        this.layouts = layouts;
        this.amenityDetails = amenityDetails;
        this.nearbyPlaces = nearbyPlaces;
        this.mapUrl = mapUrl;
        this.image = image;
        this.gallery = gallery;
        this.brochureUrl = brochureUrl;
        this.amenities = amenities;
        this.featured = featured;
    }
}
