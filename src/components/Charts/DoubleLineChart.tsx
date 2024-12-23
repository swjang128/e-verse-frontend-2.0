import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { initDoubleLineChartOptions } from '../../initSeries';
import _ from 'lodash';

interface DoubleLineChartProp {
  height: 300 | 350 | 400;
  colors: string[];
  annotations?: any;
  categories?: any;
  valueFormat?: 'default' | 'toFixed';
  series: {
    name: string;
    data: number[];
  }[];
  changedSeries?: boolean;
  setChangedSeries?: (flag: boolean) => void;
}

interface DoubleLineChartState {
  series: {
    name: string;
    data: number[];
  }[];
}

// '꺾은선 그래프 2개' 형상의 차트
const DoubleLineChart: React.FC<DoubleLineChartProp> = ({
  height,
  colors,
  annotations,
  categories,
  valueFormat,
  series,
  changedSeries,
  setChangedSeries,
}) => {
  const [state, setState] = useState<DoubleLineChartState>({ series });

  const [options, setOptions] = useState(
    initDoubleLineChartOptions(
      height,
      colors,
      annotations,
      categories,
      valueFormat,
    ),
  );

  useEffect(() => {
    setState({ series });
    setOptions(
      initDoubleLineChartOptions(
        height,
        colors,
        annotations,
        categories,
        valueFormat,
      ),
    );
    setChangedSeries && setChangedSeries(false);
  }, [series, changedSeries]);

  return (
    <div className="mb-2">
      <div id="doubleLineChart" className="-ml-5">
        <ReactApexChart
          options={options}
          series={state.series}
          type="area"
          height={height}
        />
      </div>
    </div>
  );
};

export default DoubleLineChart;
