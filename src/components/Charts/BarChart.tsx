import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { initBarChartOptions } from '../../initSeries';

interface BarChartProp {
  height: 350 | 400;
  colors: string[];
  annotations?: any;
  categories?: any;
  valueFormat?: 'default' | 'toFixed';
  series: { name: string; data: number[] }[];
}

interface BarChartState {
  series: { name: string; data: number[] }[];
}

// '막대 그래프 1개' 형상의 차트
const BarChart: React.FC<BarChartProp> = ({
  height,
  colors,
  annotations,
  categories,
  valueFormat,
  series,
}) => {
  const [state, setState] = useState<BarChartState>({ series });
  const [options, setOptions] = useState(
    initBarChartOptions(height, colors, annotations, categories, valueFormat),
  );

  return (
    <div className="mb-2">
      <div id="barChart" className="-ml-5">
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

export default BarChart;
