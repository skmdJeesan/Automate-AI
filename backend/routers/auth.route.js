import express from 'express'
import { get_me, login, logout } from '../controllers/auth.controller.js'
import protect from '../middleware/protect.js'

const auth_router = express.Router()

auth_router.post('/login', login)
auth_router.get('/logout', logout)
auth_router.get('/me', protect, get_me)

export default auth_router