import React from 'react'
import Combining from './charts/BarsChart'
import PieActiveArc from './charts/PieChart'

const AdminAnna = () => {
    //---------------pie chart data
    const Newdata = [
        { id: 0, value: 10, label: `New Waste Collector ` },
        { id: 1, value: 15, label: `New Household ` },
        { id: 2, value: 20, label: `New Adimins ` },
    ];
    const Olddata = [
        { id: 0, value: 10, label: 'Waste Collector ' },
        { id: 1, value: 15, label: 'Household ' },
        { id: 2, value: 20, label: 'Adimins ' },
    ];
    const primaryPalette = ['#FF6384', '#36A2EB', '#FFCE56'];
    const secondaryPalette = ['#87CEEB', '#ADD8E6', '#90EE90'];
    
    return (
        <>
            <div className="flex gap-2 max-xl:flex-wrap">
                <div className="w-full">
                    <Combining data={Newdata} title={"All Users"}></Combining>
                </div>
                <div className="w-full">
                    <PieActiveArc  data={Newdata} palette={primaryPalette} title={"Today Eco-Track Users Analysis"}></PieActiveArc>
                    <PieActiveArc  data={Olddata} palette={secondaryPalette} title={"All Eco-Track Users Analysis"}></PieActiveArc>
                </div>
            </div>
        </>
    )
}
export default AdminAnna
