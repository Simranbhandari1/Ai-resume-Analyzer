"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useFormik } from "formik"
import * as Yup from "yup"
import SocialLogin from "../signIn/SocialLogin"

export default function SignupForm() {

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string()
        .min(2, "Name must be at least 2 characters")
        .required("Full name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Please confirm your password"),
    }),
    // onSubmit: (values) => {
    //   console.log(values)
    // },
    onSubmit: async (values) => {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });

  const data = await res.json();
  console.log(data);
}
  })

  return (
    <Card className="w-[420px] p-6 shadow-lg">
      <CardContent className="space-y-6">

        <h2 className="text-xl text-center font-semibold">
          Create your account
        </h2>

        <SocialLogin />

        <p className="text-center text-sm text-muted-foreground">
          or use your email
        </p>

        <form onSubmit={formik.handleSubmit} className="space-y-4">

          <div>
            <Input
              name="fullName"
              placeholder="Full Name"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.fullName && formik.touched.fullName && (
              <p className="text-sm text-red-500 mt-1">
                {formik.errors.fullName}
              </p>
            )}
          </div>

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

          <div>
            <Input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.confirmPassword && formik.touched.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">
                {formik.errors.confirmPassword}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600"
          >
            Create Account
          </Button>

        </form>

        <div className="text-center text-sm">
          <p>
            Already have an account?{" "}
            <span className="text-indigo-600 cursor-pointer">
              Sign in
            </span>
          </p>
        </div>

      </CardContent>
    </Card>
  )
}