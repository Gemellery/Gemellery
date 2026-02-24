import multer from "multer";
import path from "path";
import fs from "fs";

const getDestination = (fieldname: string) => {
    switch (fieldname) {
        case "seller_license":
            return "uploads/seller_licenses";

        case "certificate":
            return "uploads/gem_certificates";

        case "images":
            return "uploads/gem_images";

        case "blog_image":
            return "uploads/blog_images";

        default:
            return "uploads/others";
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = getDestination(file.fieldname);

        // Ensure folder exists
        fs.mkdirSync(dir, { recursive: true });

        cb(null, dir);
    },

    filename: (_, file, cb) => {
        const unique =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
    },
});

const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
    // Certificate rules
    if (file.fieldname === "certificate") {
        return /pdf|jpg|jpeg|png/.test(file.mimetype)
            ? cb(null, true)
            : cb(new Error("Invalid certificate file"));
    }

    // Gem images rules
    if (file.fieldname === "images") {
        return /jpg|jpeg|png|webp/.test(file.mimetype)
            ? cb(null, true)
            : cb(new Error("Invalid image file"));
    }

    // Seller license rules
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
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 15 * 1024 * 1024, // 15MB or each
    }
});
