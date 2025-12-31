import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: "uploads/seller_licenses",
    filename: (_, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
