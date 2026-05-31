if (process.env.NODE_ENV !== "production") {
    await import('dotenv/config');
}

import axios from "axios";
import { cloudinary } from '../config/cloudinary.js'
import { Buffer } from "node:buffer";

import { InferenceClient } from "@huggingface/inference";
const hf_client = new InferenceClient(process.env.HF_TOKEN);

import userModel from "../models/userModel.js";
import imageModel from "../models/imageModel.js";
import { convertBase64ToCovered1024, convertUrlToCovered1024 } from '../utils/convertBase64ToCovered1024.js';

const checkPrompt = async (req, res) => {
    try {
        const { userId, prompt } = req.body;

        if (!userId || !prompt) {
            return res.json({ success: false, message: 'Missing Details' });
        }

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


        // HUGGING FACE INFERENCE API

        const contents = (negative_prompt ? 'prompt: ' : '') + `${prompt}` + (negative_prompt ? `, negative prompt: ${negative_prompt}` : '');

        const hf_response = await hf_client.textToImage({
            provider: "fal-ai",
            model: "Tongyi-MAI/Z-Image-Turbo",
            inputs: contents,
            parameters: {
                image_size: {
                    width: 1024,
                    height: 1024
                },
                num_inference_steps: 5,
            }
        });

        const imageArrayBuffer = await hf_response.arrayBuffer();
        const base64Image = Buffer.from(imageArrayBuffer).toString("base64");
        const resultImage = `data:image/png;base64,${base64Image}`;


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