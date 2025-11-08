import multer from 'multer';
import path from 'path';
import fs from 'fs';

const deleteFile = (filepath) => {
    try {
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }
    } catch (error) {
        console.error('Error deleting file: ', error);
    }
};

const storage = multer.diskStorage({
    destination: function (request, file, callback) {
        const uploadDirectory = path.join(process.cwd(), 'uploads');

        if (!fs.existsSync(uploadDirectory)) {
            fs.mkdirSync(uploadDirectory, { recursive: true });
        }

        callback(null, uploadDirectory);
    },
    filename: function (request, file, callback) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);

        callback(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const createUploadConfig = (allowedTypes, maxSize, allowedExtensionText) => ({
    storage: storage,
    fileFilter: function (request, file, callback) {
        if (!allowedTypes.includes(file.mimetype)) {
            return callback(new Error(`Only ${allowedExtensionText} files are allowed`));
        }

        callback(null, true);
    },
    limits: {
        fileSize: maxSize,
    },
});

const imageUploadConfig = createUploadConfig(
    ['image/jpeg', 'image/jpg', 'image/png'],
    5 * 1024 * 1024,
    'JPG, JPEG, and PNG'
)

const documentUploadConfig = createUploadConfig(
    ["image/jpeg", "image/png", "image/jpg", "application/pdf", "application/msword"],
    10 * 1024 * 1024,
    "JPG, JPEG, PNG, PDF, and DOC"
);

const createUploadWrapper = (uploadConfig, fieldName) => {
    const upload = multer(uploadConfig).single(fieldName);

    return (request, response, next) => {
        upload(request, response, (error) => {
            if (error && request.file?.path) {
                deleteFile(request.file.path)
            }
            next(error)
        })
    }
};

export const createImageUpload = (fieldName) => {
    return createUploadWrapper(imageUploadConfig, fieldName)
};

export const createDocumentUpload = (fieldName) => {
    return createUploadWrapper(documentUploadConfig, fieldName)
};

export const cleanupFile = (file) => {
    if (file && file.path) {
        deleteFile(file.path)
    }
};