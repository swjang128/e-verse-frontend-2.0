import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { initLineChartOptions } from '../../initSeries';
import _ from 'lodash';

interface LineChartProp {
  height: 300 | 350 | 400;
  colors: string[];
  annotations?: any;
  categories?: any;
  valueFormat?: 'default' | 'toFixed2' | 'toFixed4';
  series: {
    name: string;
    data: any;
  }[];
  changedSeries?: boolean;
  setChangedSeries?: (flag: boolean) => void;
}

interface LineChartState {
  series: {
    name: string;
    data: any;
  }[];
}

// '꺾은선 그래프 1개' 형상의 차트
const LineChart: React.FC<LineChartProp> = ({
  height,
  colors,
  annotations,
  categories,
  valueFormat,
  series,
  changedSeries,
  setChangedSeries,
}) => {
  const [state, setState] = useState<LineChartState>({ series });
  const [options, setOptions] = useState(
    initLineChartOptions(height, colors, annotations, categories, valueFormat),
  );

  useEffect(() => {
    setState({ series });
    setOptions(
      initLineChartOptions(
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
      <div id="lineChart" className="-ml-5">
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

export default LineChart;
