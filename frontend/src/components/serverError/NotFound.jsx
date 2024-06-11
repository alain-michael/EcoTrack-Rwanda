// NotFound.js

import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Link to="/" className="text-blue-500 hover:underline"><img src="/errors/404-Page.gif" alt="" srcset="" /></Link>
    </div>
  );
}

export default NotFound;
