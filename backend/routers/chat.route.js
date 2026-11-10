import express from 'express'
import { agent_chat, chat } from '../controllers/chat.controller.js'
import protect from '../middleware/protect.js'

const chat_router = express.Router()

chat_router.post('/', protect, chat)
chat_router.post('/agent', protect, agent_chat)

export default chat_router