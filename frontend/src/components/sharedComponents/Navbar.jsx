import React from "react";

const Navbar = () => {
  return (
    <div className="right text-center  lg:block max-w-[1200px] mx-auto pt-12 mb-8 md:mb-0 hidden">
      <a
        href="/auth"
        className="p-3 px-4 rounded-md bg-green-900 text-white"
        rel="noopener noreferrer"
      >
        Get Started
      </a>
    </div>
  );
};

export default Navbar;
