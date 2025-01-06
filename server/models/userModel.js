import mongoose from "mongoose";
const Schema = mongoose.Schema;


const userSchema = new Schema({
    // authType: {
    //     type: String,
    //     enum: ['github', 'google', 'x', 'normal'],
    //     required: true
    // },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, required: true },
    // googleId: {type: String, default: null},
    // githubId: {type: String, default: null},
    // xId: {type: String, default: null},
    lastLogin: {
        type: Date,
        default: Date.now()
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken : String,
    resetPasswordTokenExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,

    creditBalance: { type: Number, default: 5 },
    numberGenerated: { type: Number, default: 0 },
    numberSaved: { type: Number, default: 0 },
    numberShared: { type: Number, default: 0 },
    images: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Image'
        }
    ],
    transactions: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Transaction'
        }
    ],
}, { timestamps: true });

// timestamps: true ---> this adds the createdAt and updatedAt fields into the document

// userSchema.index({ googleId: 1 }, { unique: true, sparse: true });
// userSchema.index({ githubId: 1 }, { unique: true, sparse: true });
// userSchema.index({ xId: 1 }, { unique: true, sparse: true });

const userModel = mongoose.model('User', userSchema);

export default userModel;