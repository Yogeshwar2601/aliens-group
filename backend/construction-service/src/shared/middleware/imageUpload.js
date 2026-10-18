import multer from "multer";

const allowedMimeTypes = new Set([
    "image/avif",
    "image/gif",
    "image/jpeg",
    "image/png",
    "image/webp",
]);

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 21,
        fields: 100,
        fieldSize: 1024 * 1024,
    },
    fileFilter(req, file, callback) {
        if (!allowedMimeTypes.has(file.mimetype)) {
            const error = new Error(
                "Only JPEG, PNG, WebP, GIF, and AVIF images are supported"
            );
            error.status = 400;
            callback(error);
            return;
        }

        callback(null, true);
    },
});

export function imageUpload(fields) {
    return (req, res, next) => {
        upload.fields(fields)(req, res, (error) => {
            if (error) {
                const status =
                    error.code === "LIMIT_FILE_SIZE" ||
                    error.code === "LIMIT_FILE_COUNT"
                        ? 413
                        : error.status || 400;

                res.status(status).json({
                    success: false,
                    message: error.message,
                });
                return;
            }

            next();
        });
    };
}

const allowedConstructionMediaTypes = new Set([
    ...allowedMimeTypes,
    "video/mp4",
    "video/quicktime",
    "video/webm",
]);

const constructionUpload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 100 * 1024 * 1024,
        files: 22,
        fields: 100,
        fieldSize: 1024 * 1024,
    },
    fileFilter(req, file, callback) {
        if (!allowedConstructionMediaTypes.has(file.mimetype)) {
            const error = new Error(
                "Construction media must be a supported image or MP4, MOV, or WebM video"
            );
            error.status = 400;
            callback(error);
            return;
        }

        callback(null, true);
    },
});

export function constructionMediaUpload(fields) {
    return (req, res, next) => {
        constructionUpload.fields(fields)(req, res, (error) => {
            if (error) {
                const status =
                    error.code === "LIMIT_FILE_SIZE" ||
                    error.code === "LIMIT_FILE_COUNT"
                        ? 413
                        : error.status || 400;

                res.status(status).json({
                    success: false,
                    message: error.message,
                });
                return;
            }

            const oversizedImage = Object.entries(req.files || {}).some(
                ([fieldName, files]) =>
                    fieldName !== "video" &&
                    files.some((file) => file.size > 10 * 1024 * 1024)
            );

            if (oversizedImage) {
                res.status(413).json({
                    success: false,
                    message: "Construction photos must be 10 MB or smaller",
                });
                return;
            }

            next();
        });
    };
}

const jsonFields = new Set([
    "amenities",
    "amenityDetails",
    "gallery",
    "growthAxis",
    "highlights",
    "layouts",
    "nearbyPlaces",
    "tags",
]);
const booleanFields = new Set(["featured", "published"]);

export function normalizeMultipartFields(req, res, next) {
    if (!req.is("multipart/form-data")) {
        next();
        return;
    }

    try {
        for (const [fieldName, value] of Object.entries(req.body || {})) {
            if (jsonFields.has(fieldName) && typeof value === "string") {
                req.body[fieldName] = JSON.parse(value);
            } else if (booleanFields.has(fieldName) && typeof value === "string") {
                if (value !== "true" && value !== "false") {
                    throw new Error(`"${fieldName}" must be "true" or "false"`);
                }
                req.body[fieldName] = value === "true";
            } else if (
                fieldName === "progressPercent" &&
                typeof value === "string"
            ) {
                req.body[fieldName] = value === "" ? null : Number(value);
            }
        }

        next();
    } catch (error) {
        res.status(400).json({
            success: false,
            message: `Invalid multipart field: ${error.message}`,
        });
    }
}
