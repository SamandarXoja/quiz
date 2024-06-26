import express from 'express';
import mongoose from 'mongoose';
import { quizzesData, createQuzzes, updateQuzzes, userMessage, Useropinions } from './controllers/QuizzesController.js';
import cors from 'cors';
import { feedback, userMessages } from './validations/auth.js';

const app = express();

app.use(cors());


mongoose.connect('mongodb+srv://samandarsaidahmadov98:8787172ss@cluster0.soqylcu.mongodb.net/quizzes').then(() => {
    console.log('DB ok');
}).catch((err) => console.log('DB', err))


app.use(express.json());

app.get('/', (req, res) => {
    res.send('hello')
})

app.get('/quizzes', quizzesData);
app.get('/quizzes/:topic/:level', quizzesData)
app.post('/quizzes', createQuzzes)

app.post('/quizzes/users', userMessages, userMessage)

app.patch('/quizzes/:topic/:level/:id', updateQuzzes)
app.post('/quizzes/feedbacks', feedback, Useropinions)



app.listen(5555, (err) => {
    if (err) {
        return console.log(err)
    }

    console.log('Server OK');
})