import React from 'react';

function DataTable({ data }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Date</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Repeat</th>
            <th className="px-4 py-2 border">Collector</th>
            <th className="px-4 py-2 border">Latitude</th>
            <th className="px-4 py-2 border">Longitude</th>
            <th className="px-4 py-2 border">Completed</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td className="px-4 py-2 border">{item.id}</td>
              <td className="px-4 py-2 border">{new Date(item.date).toLocaleString()}</td>
              <td className="px-4 py-2 border">{item.status ? 'Active' : 'Inactive'}</td>
              <td className="px-4 py-2 border">{item.repeat}</td>
              <td className="px-4 py-2 border">{item.collector_name}</td>
              <td className="px-4 py-2 border">{item.latitude}</td>
              <td className="px-4 py-2 border">{item.longitude}</td>
              <td className="px-4 py-2 border">{item.completed ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
