import { createUploadthing, type FileRouter } from "uploadthing/server";

const f = createUploadthing();

export const uploadRouter = {
    avatarUpload: f({ image: { maxFileSize: "4MB" } }).onUploadComplete(async ({ file }) => {
        return { url: `https://utfs.io/f/${file.key}` };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
