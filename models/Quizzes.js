import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema({
    answer: {
        type: String,
        required: true
    },
    isCorrect: {
        type: Boolean,
        required: true
    }
});

const QuizzesSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: false
    },
    explanation: {
        type: String,
        required: true
    },
    answers: [AnswerSchema],
    level: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true
    }
});
QuizzesSchema.index({ topic: 1, level: 1 });

export default mongoose.model('Quizzes', QuizzesSchema);
