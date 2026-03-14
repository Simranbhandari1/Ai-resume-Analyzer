import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "@/models/User"
import connectDB from "@/lib/db"

export async function POST(req) {

  const { email, password } = await req.json()

  await connectDB()

  const user = await User.findOne({ email })

  if (!user) {
    return Response.json({ error: "User not found" })
  }

  const isValid = await bcrypt.compare(password, user.password)

  if (!isValid) {
    return Response.json({ error: "Invalid credentials" })
  }

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET
  )

  return Response.json({ token })
}