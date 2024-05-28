import Quizzes from "../models/Quizzes.js";

export const quizzesData = async (req, res) => {
    try {
        
        const {topic, level} = req.params;
        
        if(topic && level){
            const quizzes = await Quizzes.find({ topics: topic, level: level });
            return res.json(quizzes)
        }
        
        const quizzes = await Quizzes.find();

        const topicsList = [
            "operators", "loops", "data_types", "functions", "objects",
            "prototypes", "promises_async_await", "classes", "event_loop",
            "generators", "dom", "browser_apis"
        ];

        const levels = ['beginner', 'intermediate', 'advanced'];
        const result = {};

        levels.forEach(level => {
            result[level] = {};
            topicsList.forEach(topic => {
                result[level][topic] = quizzes.filter(quizz => quizz.level === level && quizz.topics === topic);
            })
        })

        res.json(result)



    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'не удалось получить статью'
        })
    }
}

export const createQuzzes = async (req, res) => {
    try {

        const isCorrectValue = req.body.isCorrect === '1' || req.body.isCorrect

        const doc = new Quizzes({
            answer: req.body.answer,
            isCorrect: isCorrectValue,
            level: req.body.level,
            topics: req.body.topics
        })

        const quizz = await doc.save();
        res.json(quizz)


    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'не удалось создат статью'
        })
    }
}