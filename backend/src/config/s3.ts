import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
  },
});

export const BUCKET_NAME = "gemellery-assets-2026";