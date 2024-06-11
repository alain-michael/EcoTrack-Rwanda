import React from "react";

const TextField = ({ label, type, formik, ...props }) => {
  const { field, meta } = formik;

  return (
    <div className="block w-full">
      {label && (
        <label className="block text-sm font-medium leading-6 text-gray-900">
          {label}
        </label>
      )}
      <div className={`mt-2 w-full`}>
        <input
          {...field}
          {...props}
          type={type}
          className={`block w-full rounded-md border-0 py-2 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset focus:ring-1 focus:ring-inset ${
            meta.error
              ? `focus:ring-red-500 ring-red-300 placeholder:text-red-400`
              : `focus:ring-green ring-gray-300 placeholder:text-gray-400`
          } sm:text-sm sm:leading-6 outline-none`}
        />
        {meta.touched && meta.error && (
          <label className="block text-sm leading-6 text-red-500">
            {meta.error}
          </label>
        )}
      </div>
    </div>
  );
};

export default TextField;
