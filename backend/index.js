import express from 'express'
import dotenv from 'dotenv'
import connect_db from './config/db.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import auth_router from './routers/auth.route.js'

dotenv.config()
const port = process.env.PORT || 7000

const app = express()

// middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

app.use('/api/auth', auth_router)

// health check
app.get('/', async (req, res) => {
  res.send('hello, world:)')
})

app.listen(port, async () => {
  await connect_db()
  console.log(`server is running at port: ${port}`)
})