import React from 'react';

function UserProfile({ userInfo, onClose }) {
  return (
    <div className="fixed inset-0 text-primary bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl font-bold mb-4">User Information</h2>
        <p className="mb-2"><strong>Name:</strong> {userInfo.full_name}</p>
        <p className="mb-4"><strong>Email:</strong> {userInfo.email}</p>
        <p className="mb-4"><strong>Share Code:</strong> {userInfo.email}</p>
        <p className="mb-4"><strong>User Role:</strong> {userInfo.user_role}</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default UserProfile;
