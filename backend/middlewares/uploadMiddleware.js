import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/courses';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.fieldname === "video") {
        if (!file.originalname.match(/\.(mp4|mkv|mov|avi)$/)) {
            return cb(new Error('Please upload a video file'), false);
        }
    } else if (file.fieldname === "pdf") {
        if (!file.originalname.match(/\.(pdf)$/)) {
            return cb(new Error('Please upload a PDF file'), false);
        }
    }
    cb(null, true);
};

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit
    }
});
