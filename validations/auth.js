import { body } from "express-validator";


export const userMessages = [
    body('fullName', 'Укажите имя').isLength({ min: 3 }),
    body('email', 'Нерерный формат почты').isEmail(),
    body('message', 'Укажите текск').isLength({ min: 3 }),
]

export const feedback = [
    body('email', 'Нерерный формат почты').isEmail(),
    body('message', 'Укажите текск').isLength({ min: 2 }),

]