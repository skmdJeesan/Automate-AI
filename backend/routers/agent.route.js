import express from 'express'
import protect from '../middleware/protect.js'
import { create_agent, delete_agent, get_agent, get_all_agents } from '../controllers/agent.controller.js'

const agent_router = express.Router()

agent_router.post('/create', protect, create_agent)
agent_router.get('/get/all', protect, get_all_agents)
agent_router.get('/get/:id', protect, get_agent)
agent_router.delete('/del/:id', protect, delete_agent)

export default agent_router