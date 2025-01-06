import express from 'express'

import userAuth from '../middlewares/auth.js';
import { deleteImage, checkPrompt, generateImage, getCommunityImages, getUserImages, saveToCloudinary, toggleShare, checkNSFW } from '../controllers/imageController.js';

const imageRouter = express.Router();

imageRouter.post('/check-prompt', userAuth, checkPrompt);
imageRouter.post('/generate-image', userAuth, generateImage);
imageRouter.post('/check-nsfw', userAuth, checkNSFW);
imageRouter.post('/upload-image', userAuth, saveToCloudinary);
imageRouter.post('/toggle-share', userAuth, toggleShare);
imageRouter.post('/delete-image', userAuth, deleteImage);

imageRouter.get('/get-user-images', userAuth, getUserImages);
imageRouter.get('/get-community-images', getCommunityImages);

export default imageRouter;