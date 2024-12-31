import { PrismaClient } from "@prisma/client"
import {Hono} from "hono"
import {v4 as uuidv4} from "uuid"

const app = new Hono()
const prisma = new PrismaClient()

interface create_user_body {
    userName:string,
    userId:string,
    email:string,
    userIcon:string
}

app.post("/create-user",async(c)=>{
    try{
        const { userName,userId,email,userIcon } = await c.req.json<create_user_body>()
        //userIdの重複がないか確認(emailはgoogleアカウントと紐づいているため重複無し)
        const isUser = await prisma.user.findMany({
            where:{
                userId:userId
            }
        })
        if (isUser.length !== 0){
            return c.json({"message":"this userId is already used"},409)
        }
        const result = await prisma.user.create({
            data:{
                userId:userId,
                userName:userName,
                email:email,
                userIcon:userIcon
            }
        })
        return c.json({"data":result},200)
    }catch{
        return c.json({"message":"server error"},500)
    }
})
app.delete("/delete-user",async(c)=>{
    try{
        const {userId} = await c.req.json<{userId:string}>()
        
    }catch{
        return c.json({"message":"server error"},500)
    }
})

export default app