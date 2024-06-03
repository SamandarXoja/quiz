import Quizzes from "../models/Quizzes.js";
export const quizzesData = async (req, res) => {
    try {
        const { topic, level } = req.params;

        if (topic && level) {
            const quizzes = await Quizzes.find({ topic: topic, level: level });
            return res.json(quizzes);
        }

        const quizzes = await Quizzes.find();
        const topicsList = [
            "operators", "loops", "data_types", "functions", "objects",
            "prototypes", "promises_async_await", "classes", "event_loop",
            "generators", "dom", "browser_apis"
        ];
        const levels = ['beginner', 'intermediate', 'advanced'];
        let result = [];

        levels.forEach(level => {
            topicsList.forEach(topic => {
                const filteredQuizzes = quizzes.filter(quizz => quizz.level === level && quizz.topic === topic);
                if (filteredQuizzes.length > 0) {
                    result = result.concat(filteredQuizzes);
                }
            });
        });

        res.json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'не удалось получить статьи'
        });
    }
};




export const createQuzzes = async (req, res) => {
    try {
        const quizzesData = req.body; // Ожидаем, что req.body будет массивом данных

        const quizzes = await Quizzes.insertMany(quizzesData);

        res.json(quizzes);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать статьи'
        });
    }
}


export const updateQuzzes = async (req, res) => {
    try {
        const { id, topic, level } = req.params;

        await Quizzes.updateOne({
            _id: id,
            topics: topic,
            level: level

        }, {
            question: req.body.question,
            code: req.body.code,
            explanation: req.body.explanation,
            answer: req.body.answer,
            isCorrect: req.body.isCorrectValue,
            level: req.body.level,
            topics: req.body.topics
        })

        res.json({
            success: true,
        })

    }

    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось обнавит quizze'
        })
    }
}