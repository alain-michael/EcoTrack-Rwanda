import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

const chartSetting = {
  xAxis: [
    {
      label: 'Number of users',
    },
  ],
  width: 500,
  height: 400,
  margin: { left: 100, right: 50, top: 50, bottom: 50 }, // Adjust margins to avoid cropping
};

const dataset = [
  {
    total: 349,
    achivement: 'ECO-CHAMPION',
  },
  {
    total: 249,
    achivement: 'ECO-MEMBER',
  }
];

const colors = {
  'ECO-CHAMPION': '#FF6384',
  'ECO-MEMBER': 'red',
};

const valueFormatter = (value) => `${value}`;

export default function HorizontalBars() {
  return (
    <BarChart
      dataset={dataset}
      yAxis={[{ scaleType: 'band', dataKey: 'achivement' }]}
      series={[
        {
          dataKey: 'total',
          label: 'Total User Achievements',
          valueFormatter,
          colorAccessor: (datum) => colors[datum.achivement], // Assigning colors based on achievement
        },
      ]}
      layout="horizontal"
      {...chartSetting}
    />
  );
}
