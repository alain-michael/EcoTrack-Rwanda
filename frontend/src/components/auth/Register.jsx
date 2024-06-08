import React, { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import createAxiosInstance from "../../features/AxiosInstance";

function Register({ viewType, setviewType }) {
  const instance = createAxiosInstance();
  const [ServerError, SetServerError] = useState(null);
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },

    validationSchema: Yup.object({
      name: Yup.string()
        .max(40, "Must be 40 characters or less")
        .required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(6, "Must be 6 characters or more")
        .required("Required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Required"),
    }),
    onSubmit: (values) => {
      instance
        .post(`/register`, values)
        .then((res) => {
          if (res.data.status == 201) {
            setviewType(!viewType)
          } else {
            SetServerError("Error While Registerating please again");
          }
        })
        .catch((error) => {
          if (error.response) {
            SetServerError(error.response.data.error);
          } else {
            SetServerError("Unexpected error occured. Try Again Later");
          }
        });
    },
  });

  const inputStyle =
    "flex h-9 w-[300px] rounded-md border border-input outline-none bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent ";
  return (
    <div>
      <div className="grid gap-6 ">
        <div>
          <h2 className="text-2xl font-bold p-3 pl-0">Sign Up</h2>

          <div className="text-sm text-gray-500">
            Start your amazing journey
          </div>

          {ServerError && (
            <>
              <div className="w-full relative flex justify-center">
                <p
                  onClick={() => SetServerError(null)}
                  className="text-red-500 bg-red-100 p-3  fixed top-3   rounded-md"
                >
                  {ServerError}
                </p>
              </div>
            </>
          )}
        </div>
        <form onSubmit={formik.handleSubmit} className="">
          <div className="grid gap-2">
            <div className="grid gap-1">
              <p>Name:</p>
              <input
                className={inputStyle}
                name="name"
                placeholder="Enter your name"
                value={formik.values.name}
                onChange={formik.handleChange}
              />
              {formik.errors.name && formik.touched.name ? (
                <div className="text-red-500">{formik.errors.name}</div>
              ) : null}
              <p>Email:</p>
              <input
                className={inputStyle}
                name="email"
                placeholder="Enter your email"
                value={formik.values.email}
                onChange={formik.handleChange}
              />
              {formik.errors.email && formik.touched.email ? (
                <div className="text-red-500">{formik.errors.email}</div>
              ) : null}
              <p>Password :</p>
              <input
                className={inputStyle}
                placeholder="Create a password"
                type="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
              />
              {formik.errors.password && formik.touched.password ? (
                <div className="text-red-500">{formik.errors.password}</div>
              ) : null}
              <p>Confirm password :</p>
              <input
                className={inputStyle}
                placeholder="Confirm your password"
                type="password"
                name="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
              />
              {formik.errors.confirmPassword &&
              formik.touched.confirmPassword ? (
                <div className="text-red-500">
                  {formik.errors.confirmPassword}
                </div>
              ) : null}
            </div>
            <div>
              <button type="submit" className="w-[300px] h-9 bg-[#207855] text-white rounded-md mt-4">
                Get started
              </button>
            </div>
          </div>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
        </div>
        <div>
          <p className="text-center cursor-pointer">
            Already have an account?{" "}
            <a onClick={()=>setviewType(!viewType)} className="text-[#207855]">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
