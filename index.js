import express from 'express';
import mongoose from 'mongoose';
import { quizzesData, createQuzzes, updateQuzzes } from './controllers/QuizzesController.js';
import cors from 'cors';

const app = express();

app.use(cors());


mongoose.connect('mongodb+srv://samandarsaidahmadov98:8787172ss@cluster0.soqylcu.mongodb.net/quizzes').then(() => {
    console.log('DB ok');
}).catch((err) => console.log('DB', err))


app.use(express.json());

app.get('/', (req, res) => {
    res.send('hello')
})

app.get('/quizze', quizzesData);
app.get('/quizze/:topic/:level', quizzesData)
app.post('/quizze', createQuzzes)

app.patch('/quizze/:topic/:level/:id', updateQuzzes)

app.listen(5555, (err) => {
    if (err) {
        return console.log(err)
    }

    console.log('Server OK');
})