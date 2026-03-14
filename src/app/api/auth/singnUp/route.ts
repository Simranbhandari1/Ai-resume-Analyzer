import bcrypt from "bcryptjs"
import User from "@/models/User"
import connectDB from "@/lib/db"

export async function POST(req) {
  const body = await req.json()

  await connectDB()

  const hashedPassword = await bcrypt.hash(body.password, 10)

  const user = await User.create({
    fullName: body.fullName,
    email: body.email,
    password: hashedPassword
  })

  return Response.json({ user })
}