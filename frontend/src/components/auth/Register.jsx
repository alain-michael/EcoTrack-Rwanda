import React, { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import createAxiosInstance from "../../features/AxiosInstance";
import toast from "react-hot-toast";
import DataProgressLoad from "../Loads/DataProgressLoad";

function Register({ viewType, setviewType }) {
  const instance = createAxiosInstance();
  const [ServerError, SetServerError] = useState(null);
  const [load, setLoad] = useState(false);
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      sharecode: "",
    },

    validationSchema: Yup.object({
      name: Yup.string()
        .max(40, "Must be 40 characters or less")
        .required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
      phoneNumber: Yup.string().required("Phone Number Required"),
      password: Yup.string()
        .min(6, "Must be 6 characters or more")
        .required("Required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Required"),
    }),
    onSubmit: (values) => {
      setLoad(true)
      instance
        .post(`/register`, values)
        .then((res) => {
          if (res.data.status == 201) {
            setviewType(!viewType);
          } else {
            toast.error("Error While Registerating please again");

            SetServerError("Error While Registerating please again");
          }
          setLoad(false)
        })
        .catch((error) => {
          if (error.response) {
            toast.error(`Error: ${error.response.data.error}`);

            SetServerError(error.response.data.error);
          } else {
            SetServerError("Unexpected error occured. Try Again Later");
          }
          setLoad(false)
        });
    },
  });

  const inputStyle =
    "flex w-full rounded-md outline-none p-4 text-white px-5 bg-gray-50 bg-opacity-10 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent ";
  return (
    <div>
      <div className="grid gap-6 ">
        <div>
          <h2 className="text-2xl font-bold text-center text-white">Sign Up</h2>

          <p className="mb-12 text-gray-200 text-center"></p>
        </div>
        <form onSubmit={formik.handleSubmit} className="">
          <div className="grid gap-2">
            <div className="flex flex-col max-w-[400px] w-full">
              <input
                className={inputStyle}
                name="name"
                placeholder="Enter your name"
                value={formik.values.name}
                onChange={formik.handleChange}
              />
              {formik.errors.name && formik.touched.name ? (
                <div className="text-orange-500">{formik.errors.name}</div>
              ) : null}
              <div className="mt-5"></div>

              <input
                className={inputStyle}
                name="email"
                placeholder="Enter your email"
                value={formik.values.email}
                onChange={formik.handleChange}
              />
              {formik.errors.email && formik.touched.email ? (
                <div className="text-orange-500">{formik.errors.email}</div>
              ) : null}
              <p className="mt-4"></p>
              <input
                className={inputStyle}
                name="phoneNumber"
                placeholder="Enter your Phone"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
              />
              {formik.errors.email && formik.touched.email ? (
                <div className="text-orange-500">{formik.errors.email}</div>
              ) : null}
              <div className="mt-5"></div>
              <div className="grid sm:grid-cols-2 gap-3 w-full ">
                <div>
                  <input
                    className={inputStyle}
                    placeholder="Create a password"
                    type="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.password && formik.touched.password ? (
                    <div className="text-orange-500">
                      {formik.errors.password}
                    </div>
                  ) : null}
                </div>
                <div>
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
                    <div className="text-orange-500">
                      {formik.errors.confirmPassword}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="mt-5"></div>

              <input
                className={inputStyle}
                placeholder="Referral code 4-digits"
                type="number"
                name="sharecode"
                maxLength={4}
                value={formik.values.sharecode}
                onChange={formik.handleChange}
              />

              <div className="w-full mt-4">
                {!load && (
                  <button
                    type="submit"
                    className="w-full  bg-green-200 text-green-900 font-bold  flex justify-center items-center p-4 px-5 rounded-md mt-4 outline-none"
                  >
                    Get started
                  </button>
                )}
                {load && (
                  <button
                    type="button"
                    className="w-full  bg-white text-green-900 font-bold  flex justify-center items-center p-4 px-5 rounded-md mt-4 outline-none"
                  >
                    <DataProgressLoad />
                    Creating Account....
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
        <div className="relative mt-8"></div>

        <div>
          <p className="text-center cursor-pointer text-gray-400 flex justify-between">
            <span>Already have an account? </span>
            <a onClick={() => setviewType(!viewType)} className="text-white">
              Log in
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

export default Register;
