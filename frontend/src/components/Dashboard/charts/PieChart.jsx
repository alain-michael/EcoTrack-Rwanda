import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';



export default function PieActiveArc({ data, title,palette }) {
    return (
        <>
            <h3 className="text-xl text-center font-bold text-primary">
                {title}
            </h3>
            <PieChart
                series={[
                    {
                        data,
                        highlightScope: { faded: 'global', highlighted: 'item' },
                        faded: { innerRadius: 10, additionalRadius: -10, color: 'lightgray' },
                        labelPosition: 'top', // Positioning labels on top
                    },
                ]}
                height={150}
                colors={palette}
            />
        </>
    );
}
