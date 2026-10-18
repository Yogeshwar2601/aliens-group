import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { fileTypeFromBuffer } from "file-type";
import { randomUUID } from "node:crypto";

const allowedImageTypes = new Set([
    "image/avif",
    "image/gif",
    "image/jpeg",
    "image/png",
    "image/webp",
]);
const allowedVideoTypes = new Set([
    "video/mp4",
    "video/quicktime",
    "video/webm",
]);

let s3Client;

function getS3Config() {
    const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_S3_BUCKET_NAME } =
        process.env;

    if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_REGION || !AWS_S3_BUCKET_NAME) {
        throw new Error(
            "AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, and AWS_S3_BUCKET_NAME must be configured"
        );
    }

    const regionMatch = AWS_REGION.trim().match(
        /\b[a-z]{2}(?:-[a-z0-9]+)+-\d+\b/i
    );

    if (!regionMatch) {
        throw new Error(
            "AWS_REGION must contain an AWS region code, for example us-east-1"
        );
    }

    const region = regionMatch[0].toLowerCase();

    if (region !== AWS_REGION.trim().toLowerCase()) {
        console.warn(
            `AWS_REGION includes a region label; using the region code "${region}". Set AWS_REGION to the code only.`
        );
    }

    return {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
        region,
        bucketName: AWS_S3_BUCKET_NAME,
    };
}

function getS3Client(region) {
    if (!s3Client) {
        const { accessKeyId, secretAccessKey } = getS3Config();
        s3Client = new S3Client({
            region,
            credentials: { accessKeyId, secretAccessKey },
        });
    }

    return s3Client;
}

function getPublicUrl(key, bucketName, region) {
    const configuredBaseUrl = process.env.AWS_S3_PUBLIC_URL?.replace(/\/+$/, "");
    const baseUrl =
        configuredBaseUrl || `https://${bucketName}.s3.${region}.amazonaws.com`;
    const encodedKey = key.split("/").map(encodeURIComponent).join("/");

    return `${baseUrl}/${encodedKey}`;
}

async function uploadFiles(filesByField, namespace, { allowVideos = false } = {}) {
    if (!filesByField || Object.values(filesByField).every((files) => !files?.length)) {
        return { fields: {}, keys: [] };
    }

    const verifiedFiles = {};
    for (const [fieldName, files] of Object.entries(filesByField)) {
        verifiedFiles[fieldName] = [];

        for (const file of files || []) {
            const detectedType = await fileTypeFromBuffer(file.buffer);
            const allowedTypes =
                allowVideos && fieldName === "video"
                    ? allowedVideoTypes
                    : allowedImageTypes;

            if (
                !detectedType ||
                !allowedTypes.has(detectedType.mime) ||
                detectedType.mime !== file.mimetype
            ) {
                const error = new Error(
                    `The uploaded file in "${fieldName}" is not a supported ${
                        fieldName === "video" ? "video" : "image"
                    }`
                );
                error.status = 400;
                throw error;
            }

            verifiedFiles[fieldName].push({ file, detectedType });
        }
    }

    const { bucketName, region } = getS3Config();
    const client = getS3Client(region);
    const fields = {};
    const uploadedKeys = [];

    try {
        for (const [fieldName, files] of Object.entries(verifiedFiles)) {
            fields[fieldName] = [];

            for (const { file, detectedType } of files) {
                const mediaNamespace =
                    allowVideos && fieldName === "video"
                        ? `${namespace}/videos`
                        : allowVideos
                            ? `${namespace}/images`
                            : namespace;
                const key = `${mediaNamespace}/${randomUUID()}.${detectedType.ext}`;

                await client.send(
                    new PutObjectCommand({
                        Bucket: bucketName,
                        Key: key,
                        Body: file.buffer,
                        ContentType: detectedType.mime,
                        CacheControl: "public, max-age=31536000, immutable",
                    })
                );

                uploadedKeys.push(key);
                fields[fieldName].push(getPublicUrl(key, bucketName, region));
            }
        }
    } catch (error) {
        await deleteUploadedImages(uploadedKeys);
        throw error;
    }

    return { fields, keys: uploadedKeys };
}

export function uploadImages(filesByField, namespace) {
    return uploadFiles(filesByField, namespace);
}

export function uploadConstructionMedia(filesByField) {
    return uploadFiles(filesByField, "construction-updates", {
        allowVideos: true,
    });
}

export async function deleteUploadedImages(keys) {
    if (!keys?.length) return;

    const { bucketName, region } = getS3Config();
    const client = getS3Client(region);
    const results = await Promise.allSettled(
        keys.map((Key) =>
            client.send(new DeleteObjectCommand({ Bucket: bucketName, Key }))
        )
    );

    results.forEach((result, index) => {
        if (result.status === "rejected") {
            console.error(
                `Failed to remove unreferenced S3 object "${keys[index]}":`,
                result.reason
            );
        }
    });
}
