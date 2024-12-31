import { serve } from '@hono/node-server'
import { PrismaClient } from '@prisma/client'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import dotenv from "dotenv"
dotenv.config()

import authRouter from "./User/auth.js"

const app = new Hono()
const port = 3001
const prisma = new PrismaClient()

app.route("/user/auth",authRouter)
app.use("/*",cors({
  origin:process.env.ORIGIN_URL as string,
}))
app.notFound((c)=>c.json({"message":"page is not found"},404))

app.get('/', async(c) => {
  return c.text(`This server is running on port ${port}!`)
})


console.log(`Server is running on http://localhost:${port}`)
serve({
  fetch: app.fetch,
  port
})
