import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'

function Login() {
  const formik = useFormik(
    {
      initialValues: {
        email: '',
        password: '',
      },
      validationSchema: Yup.object(
        {
          email: Yup.string().email().required(),
          password: Yup.string().required(),
        }
      ),
      onSubmit: (values) => {
        axios.post('http://127.0.0.1:5000/api/login', values)
        .then(res => console.log(res.status))
        .catch(error => console.log(`Error: ${error}`))
      }
    }
  )

    const inputStyle =
      'flex h-9 w-[300px] rounded-md border border-input outline-none bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent ';
  return (
    <div>
      <div className="grid gap-6 ">
        <p>
          <span className="text-2xl font-bold">Sign In</span>
        </p>
        <form onSubmit={formik.handleSubmit} className="">
          <div className="grid gap-2">
            <div className="grid gap-1">
              <p>Email:</p>
              <input className={inputStyle} placeholder="Email Address" name="email" value={formik.values.email} onChange={formik.handleChange} />
              {formik.errors.email && formik.touched.email ? (<div className="text-red-500">{formik.errors.email}</div>) : null}
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
          <p className="text-center">
            Don't have an account?{' '}
            <a href="/register" className="text-[#207855]">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;