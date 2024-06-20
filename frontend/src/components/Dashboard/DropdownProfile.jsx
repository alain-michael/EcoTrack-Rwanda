import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { resetStateToDefault } from '../../features/SharedDataSlice/SharedData';
import createAxiosInstance from '../../features/AxiosInstance';
import UserProfile from './userProfile';

const DropdownProfile = () => {
  const userInfo = useSelector((state) => state.sharedData.usersLogin);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const instance = createAxiosInstance();
  const [showModal, setShowModal] = useState(false);

  const logout = () => {
    // instance().post('/logout').then((response) => {
    //   if (response.status === 200) {
    //   }
    // }).catch((error) => {
    //   dispatch(resetStateToDefault());
    //   console.log(error);
    //   console.log(`Error: ${error.response.data.error}`);
    // })
    dispatch(resetStateToDefault());

  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="relative z-10">

        <div className="h-12 w-12 bg-gray-200 overflow-hidden rounded-full cursor-pointer" onClick={()=>toggleDropdown()}>
          <img src="/logo.png" alt="" className='w-full h-full object-contain' />
        </div>

        {isOpen && (
          <div ref={dropdownRef} className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              <a onClick={() =>{ setShowModal(true);setIsOpen(false)}} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                View Profile
              </a>
              <a onClick={() => logout()} href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                Logout
              </a>
              {/*        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
              Change Password
            </a> */}
            </div>
          </div>
        )}
      </div>
      {showModal && (
        <UserProfile
          userInfo={userInfo}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default DropdownProfile;
