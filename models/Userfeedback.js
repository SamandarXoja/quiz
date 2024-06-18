import mongoose from "mongoose";


const UserFeedbackSchema = new mongoose.Schema({

    quizId: {
        type: String,
        required: true,
        unique: true
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

export default mongoose.model('Feedback', UserFeedbackSchema)