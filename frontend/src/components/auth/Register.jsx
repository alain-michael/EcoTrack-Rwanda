import React from 'react'
import { useFormik } from 'formik'
import axios from 'axios'
import * as Yup from 'yup'

function Register() {

  const formik = useFormik(
    {
      initialValues: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      },

      validationSchema: Yup.object({
        name: Yup.string()
          .max(40, 'Must be 40 characters or less')
          .required('Required'),
        email: Yup.string().email('Invalid email address').required('Required'),
        password: Yup.string()
          .min(6, 'Must be 6 characters or more')
          .required('Required'),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref('password'), null], 'Passwords must match')
          .required('Required'),
      }),
      onSubmit: (values) => {
        axios.post('http://127.0.0.1:5000/api/register', values)
        .then(res => console.log(res.data))
      },
    }
  )

   const inputStyle =
     'flex h-9 w-[300px] rounded-md border border-input outline-none bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent ';
   return (
     <div>
       <div className="grid gap-6 ">
         <p>
           <span className="text-2xl font-bold">Sign Up</span>
           <p>
             <span className="text-sm text-gray-500">
               {' '}
               Start your amazing journey
             </span>
           </p>
         </p>
         <form onSubmit={formik.handleSubmit} className="">
           <div className="grid gap-2">
             <div className="grid gap-1">
               <p>Name:</p>
               <input className={inputStyle} name="name" placeholder="Enter your name" value={formik.values.name} onChange={formik.handleChange} />
               {formik.errors.name && formik.touched.name ? (<div className="text-red-500">{formik.errors.name}</div>) : null}
               <p>Email:</p>
               <input className={inputStyle} name="email" placeholder="Enter your email" value={formik.values.email} onChange={formik.handleChange} />
               {formik.errors.email && formik.touched.email ? (<div className="text-red-500">{formik.errors.email}</div>) : null}
               <p>Password :</p>
               <input
                 className={inputStyle}
                 placeholder="Create a password"
                 type="password"
                 name="password"
                 value={formik.values.password}
                 onChange={formik.handleChange}
               />
                {formik.errors.password && formik.touched.password ? (<div className="text-red-500">{formik.errors.password}</div>) : null}
               <p>Confirm password :</p>
               <input
                 className={inputStyle}
                 placeholder="Confirm your password"
                 type="password"
                 name="confirmPassword"
                 value={formik.values.confirmPassword}
                 onChange={formik.handleChange}
               />
               {formik.errors.confirmPassword && formik.touched.confirmPassword ? (<div className="text-red-500">{formik.errors.confirmPassword}</div>) : null}
             </div>
             <div>
               <button className="w-[300px] h-9 bg-[#207855] text-white rounded-md mt-4">
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
           <p className="text-center">
             Already have an account?{' '}
             <a href="/login" className="text-[#207855]">
               Log in
             </a>
           </p>
         </div>
       </div>
     </div>
   );
}

export default Register