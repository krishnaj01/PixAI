import express from 'express'
import { deleteImage, checkPrompt, generateImage, getCommunityImages, getUserImages, saveToCloudinary, toggleShare, checkNSFW } from '../controllers/imageController.js';
import userAuth from '../middlewares/auth.js';

const imageRouter = express.Router();

imageRouter.post('/check-prompt', userAuth, checkPrompt);
imageRouter.post('/generate-image', userAuth, generateImage);
imageRouter.post('/check-nsfw', userAuth, checkNSFW);
imageRouter.post('/upload-image', userAuth, saveToCloudinary);
imageRouter.get('/get-user-images', userAuth, getUserImages);
imageRouter.get('/get-community-images', getCommunityImages);
imageRouter.post('/toggle-share', userAuth, toggleShare);
imageRouter.post('/delete-image', userAuth, deleteImage);

export default imageRouter;