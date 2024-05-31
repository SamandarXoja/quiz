import Quizzes from "../models/Quizzes.js";

export const quizzesData = async (req, res) => {
    try {
        const { topic, level } = req.params;

        if (topic && level) {
            const quizzes = await Quizzes.find({ topics: topic, level: level });
            const formattedQuizzes = [];


            for (let i = 0; i < quizzes.length; i += 4) {
                const quizGroup = quizzes.slice(i, i + 4);
                const groupObject = quizGroup.reduce((acc, quiz) => {
                    if (quiz.question && !acc.question) {
                        acc.question = quiz.question;
                        acc.code = quiz.code;
                        acc.explanation = quiz.explanation
                    }
                    acc.quizzes.push({
                        _id: quiz._id,
                        answer: quiz.answer,
                        isCorrect: quiz.isCorrect,
                        level: quiz.level,
                        topics: quiz.topics,
                        __v: quiz.__v
                    });
                    return acc;
                }, { question: "", quizzes: [] });

                formattedQuizzes.push(groupObject);
            }

            return res.json({ [level]: { [topic]: formattedQuizzes } });
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
                const filteredQuizzes = quizzes.filter(quizz => quizz.level === level && quizz.topics === topic);
                const formattedQuizzes = [];

                // Группировка викторин по 4 в отдельные объекты
                for (let i = 0; i < filteredQuizzes.length; i += 4) {
                    const quizGroup = filteredQuizzes.slice(i, i + 4);
                    const groupObject = quizGroup.reduce((acc, quiz) => {
                        if (quiz.question && !acc.question) {
                            acc.question = quiz.question;
                            acc.code = quiz.code;
                            acc.code = quiz.explanation
                        }
                        acc.quizzes.push({
                            _id: quiz._id,
                            answer: quiz.answer,
                            isCorrect: quiz.isCorrect,
                            level: quiz.level,
                            topics: quiz.topics,
                            __v: quiz.__v
                        });
                        return acc;
                    }, { question: "", quizzes: [] });

                    formattedQuizzes.push(groupObject);
                }

                if (formattedQuizzes.length > 0) {
                    result[level][topic] = formattedQuizzes;
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