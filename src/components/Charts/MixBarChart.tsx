import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { initMixBarChartOptions } from '../../initSeries';

interface MixBarChartProp {
  height: 300 | 350 | 400;
  colors: string[];
  annotations?: any;
  categories?: any;
  valueFormat?: 'default' | 'toFixed';
  series: { name: string; data: number[] }[];
}

interface MixBarChartState {
  series: { name: string; data: number[] }[];
}

// '믹스된 막대 그래프 1개' 형상의 차트
const MixBarChart: React.FC<MixBarChartProp> = ({
  height,
  colors,
  annotations,
  categories,
  valueFormat,
  series,
}) => {
  const [state, setState] = useState<MixBarChartState>({ series });
  const [options, setOptions] = useState(
    initMixBarChartOptions(
      height,
      colors,
      annotations,
      categories,
      valueFormat,
    ),
  );

  return (
    <div id="mixBarChart" className="-ml-3">
      <ReactApexChart
        options={options}
        series={state.series}
        type="bar"
        height={height}
      />
    </div>
  );
};

export default MixBarChart;
