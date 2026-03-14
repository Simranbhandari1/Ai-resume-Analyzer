"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useFormik } from "formik"
import * as Yup from "yup"
import SocialLogin from "./SocialLogin"
import Link from "next/link"




export default function LoginForm() {
 
  

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });

  const data = await res.json();
},
  })

  return (
    <Card className="w-[420px] p-6 shadow-lg">
      <CardContent className="space-y-6">

        <h2 className="text-xl text-center font-semibold">
          Sign in your account
        </h2>

        <SocialLogin />

        <p className="text-center text-sm text-muted-foreground">
          or use your email
        </p>

        <form onSubmit={formik.handleSubmit} className="space-y-4">

          <div>
            <Input
              name="email"
              placeholder="Your Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            {formik.errors.email && formik.touched.email && (
              <p className="text-sm text-red-500 mt-1">
                {formik.errors.email}
              </p>
            )}
          </div>

          <div>
            <Input
              name="password"
              type="password"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            {formik.errors.password && formik.touched.password && (
              <p className="text-sm text-red-500 mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600"
          >
            Sign In
          </Button>

        </form>

        <div className="text-center text-sm space-y-2">
          <p className="text-indigo-600 cursor-pointer">
            Forgot your password?
          </p>

          <p>
            First time here?{" "}
            <Link href="/signUp">Create an account</Link>
           
          </p>
        </div>

      </CardContent>
    </Card>
  )
}