import { NextResponse } from "next/server"

export function middleware(req) {

  const token = req.cookies.get("token")
  const path = req.nextUrl.pathname

  const publicRoutes = ["/login", "/signup"]

  if (!token && !publicRoutes.includes(path)) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
}