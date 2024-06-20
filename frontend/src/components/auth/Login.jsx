import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUserLogin } from "../../features/SharedDataSlice/SharedData";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import DataProgressLoad from "../Loads/DataProgressLoad";
import createAxiosInstance from "../../features/AxiosInstance";
import toast from "react-hot-toast";
function Login({ viewType, setviewType }) {
  const [ServerError, SetServerError] = useState(null);
  const [load, setLoad] = useState(false);
  const dispatch = useDispatch();
  const goto = useNavigate();
  const instance = createAxiosInstance();
  {
    /* Using Formik to handle form data and validation */
  }
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
      setLoad(true);
      instance
        .post("/login", values)
        .then((res) => {
          if (res.status == 200) {
            let user_data = {
              access: res.data.access,
              refresh: res.data.refresh,
            };
            Object.keys(jwtDecode(res.data.access)).map((item) => {
              user_data[item] = jwtDecode(res.data.access)[item];
            });
            if (dispatch(addUserLogin(user_data))) {
              setLoad(false);
              goto("/dashboard");
            }
          }
        })
        .catch((error) => {
          setLoad(false);
          if (error.response) {
            toast.error(`Error: ${error.response.data.error}`);
            SetServerError(`Error: ${error.response.data.error}`);
          } else {
            console.log(error);
            SetServerError("Unexpected error occured. Try Again Later");
          }
        });
    },
  });

  const inputStyle =
    "flex w-full rounded-md outline-none p-4 text-white px-5 bg-gray-50 bg-opacity-10 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent ";
  return (
    <div className="w-full">
      <div className="grid gap-6 max-w-full">
        <h2 className="text-2xl font-bold text-center text-white">Sign In</h2>
        <p className="mb-12 text-gray-200 text-center"></p>

        <form className="max-w-full" onSubmit={formik.handleSubmit}>
          <div className="grid gap-2 w-full">
            <div className="flex flex-col md:max-w-[400px] w-full ">
              <input
                className={inputStyle}
                placeholder="Email Address"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
              />
              {formik.errors.email && formik.touched.email ? (
                <div className="text-orange-500">{formik.errors.email}</div>
              ) : null}
              <div className="mt-5"></div>
              <input
                className={inputStyle}
                placeholder="Password"
                type="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
              />
            </div>
            <div className="w-full mt-4">
              {!load && (
                <button
                  type="submit"
                  className="w-full  max-w-full sm:w-[400px]  bg-green-200 text-green-900 font-bold  flex justify-center items-center p-4 px-5 rounded-md mt-4 outline-none"
                >
                  Sign In
                </button>
              )}
              {load && (
                <button
                  type="button"
                  className="w-full  bg-white text-green-900 font-bold  flex justify-center items-center p-4 px-5 rounded-md mt-4 outline-none"
                >
                  <DataProgressLoad />
                  Loggin....
                </button>
              )}
            </div>
          </div>
        </form>
        <div className="relative mt-8"></div>
        <div>
          <p className="text-center cursor-pointer text-gray-400 flex justify-between">
            <span>Don't have an account?&nbsp;</span>
            <a onClick={() => setviewType(!viewType)} className="text-white">
              Sign Up
            </a>
          </p>
          <p className="text-center md:text-left  cursor-pointer pt-2">
            <a href="/" className="text-gray-300">
              Homepage
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
