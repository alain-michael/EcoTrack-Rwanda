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

const valueFormatter = (value) => `${value}`;

export default function HorizontalBars() {
  return (
    <BarChart
      dataset={dataset}
      yAxis={[{ scaleType: 'band', dataKey: 'achivement' }]}
      series={[{ dataKey: 'total', label: 'Total User Achievements', valueFormatter }]}
      layout="horizontal"
      {...chartSetting}
    />
  );
}
