import React from 'react';
import requests from '../../assets/requests.svg';
import requestsBlack from '../../assets/requests_black.svg';

import dots from '../../assets/dots.svg';
function Requests() {
  return (
    <div className="mt-10">
      <div className="flex space-x-32">
      </div>
      <div className="flex">
        <div className="font-medium bg-gray-100 flex py-3 px-12 cursor-pointer">
          <img src={requestsBlack} alt="" className="w-[20px]" />
          <p>Available Requests</p>
        </div>
        <div className="font-medium bg-gray-200 flex py-3 px-12 cursor-pointer">
          <img src={requestsBlack} alt="" className="w-[20px]" />
          <p>My Requests</p>
        </div>
      </div>
      {/*available requests table */}
      <div className="flex">
        <table className="mt-2 border border-gray-100 shadow-md">
          <thead className="shadow-lg mb-2">
            <tr className="">
              <th className="text-left text-gray-500 font-medium  px-12 py-2">
                #
              </th>
              <th className="text-left text-gray-500 font-medium  px-12 py-2">
                NAME
              </th>
              <th className="text-left text-gray-500 font-medium px-12 py-2">
                EMAIL
              </th>
              <th className="text-left text-gray-500 font-medium px-12 py-2">
                PHONE
              </th>
              <th className="text-left text-gray-500 font-medium px-12 py-2">
                ADDRESS
              </th>
              <th className="text-left text-gray-500 font-medium px-12 py-2">
                REQUEST
              </th>
              <th className="text-left text-gray-500 font-medium px-12 py-2">
                ACTION
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-gray-200 ">
              <td className="px-10 py-2">1.</td>
              <td className="px-10 py-2">John Doe</td>
              <td className="px-10 py-2">johndoe@mail.com</td>
              <td className="px-10 py-2">1234567890</td>
              <td className="px-10 py-2">123, Main Street, Lagos</td>
              <td className="px-10 py-2">Plastic</td>
              <td className="px-10 py-2">
                <img src={dots} alt="" className="w-[25px] cursor-pointer" />
              </td>
            </tr>
            <tr className="">
              <td className="  px-10 py-2">2.</td>
              <td className="  px-10 py-2">John Doe</td>
              <td className=" px-10 py-2">johndoe@mail.com</td>
              <td className=" px-10 py-2">1234567890</td>
              <td className=" px-10 py-2">123, Main Street, Lagos</td>
              <td className=" px-10 py-2">Plastic</td>
              <td className="px-10 py-2">
                <img src={dots} alt="" className="w-[25px] cursor-pointer" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* my job requets table */}
      <div className="flex">
        <table className="mt-2 border border-gray-100 shadow-md">
          <thead className="shadow-lg mb-2">
            <tr className="">
              <th className="text-left text-gray-500 font-medium  px-12 py-2">
                #
              </th>
              <th className="text-left text-gray-500 font-medium  px-12 py-2">
                NAME
              </th>
              <th className="text-left text-gray-500 font-medium px-12 py-2">
                EMAIL
              </th>
              <th className="text-left text-gray-500 font-medium px-12 py-2">
                PHONE
              </th>
              <th className="text-left text-gray-500 font-medium px-12 py-2">
                ADDRESS
              </th>
              <th className="text-left text-gray-500 font-medium px-12 py-2">
                EXPECTED AT
              </th>
              <th className="text-left text-gray-500 font-medium px-12 py-2">
                ACTION
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-gray-200 ">
              <td className="px-11 py-2">1.</td>
              <td className="px-11 py-2">John Doe</td>
              <td className="px-11 py-2">johndoe@mail.com</td>
              <td className="px-11 py-2">1234567890</td>
              <td className="px-11 py-2">123, Main Street, Lagos</td>
              <td className="px-11 py-2">10:00 PM</td>
              <td className="px-11 py-2">
                <a href="#" className="">
                  <button className="w-[100px] h-9 bg-[#207855] text-white rounded-md  outline-none">
                    Start Job
                  </button>
                </a>
              </td>
            </tr>
            <tr className="">
              <td className="px-11 py-2">2.</td>
              <td className="px-11 py-2">John Doe</td>
              <td className="px-11 py-2">johndoe@mail.com</td>
              <td className="px-11 py-2">1234567890</td>
              <td className="px-11 py-2">123, Main Street, Lagos</td>
              <td className="px-11 py-2">10:00 PM</td>
              <td className="px-11 py-2">
                <a href="#" className="">
                  <button className="w-[100px] h-9 bg-[#207855] text-white rounded-md  outline-none">
                    Start Job
                  </button>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Requests;
