import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

const chartSetting = {
  xAxis: [
    {
      label: 'Number of users',
    },
  ],

  height: 400,
  colors: ['#0096ff'],
  margin: { left: 100, right: 50, top: 50, bottom: 50 }, // Adjust margins to avoid cropping
};



const colors = {
  'ECO-CHAMPION': '#FF6384',
  'ECO-MEMBER': 'red',
};

const valueFormatter = (value) => `${value}`;

export default function HorizontalBars({dataset, title}) {
  return (
    <BarChart
      dataset={dataset}
      yAxis={[{ scaleType: 'band', dataKey: 'achivement' }]}
      series={[
        {
          dataKey: 'total',
          label: title,
          valueFormatter,
        },
      ]}
      layout="horizontal"
      {...chartSetting}
    />
  );
}
