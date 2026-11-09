import express from 'express'
import { chat } from '../controllers/chat.controller.js'
import protect from '../middleware/protect.js'

const chat_router = express.Router()

chat_router.post('/', protect, chat)

export default chat_router