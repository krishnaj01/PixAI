import mongoose from "mongoose";
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    authorId: { type: String, required: true },
    authorName: { type: String, required: true },
    authorProfilePic: { type: String, required: true },
    email: { type: String, required: true },
    prompt: { type: String, required: true },
    negative_prompt: { type: String },
    imgURL: { type: String, required: true },
    shared: { type: Boolean, default: false }
});

const imageModel = mongoose.model('Image', imageSchema);

export default imageModel;