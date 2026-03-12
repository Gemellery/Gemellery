import multer from "multer";
import multerS3 from "multer-s3";
import { s3, BUCKET_NAME } from "../config/s3";

const getFolder = (fieldname: string) => {
    switch (fieldname) {
        case "seller_license":
            return "seller_licenses";

        case "certificate":
            return "gem_certificates";

        case "images":
            return "gem_images";

        case "blog_image":
            return "blog_images";

        default:
            return "others";
    }
};

export const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: BUCKET_NAME,

        contentType: multerS3.AUTO_CONTENT_TYPE,

        key: (req, file, cb) => {
            const folder = getFolder(file.fieldname);

            const unique =
                Date.now() + "-" + Math.round(Math.random() * 1e9);

            const filename = `${folder}/${unique}-${file.originalname}`;

            cb(null, filename);
        },
    }),

    limits: {
        fileSize: 15 * 1024 * 1024,
    },

    fileFilter: (req, file, cb) => {
        if (file.fieldname === "certificate") {
            return /pdf|jpg|jpeg|png/.test(file.mimetype)
                ? cb(null, true)
                : cb(new Error("Invalid certificate file"));
        }

        if (file.fieldname === "images") {
            return /jpg|jpeg|png|webp/.test(file.mimetype)
                ? cb(null, true)
                : cb(new Error("Invalid image file"));
        }

        if (file.fieldname === "seller_license") {
            return /pdf|jpg|jpeg|png/.test(file.mimetype)
                ? cb(null, true)
                : cb(new Error("Invalid seller license file"));
        }

        if (file.fieldname === "blog_image") {
            return /jpg|jpeg|png|webp/.test(file.mimetype)
                ? cb(null, true)
                : cb(new Error("Invalid blog image file"));
        }

        cb(new Error("Unsupported file field"));
    },
});