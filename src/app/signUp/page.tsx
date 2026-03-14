"use client"


import LoginFeatures from "../signIn/LoginFeature"
import SignupForm from "./SignUpForm"

export default function SignupPage() {
  return (
    <div className="min-h-screen grid grid-cols-2">

      <LoginFeatures />

      <div className="flex items-center justify-center bg-white">
        <SignupForm />
      </div>

    </div>
  )
}