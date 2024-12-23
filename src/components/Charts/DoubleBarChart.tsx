import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { initDoubleBarChartOptions } from '../../initSeries';

interface DoubleBarChartProp {
  height: 300 | 350 | 400;
  colors: string[];
  annotations?: any;
  categories?: any;
  valueFormat?: 'default' | 'toFixed';
  series: { name: string; data: number[] }[];
}

interface DoubleBarChartState {
  series: { name: string; data: number[] }[];
}

// '막대 그래프 2개' 형상의 차트
const DoubleBarChart: React.FC<DoubleBarChartProp> = ({
  height,
  colors,
  annotations,
  categories,
  valueFormat,
  series,
}) => {
  const [state, setState] = useState<DoubleBarChartState>({ series });
  const [options, setOptions] = useState(
    initDoubleBarChartOptions(
      height,
      colors,
      annotations,
      categories,
      valueFormat,
    ),
  );

  return (
    <div className="mb-2">
      <div id="doubleBarChart" className="-ml-5">
        <ReactApexChart
          options={options}
          series={state.series}
          type="bar"
          height={height}
        />
      </div>
    </div>
  );
};

export default DoubleBarChart;
