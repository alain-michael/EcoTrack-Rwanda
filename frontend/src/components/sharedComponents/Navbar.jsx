import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-[#207855] text-white p-1 flex justify-between px-7 h-full w-100%">
      <div className="left flex gap-10 ">
        <a href="/" className="p-2 hover:underline underline-offset-8 " rel="noopener noreferrer">
          Home
        </a>
        <a href="/" className="p-2 hover:underline underline-offset-8 " rel="noopener noreferrer">
          about
        </a>
        <a href="/" className="p-2 hover:underline underline-offset-8 " rel="noopener noreferrer">
          contact
        </a>
      </div>
      <div className="right p-2 bg-green-700">
        <a href="/auth" className="p-2 hover:underline underline-offset-8"  rel="noopener noreferrer">
          Get Started
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
