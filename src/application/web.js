import express from 'express';
import path from 'path';
import fs from 'fs';
import { publicRouter } from '../route/public-api.js';
import { userRouter } from '../route/api.js';
import { errorMiddleware } from '../middleware/error-middleware.js';

export const web = express();
web.use('/uploads', express.static('uploads'));

web.use(express.json());

web.get('/debug/files', (request, response) => {
    try {
        const uploadsPath = path.join(process.cwd(), 'uploads');
        const files = fs.readdirSync(uploadsPath);

        response.json({
            uploadsPath,
            files,
            exists: fs.existsSync(uploadsPath),
        });
    } catch (error) {
        response.json({ error: error.message });
    }
});

web.use(publicRouter);
web.use(userRouter);

web.use(errorMiddleware);
