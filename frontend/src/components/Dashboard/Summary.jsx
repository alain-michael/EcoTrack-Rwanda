import React from 'react';
import PieActiveArc from './charts/PieChart';

function SummaryGrid({ data }) {
    const totalItems = data.length;
    const completedItems = data.filter(item => item.completed).length;
    const activeItems = data.filter(item => !item.completed).length;

    const pieData = [
        { id: 0, value: totalItems, label: 'Total Schedules' },
        { id: 1, value: completedItems, label: 'Completed Schedules' },
        { id: 2, value: activeItems, label: 'Not Done Schedules' }
    ];

    const palette = ['#FF6384', '#36A2EB', '#FFCE56']; // Example colors

    return (
        <div className='flex mt-8 max-lg:flex-wrap'>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 w-full ">
                <div className="p-4 bg-white border border-gray-100 rounded-lg">
                    <h2 className="font-bold text-sm">Total Schedules</h2>
                    <p className="text-3xl">{totalItems}</p>
                </div>
                <div className="p-4 bg-white border border-gray-100 rounded-lg">
                    <h2 className="font-bold text-sm">Completed Schedules</h2>
                    <p className="text-3xl">{completedItems}</p>
                </div>
                <div className="p-4 bg-white border border-gray-100 rounded-lg">
                    <h2 className="font-bold text-sm">Not Done Schedules</h2>
                    <p className="text-3xl">{activeItems}</p>
                </div>
            </div>
            <div className='w-full'>
                <PieActiveArc data={pieData} title="Schedule Summary" palette={palette} />
            </div>
        </div>
    );
}

export default SummaryGrid;
