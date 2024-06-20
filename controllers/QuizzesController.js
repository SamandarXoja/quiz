import Quizzes from "../models/Quizzes.js";
import Users from "../models/Users.js";
import Userfeedback from "../models/Userfeedback.js";
const getRandomItems = (array, numItems) => {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numItems);
};

export const quizzesData = async (req, res) => {
    try {
      const { topic, level, size } = req.query;
      const numItems = size ? parseInt(size, 10) : 10; // Используем 10 по умолчанию, если size не указано
  
      let quizzes;
  
      if (level) {
        if (topic) {
          // Если указаны параметры topic и level
          quizzes = await Quizzes.find({ topic, level }).lean().exec();
        } else {
          // Если указан только level, выбираем все квизы с этим уровнем
          quizzes = await Quizzes.find({ level }).lean().exec();
          // Группируем по темам и выбираем случайные темы
          const groupedQuizzes = quizzes.reduce((acc, quiz) => {
            if (!acc[quiz.topic]) acc[quiz.topic] = [];
            acc[quiz.topic].push(quiz);
            return acc;
          }, {});
  
          quizzes = Object.values(groupedQuizzes).flat();
        }
      } else {
        // Если level не указан, выбираем все квизы
        quizzes = await Quizzes.find({}).lean().exec();
      }
  
      // Если параметр topic не указан, выбираем случайные темы
      if (!topic && level) {
        const groupedQuizzes = quizzes.reduce((acc, quiz) => {
          if (!acc[quiz.topic]) acc[quiz.topic] = [];
          acc[quiz.topic].push(quiz);
          return acc;
        }, {});
  
        quizzes = Object.values(groupedQuizzes).map(group => getRandomItems(group, Math.ceil(numItems / Object.keys(groupedQuizzes).length))).flat();
      }
  
      // Выбираем случайные элементы из общей выборки
      const result = getRandomItems(quizzes, numItems);
  
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


export const Useropinions = async (req, res) => {

    try {
        const { quizId, email, message } = req.body;

        const UsersFeedbacks = new Userfeedback({
            quizId,
            email,
            message
        })

        const savedFeedbacks = await UsersFeedbacks.save();
        res.status(201).json(savedFeedbacks);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создат'
        })
    }

}