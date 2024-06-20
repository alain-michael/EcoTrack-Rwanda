import React from 'react';

function SummaryGrid({ data }) {
  const totalItems = data.length;
  const completedItems = data.filter(item => item.completed).length;
  const activeItems = data.filter(item => item.status).length;


  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
      <div className="p-4 bg-white border border-gray-100 rounded-lg ">
        <h2 className="text-xl font-bold">Total Items</h2>
        <p className="text-3xl">{totalItems}</p>
      </div>
      <div className="p-4 bg-white border border-gray-100 rounded-lg ">
        <h2 className="text-xl font-bold">Completed Items</h2>
        <p className="text-3xl">{completedItems}</p>
      </div>
      <div className="p-4 bg-white border border-gray-100 rounded-lg ">
        <h2 className="text-xl font-bold">Active Items</h2>
        <p className="text-3xl">{activeItems}</p>
      </div>
    </div>
  );
}

export default SummaryGrid;
