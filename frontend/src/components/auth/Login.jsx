import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUserLogin } from "../../features/SharedDataSlice/SharedData"
import { jwtDecode } from "jwt-decode"
import { instance } from '../../features/AxiosInstance'

function Login({ viewType, setviewType }) {
  const [ServerError, SetServerError] = useState(null);
  const dispatch = useDispatch();

  {/* Using Formik to handle form data and validation */}
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email().required("Required"),
      password: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      instance
        .post('/register', values)
        .then((res) => {
          if (res.status) {
            console.log(jwtDecode(res.data.access_token));
            // dispatch(addUserLogin(jwtDecode(res.data.access_token)));
            localStorage.setItem("access_token", JSON.stringify(res.data.access_token));
            // window.location.href = "dashboard";
          }
        })
        .catch((error) => {
          if (error.response) {
            SetServerError(`Error: ${error.response.data.error}`);
          } else {
            SetServerError("Unexpected error occured. Try Again Later");
          }
        });
    },
  });
  
  const inputStyle =
    "flex h-9 w-[300px] rounded-md border border-input outline-none bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent ";
  return (
    <div className="">
      <div className="grid gap-6 ">
        <h2 className="text-2xl font-bold">Sign In</h2>
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
        <form onSubmit={formik.handleSubmit} >
          <div className="grid gap-2">
            <div className="grid gap-1">
              <p>Email:</p>
              <input
                className={inputStyle}
                placeholder="Email Address"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
              />
              {formik.errors.email && formik.touched.email ? (
                <div className="text-red-500">{formik.errors.email}</div>
              ) : null}
              <p>Password :</p>
              <input
                className={inputStyle}
                placeholder="Password"
                type="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
              />
            </div>
            <div>
              <button className="w-[300px] h-9 bg-[#207855] text-white rounded-md mt-4 outline-none">
                Sign In
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
            Don't have an account?&nbsp;
            <a onClick={()=>setviewType(!viewType)} className="text-[#207855]">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
