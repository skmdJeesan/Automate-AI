import express from 'express'
import dotenv from 'dotenv'
import connect_db from './config/db.js'

dotenv.config()
const port = process.env.PORT || 7000

const app = express()

// middlewares
app.use(express.json())

// health check
app.get('/', async (req, res) => {
  res.send('hello, world:)')
})

app.listen(port, async () => {
  await connect_db()
  console.log(`server is running at port: ${port}`)
})