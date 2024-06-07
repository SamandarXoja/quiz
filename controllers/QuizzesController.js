import Quizzes from "../models/Quizzes.js";
import Users from "../models/Users.js";

const getRandomItems = (array, numItems) => {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numItems);
};

export const quizzesData = async (req, res) => {
    try {
        const { topic, level, size } = req.query;
        const numItems = size ? parseInt(size, 10) : 10; // Используем 10 по умолчанию, если size не указано

        // Списки тем и уровней
        const topicsList = [
            "operators", "loops", "data_types", "functions", "objects",
            "prototypes", "promises_async_await", "classes", "event_loop",
            "generators", "dom", "browser_apis"
        ];
        const levels = ['beginner', 'intermediate', 'advanced'];

        let quizzes;

        if (topic && level) {
            // Если указаны параметры topic и level
            quizzes = await Quizzes.find({ topic, level }).lean().exec();
        } else if (level && !topic) {
            // Если указан только level
            quizzes = await Quizzes.find({ level }).lean().exec();
        } else {
            // Если параметры не указаны, выбираем все
            quizzes = await Quizzes.find({}).lean().exec();
        }

        // Группируем по темам и уровням, и выбираем случайные элементы
        const groupedQuizzes = quizzes.reduce((acc, quiz) => {
            const key = `${quiz.topic}-${quiz.level}`;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(quiz);
            return acc;
        }, {});

        let result = [];
        for (const key in groupedQuizzes) {
            result = result.concat(getRandomItems(groupedQuizzes[key], numItems));
        }

        res.json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить вопросы'
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

export const userMessage = async (req, res) => {
    try {

        const { fullName, email, message } = req.body

        const newUser = new Users({
            fullName,
            email,
            message
        })

        const savedUser = await newUser.save();
        res.status(201).json(savedUser)


    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создат'
        })
    }
}