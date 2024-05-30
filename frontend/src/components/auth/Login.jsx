import React from 'react'

function Login() {
    const inputStyle =
      'flex h-9 w-[300px] rounded-md border border-input outline-none bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent ';
  return (
    <div>
      <div className="grid gap-6 ">
        <p>
          <span className="text-2xl font-bold">Sign In</span>
        </p>
        <form className="">
          <div className="grid gap-2">
            <div className="grid gap-1">
              <p>Email:</p>
              <input className={inputStyle} placeholder="Email Address" />
              <p>Password :</p>
              <input
                className={inputStyle}
                placeholder="Password"
                type="password"
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