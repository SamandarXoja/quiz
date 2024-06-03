import Quizzes from "../models/Quizzes.js";
export const quizzesData = async (req, res) => {
    try {
        const { topic, level } = req.params;

        const formatQuizzes = (quizzes) => {
            const formattedQuizzes = [];
            const questionMap = new Map();

            quizzes.forEach(quiz => {
                if (!questionMap.has(quiz.question)) {
                    questionMap.set(quiz.question, {
                        _id: quiz._id,
                        question: quiz.question,
                        code: quiz.code,
                        explanation: quiz.explanation,
                        level: quiz.level,
                        topics: quiz.topics,
                        answers: []
                    });
                }
                const question = questionMap.get(quiz.question);
                if (question.answers.length < 4) {
                    question.answers.push({
                        _id: quiz._id,
                        answer: quiz.answer,
                        isCorrect: quiz.isCorrect,
                    });
                }
            });

            questionMap.forEach(value => formattedQuizzes.push(value));

            return formattedQuizzes;
        };

        if (topic && level) {
            const quizzes = await Quizzes.find({ topics: topic, level: level });
            const formattedQuizzes = formatQuizzes(quizzes);
            return res.json(formattedQuizzes);
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
                const filteredQuizzes = quizzes.filter(quizz => quizz.level === level && quizz.topics === topic);
                const formattedQuizzes = formatQuizzes(filteredQuizzes);

                if (formattedQuizzes.length > 0) {
                    result = result.concat(formattedQuizzes);
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

        const isCorrectValue = req.body.isCorrect === '1' || req.body.isCorrect

        const doc = new Quizzes({
            question: req.body.question,
            code: req.body.code,
            explanation: req.body.explanation,
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


export const updateQuzzes = async (req, res) => {
    try {
        const dataId = req.params.id;

        await Quizzes.updateOne({
            _id: dataId,

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