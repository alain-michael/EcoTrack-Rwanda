import React from 'react'

function Register() {
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
         <form className="">
           <div className="grid gap-2">
             <div className="grid gap-1">
               <p>Name:</p>
               <input className={inputStyle} placeholder="Enter your name" />
               <p>Email:</p>
               <input className={inputStyle} placeholder="Enter your email" />
               <p>Password :</p>
               <input
                 className={inputStyle}
                 placeholder="Create a password"
                 type="password"
               />
               <p>Confirm password :</p>
               <input
                 className={inputStyle}
                 placeholder="Confirm your password"
                 type="password"
               />
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