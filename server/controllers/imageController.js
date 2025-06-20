if (process.env.NODE_ENV !== "production") {
    await import('dotenv/config');
}

import axios from "axios";

import { cloudinary } from '../config/cloudinary.js'

import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

import userModel from "../models/userModel.js";
import imageModel from "../models/imageModel.js";
import { convertBase64ToCovered1024 } from '../utils/convertBase64ToCovered1024.js';

// import { Buffer } from 'buffer';
// import * as tf from '@tensorflow/tfjs';
// // import nsfw from 'nsfwjs';
// import {createCanvas, loadImage} from 'canvas'

// import fs from 'fs';
// import NSFWFilter from 'nsfw-filter';
// import NSFWFilter from 'nsfw-filter';
// const nsfw = require('nsfw-filter');
// const nsfw = await import('nsfw-filter');
// import path from 'path';

// import FormData from "form-data";
// import OpenAI from 'openai';
// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// });

// import { google } from 'googleapis';
const checkPrompt = async (req, res) => {
    try {
        const { userId, prompt } = req.body;

        if (!userId || !prompt) {
            return res.json({ success: false, message: 'Missing Details' });
        }

        // const client = await google.discoverAPI(process.env.PERSPECTIVE_API_URL);

        const analyzeRequest = {
            comment: {
                text: prompt,
            },
            languages: ['en'],
            requestedAttributes: {
                PROFANITY: {},
                SEXUALLY_EXPLICIT: {}
            }
        };

        const { data } = await axios.post(process.env.PERSPECTIVE_API_URL, analyzeRequest, {
            params: {
                key: process.env.GOOGLE_API_KEY_PERSPECTIVE_API
            }
        });

        const profanityScore = data.attributeScores.PROFANITY.summaryScore.value;
        const sexuallyExplicitScore = data.attributeScores.SEXUALLY_EXPLICIT.summaryScore.value;

        if (profanityScore > 0.5 || sexuallyExplicitScore > 0.4) {
            return res.json({ success: false, message: 'Inappropriate content detected. Please try again.' })
        }
        res.json({ success: true });

        // client.comments.analyze({
        //     key: process.env.GOOGLE_API_KEY_PERSPECTIVE_API,
        //     resource: analyzeRequest,
        // },
        //     (err, response) => {
        //         if(err){
        //             return res.json({success: false, message: err});
        //         }
        //         const profanitySummaryScoreValue = response.data.attributeScores.PROFANITY.summaryScore.value;
        //         const sexuallyExplicitSummaryScoreValue = response.data.attributeScores.SEXUALLY_EXPLICIT.summaryScore.value;

        //         if(profanitySummaryScoreValue > 0.9 || sexuallyExplicitSummaryScoreValue > 0.8){
        //             return res.json({success: false, message:'Inappropriate content detected. Please try again.'})
        //         }
        //         res.json({success: true});
        //     }
        // );
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

const checkNSFW = async (req, res) => {
    try {
        const { userId, image } = req.body;
        if (!userId || !image) {
            return res.json({ success: false, message: 'Missing Details' });
        }

        const img = await cloudinary.uploader.upload(image, {
            folder: 'PixAI',
            allowedFormats: ['jpeg', 'jpg', 'png']
        });

        const imgURL = img.secure_url;

        const options = {
            method: 'POST',
            url: 'https://nsfw-images-detection-and-classification.p.rapidapi.com/adult-content',
            headers: {
                'x-rapidapi-key': process.env.X_RAPID_API_KEY,
                'x-rapidapi-host': 'nsfw-images-detection-and-classification.p.rapidapi.com',
                'Content-Type': 'application/json'
            },
            data: {
                url: imgURL
            }
        };

        const response = await axios.request(options);

        const match = imgURL.match(/PixAI\/[^.]+/);
        const filename = match[0];
        await cloudinary.uploader.destroy(filename);

        if (response.data.unsafe) {
            return res.json({ success: false, message: 'Inappropriate content detected. Please try again.' });
        }
        res.json({success: true});

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

const generateImage = async (req, res) => {
    try {
        const { userId, prompt, negative_prompt } = req.body;

        if (!userId || !prompt) {
            return res.json({ success: false, message: 'Missing Details' });
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: 'Incorrect Details' });
        }

        if (user.creditBalance <= 0) {
            return res.json({ success: false, message: 'Insufficient Credit Balance', creditBalance: user.creditBalance });
        }

        // CLIPDDROP API

        // const formData = new FormData();
        // formData.append('prompt', prompt);

        // const {data} = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
        //     headers: {
        //         'x-api-key': process.env.CLIPDROP_API_KEY,
        //     },
        //     responseType: 'arraybuffer'
        // })

        // const base64Image = Buffer.from(data, 'binary').toString('base64');
        // const resultImage = `data:image/png;base64,${base64Data}`;




        // DALL-E API

        // const aiResponse = await openai.images.generate({
        //     model: 'dall-e-2',
        //     prompt,
        //     n: 1,
        //     size: '1024x1024',
        //     response_format: 'b64_json',
        // });

        // const resultImage = aiResponse.data.data[0].b64_json;

        // const resp = await axios.post('https://api.deepai.org/api/text2img', {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'api-key': process.env.DEEPAI_API_KEY
        //     },
        //     body: JSON.stringify({
        //         text: prompt,
        //     })
        // });

        // const resultImage = await resp.json();
        // console.log(resultImage);


        // HUGGING FACE API

        // const data = {
        //     inputs: prompt
        // }
        // const response = await fetch(
        //     "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
        //     {
        //         headers: {
        //             Authorization: `Bearer process.env.HUGGING_FACE_API_KEY`,
        //             "Content-Type": "application/json",
        //         },
        //         method: "POST",
        //         body: JSON.stringify(data),
        //     }
        // );
        // const imageBlob = await response.blob();
        // const resultImage = URL.createObjectURL(imageBlob);
        // const imageURL = resultImage.replace('blob:nodedata:', 'blob:http://localhost:3000/');
        
        // const query = async (data) => {
        //     const response = await fetch(
        //         "https://router.huggingface.co/fal-ai/fal-ai/lightning-models",
        //         {
        //             headers: {
        //                 Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
        //                 "Content-Type": "application/json",
        //             },
        //             method: "POST",
        //             body: JSON.stringify(data),
        //         }
        //     );
        //     // const result = await response.blob();
        //     return response;
        // }

        // const generateImage = async(prompt, negative_prompt) => {
        //     const imageBlob = await query({
        //         sync_mode: true,
        //         prompt,
        //         negative_prompt,
        //         height: 1024,
        //         width: 1024
        //     });
        //     console.log(imageBlob);

        //     // Use imageBlob here (e.g., create an object URL)
        //     // const imageURL = URL.createObjectURL(imageBlob);
        //     // console.log(imageURL); // or display in <img src=imageURL>
        // }

        // await generateImage(prompt, negative_prompt);

        const contents = `${prompt}` + (negative_prompt ? `, negative prompt: ${negative_prompt}` : '');
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-preview-image-generation",
            contents: contents,
            config: {
            responseModalities: [Modality.TEXT, Modality.IMAGE],
            },
            // imageGenerationConfig: {
            //     width: 512,
            //     height: 512,
            //     hrScale: 2,
            //     hrUpscalerStrength: 0.5,
            // },
        });

        let imageData;

        for (const part of response.candidates[0].content.parts) {
            // Based on the part type, either show the text or save the image
            if (part.inlineData) {
                imageData = part.inlineData.data;
            }
        }

        const initialBase64Image = `data:image/png;base64,${imageData}`;
        const resultImage = await convertBase64ToCovered1024(initialBase64Image);

        // console.log(resultImage);

        // RAPID API: ImageAI-Generator

        // const options = {
        //     method: 'POST',
        //     url: 'https://imageai-generator.p.rapidapi.com/image',
        //     headers: {
        //         'x-rapidapi-key': process.env.X_RAPID_API_KEY,
        //         'x-rapidapi-host': 'imageai-generator.p.rapidapi.com',
        //         'Content-Type': 'application/json'
        //     },
        //     data: {
        //         prompt,
        //         negative_prompt,
        //         width: 512,
        //         height: 512,
        //         hr_scale: 2
        //     }
        // };

        // const response = await axios.request(options);

        // const base64Image = response.data;
        // const resultImage = `data:image/png;base64,${base64Image}`

        // converting base64 to binary image
        // const image = atob(resultImage);
        // console.log(image);

        const updatedUser = await userModel.findByIdAndUpdate(user._id, { creditBalance: user.creditBalance - 1, numberGenerated: user.numberGenerated + 1 });

        res.json({ success: true, message: 'Image Generated', creditBalance: user.creditBalance - 1, numberGenerated: user.numberGenerated + 1, resultImage });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

const getCommunityImages = async (req, res) => {
    try {
        const communityImages = await imageModel.find({ shared: true });
        res.json({ success: true, images: communityImages });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

const getUserImages = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.json({ success: false, message: 'Missing Details' });
        }
        const userImages = await imageModel.find({ authorId: userId });
        res.json({ success: true, images: userImages });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// let nsfwModel;

// const checkImage = async (req, res) => {
//     try {
//         const { userId, image } = req.body;

//         if (!userId || !image) {
//             return res.json({ success: false, message: 'Missing Details' });
//         }

//         // if(!nsfwModel){
//         //     // nsfwModel = await
//         // }


//     } catch (error) {
//         res.json({ success: false, message: error.message });
//     }
// }

const saveToCloudinary = async (req, res) => {

    try {
        const { userId, prompt, negative_prompt, image, shared } = req.body;

        if (!userId || !prompt || !image) {
            return res.json({ success: false, message: 'Missing Details' });
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: 'Incorrect Details' });
        }

        // removing the "data:image/png;base64," prefix
        // const base64Image = image.split(",")[1];
        // const uint8Array = new Uint8Array(atob(base64Image).split('').map(char => char.charCodeAt(0)));
        // const uint8Array = new Uint8Array(atob(base64Image).split('').map(char => char.charCodeAt(0)));

        // const blob = new Blob([uint8Array], { type: 'image/png' }); // adjust the MIME type according to your image type
        // const file = new File([blob], 'image.png', { type: 'image/png' });

        // const uploadParams = {
        //     file,
        //     folder: 'PixAI',
        //     allowedFormats: ['jpeg', 'jpg', 'png']
        // };

        // const imgURL = await cloudinary.uploader.upload(uploadParams)

        // // converting base64 to binary data
        // const binaryImage = atob(base64Image);

        // // The argument 'path' must be a string, Uint8Array, or URL without null bytes for cloudinary upload

        // // Convert binary string to an array of bytes
        // const bytes = Object.keys(binaryImage).length;
        // const imageByteArrayFile = new Uint8Array(bytes);
        // for (let i = 0; i < bytes; i++) {
        //     imageByteArrayFile[i] = binaryImage.charCodeAt(i);
        // }

        // // The "path" argument must be of type string. Received an instance of Uint8Array
        // // Create a Blob from the byte array
        // const imageBlob = new Blob([imageByteArrayFile], { type: "image/png" }); // Adjust MIME type as needed (e.g., "image/jpeg")

        // // Generate an object URL for the Blob
        // const imageFile = URL.createObjectURL(imageBlob);

        // const binaryImage = Buffer.from(base64Image, 'base64');

        // const filename = `${userId}.png`;

        // fs.writeFileSync(filename, binaryImage, (err) => {
        //     if (err) {
        //         console.error("Error writing file:", err);
        //     } else {
        //         console.log("File saved as output.png");
        //     }
        // });

        // const imageFile = fs.readFileSync(filename);

        // const formData = new FormData();
        // formData.append("file", image);

        // const imgURL = await cloudinary.uploader.upload(uint8Array, {
        //     folder: 'PixAI',
        //     allowedFormats: ['jpeg', 'jpg', 'png']
        // });

        const img = await cloudinary.uploader.upload(image, {
            folder: 'PixAI',
            allowedFormats: ['jpeg', 'jpg', 'png']
        });

        const imgURL = img.secure_url;


        const newImage = await imageModel.create({
            authorId: user._id,
            authorName: user.name,
            authorProfilePic: user.profilePicture,
            email: user.email,
            prompt,
            negative_prompt,
            imgURL,
            shared
        });

        if (shared) {
            const updatedUserShared = await userModel.findByIdAndUpdate(user._id, { numberShared: user.numberShared + 1 });
            return res.json({ success: true, numberShared: user.numberShared + 1, image: newImage });
        }

        const updatedUserSaved = await userModel.findByIdAndUpdate(user._id, { numberSaved: user.numberSaved + 1 });
        res.json({ success: true, numberSaved: user.numberSaved + 1, image: newImage });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

const toggleShare = async (req, res) => {
    try {
        const { userId, imageId } = req.body;
        if (!userId || !imageId) {
            return res.json({ success: false, message: 'Missing Details' });
        }

        const image = await imageModel.findById(imageId);

        if (!image) {
            return res.json({ success: false, message: 'Invalid Details' });
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: 'Invalid Details' });
        }

        const sharedStatus = image.shared;
        image.shared = !sharedStatus;
        const updatedImage = await image.save();

        if(sharedStatus){
            user.numberShared -= 1;
            user.numberSaved += 1;
        } else {
            user.numberShared += 1;
            user.numberSaved -= 1;
        }

        const updatedUser = await user.save();

        res.json({ success: true, message: 'Status toggled successfully' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

const deleteImage = async (req, res) => {
    try {
        const { userId, imageId } = req.body;
        if (!userId || !imageId) {
            return res.json({ success: false, message: 'Missing Details' });
        }

        const image = await imageModel.findById(imageId);

        if (!image) {
            return res.json({ success: false, message: 'Invalid Details' });
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: 'Invalid Details' });
        }

        const match = image.imgURL.match(/PixAI\/[^.]+/);
        const filename = match[0];

        const sharedStatus = image.shared;
        if(sharedStatus){
            user.numberShared -= 1;
        } else {
            user.numberSaved -= 1;
        }
        await user.save();

        await cloudinary.uploader.destroy(filename);
        await userModel.findByIdAndUpdate(userId, { $pull: { images: imageId } });
        await imageModel.findByIdAndDelete(imageId);

        res.json({ success: true, message: 'Image deleted successfully' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export { checkPrompt, generateImage, checkNSFW, getCommunityImages, getUserImages, saveToCloudinary, toggleShare, deleteImage };