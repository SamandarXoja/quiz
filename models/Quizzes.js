import mongoose from "mongoose";


const QuizzesSchema = new mongoose.Schema({
    question: {
        type: String,
        required: false
    },

    answer: {
        type: String,
        required: true
    },
    isCorrect: {
        type: Boolean,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    topics: {
        type: String,
        required: true
    }

})

export default mongoose.model('Quizzes', QuizzesSchema);