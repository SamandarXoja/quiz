import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    fullName: {
        required: true,
        type: String,
    },

    email: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    }

})

export default mongoose.model('User', UserSchema)