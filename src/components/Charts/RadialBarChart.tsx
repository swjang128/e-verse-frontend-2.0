import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { initRadialBarChartOptions } from '../../initSeries';

interface RadialBarChartProp {
  height: 300 | 350 | 400;
  colors: string[];
  annotations?: any;
  categories?: any;
  valueFormat?: 'default' | 'toFixed';
  series: number[];
}

interface RadialBarChartState {
  series: number[];
}

// 원 모양 형상의 차트 (원 그래프가 아님)
const RadialBarChart: React.FC<RadialBarChartProp> = ({
  height,
  colors,
  annotations,
  categories,
  valueFormat,
  series,
}) => {
  const [state, setState] = useState<RadialBarChartState>({ series });
  const [options, setOptions] = useState(
    initRadialBarChartOptions(
      height,
      colors,
      annotations,
      categories,
      valueFormat,
    ),
  );

  return (
    <>
      <div
        id="radialBarChart"
        className="mx-auto flex items-center justify-center"
        style={{ pointerEvents: 'none' }}
      >
        <ReactApexChart
          options={options}
          series={state.series}
          type="radialBar"
          height={height}
        />
        {/* <div className="flex items-center gap-1 text-e_green">
          <span className="font-semibold">MoM</span>
          <svg
            width="13"
            height="13"
            viewBox="0 0 13 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.85279 1.67984e-07L8.62907 6.02868e-07L8.62907 6.56566L12.4819 6.56566L6.24093 13L-8.14759e-05 6.56566L3.85279 6.56566L3.85279 1.67984e-07Z"
              fill="#136D61"
            />
          </svg>
          <span>5%</span>
        </div> */}
      </div>
    </>
  );
};

export default RadialBarChart;
