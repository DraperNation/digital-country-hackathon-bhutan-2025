import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import mime from 'mime-types';

const s3 = new S3Client({
  region: process.env.MINIO_REGION,
  endpoint: process.env.MINIO_ENDPOINT,
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY!,
    secretAccessKey: process.env.MINIO_SECRET_KEY!,
  },
  forcePathStyle: true,
});

export async function uploadToMinio(file: Express.Multer.File, folder: string) {
  const ext = mime.extension(file.mimetype) || 'bin';
  const key = `${folder}/${uuidv4()}.${ext}`;
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.MINIO_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
  );
  return key;
}

export function getMinioFileUrl(key: string) {
  return `${process.env.MINIO_ENDPOINT}/${process.env.MINIO_BUCKET}/${key}`;
}

export async function deleteObjectCommand(key: string) {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: process.env.MINIO_BUCKET,
      Key: key,
    })
  );
}
