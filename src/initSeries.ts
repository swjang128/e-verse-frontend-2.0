import { ApexOptions } from 'apexcharts';
import { t } from 'i18next';
import _ from 'lodash';

interface FilteredSeriesValuesProp {
  type: 'month' | 'date' | 'hour' | 'hourlyRates' | 'etc';
  element: any;
  typedValue: any; // string | string[]
  filterKey: string;
  valueKey: string;
  range?: number;
}

interface FilteredSeriesValuesExtendsProp {
  type: 'month' | 'date' | 'hour' | 'hourlyRates' | 'etc';
  element: any;
  monthValue: string;
  dateValue: string;
  filterKey: string;
  valueKey: string;
  range?: number;
}

// 일년에 몇 달이 있는지 반환 - 12 고정
export const getNumberOfMonthInYear = () => {
  return 12;
};

// 일자를 넣으면 그 일자가 있는 달의 최종 일수를 반환
export const getNumberOfDaysInCurrentMonth = (date: string) => {
  return new Date(
    new Date(date).getFullYear(),
    new Date(date).getMonth() + 1,
    0,
  ).getDate();
};

// 하루에 몇 시간이 있는지 반환 - 24 고정
export const getNumberOfHoursInDay = () => {
  return 24;
};

// 시리즈 데이터를 초기화한다. 각 기준에 따라 0으로 채워 넣는다.
// '분' 기준 => range : 60
// '시' 기준 => range : 24
// '일' 기준 => range : 28, 30, 31
// '월' 기준 => range : 12
// 기타 숫자 들어온 만큼 range로 구성
export const initSeriesData = (range: number) => {
  return _.reduce(
    _.range(range),
    (acc: any, item: number) => {
      acc[item] = 0;
      return acc;
    },
    {},
  );
};

// 데이터를 넣으면 값이 존재하는지, children들의 length가 0이상인지 체크한다.
// API에서는 값이 없으면 안보내기 때문
const isElementEmpty = (element: any) => {
  // element가 array든 object든 모두 적용된다.
  if (element && element !== undefined && Object.keys(element).length > 0) {
    return false;
  }
  return true;
};

const isElementTypedValueEmpty = (element: any, typedValue: string | '') => {
  if (!isElementEmpty(element) && element[typedValue]) {
    return false;
  }
  return true;
};

// element[typedValue] or element를 forEach로 돌려서 filterKey에 해당하는 row에서
// valueKey로 값을 가져와 init된 dataMap에 매핑하고 Object.values 반환.
// result Data: [0,0,0,0,0,55,123,0,0 ...]
export const getFilteredSeriesValuesExtends = ({
  type,
  element,
  monthValue,
  dateValue,
  filterKey,
  valueKey,
  range,
}: FilteredSeriesValuesExtendsProp): any[] => {
  let dataMap: any = null;
  let isExist = false;

  switch (type) {
    case 'date':
      dataMap = initSeriesData(getNumberOfDaysInCurrentMonth(monthValue));
      if (monthValue !== '') {
        isExist =
          !isElementEmpty(element) &&
          !isElementEmpty(element.monthlyResponse[monthValue]);
      }
      break;
    case 'hour':
      dataMap = initSeriesData(getNumberOfHoursInDay());
      if (monthValue !== '' && dateValue !== '') {
        isExist =
          !isElementEmpty(element) &&
          !isElementEmpty(element.monthlyResponse[monthValue]) &&
          !isElementEmpty(
            element.monthlyResponse[monthValue].dailyResponse[dateValue],
          );
      }
      break;
    default:
      break;
  }

  try {
    if (isExist) {
      switch (type) {
        case 'date':
          const { dailyResponse } = element.monthlyResponse[monthValue];
          Object.values(dailyResponse).forEach((entry: any) => {
            let entryValue =
              valueKey.split('.').length > 1
                ? entry[valueKey.split('.')[0]][valueKey.split('.')[1]]
                : entry[valueKey];
            if (!isElementEmpty(entry[filterKey]) && entryValue !== undefined) {
              const date = new Date(entry[filterKey]).getDate();
              dataMap[date - 1] = Math.round(entryValue);
            }
          });
          break;
        case 'hour':
          const { hourlyResponse } =
            element.monthlyResponse[monthValue].dailyResponse[dateValue];
          hourlyResponse.forEach((entry: any) => {
            let entryValue =
              valueKey.split('.').length > 1
                ? entry[valueKey.split('.')[0]][valueKey.split('.')[1]]
                : entry[valueKey];
            if (!isElementEmpty(entry[filterKey]) && entryValue !== undefined) {
              const hour = new Date(entry[filterKey]).getHours();
              dataMap[hour] = Math.round(entryValue);
            }
          });
          break;
        default:
          break;
      }
    }
  } catch (error) {
    console.error('error', error);
  }

  // dataMap의 values만 추출하여 list 반환
  return Object.values(dataMap);
};

export const getFilteredSeriesValues = ({
  type,
  element,
  typedValue,
  filterKey,
  valueKey,
}: FilteredSeriesValuesProp): any[] => {
  let dataMap: any = null;
  let targetElement = element;
  let isExist = false;

  switch (type) {
    case 'month':
      break;
    case 'date':
      dataMap = initSeriesData(getNumberOfDaysInCurrentMonth(typedValue));
      isExist = !isElementEmpty(targetElement);
      break;
    case 'hour':
      dataMap = initSeriesData(getNumberOfHoursInDay());
      if (typedValue === '') {
        isExist = !isElementEmpty(element);
      } else {
        isExist =
          !isElementTypedValueEmpty(element, typedValue) &&
          !isElementEmpty(element[typedValue]);
        if (isExist) {
          // typedValue를 넣었을 시 forEach를 도는 targetElement는 element[typedValue] 가 된다.
          // typedValue가 '' 일시 forEach를 도는 targetElement는 element 그대로이다.
          targetElement = element[typedValue];
        }
      }
      break;
    case 'hourlyRates':
      dataMap = initSeriesData(getNumberOfHoursInDay());
      isExist = !isElementEmpty(targetElement);
      break;
    case 'etc':
      dataMap = {};
      isExist = !isElementEmpty(targetElement);
      break;
    default:
      break;
  }

  try {
    if (filterKey === '') {
      filterKey = valueKey;
    }

    if (isExist) {
      switch (type) {
        case 'month':
          break;
        case 'date':
          Object.keys(targetElement).forEach((key: any) => {
            targetElement[key].forEach((entry: any) => {
              let entryValue =
                valueKey.split('.').length > 1
                  ? entry[valueKey.split('.')[0]][valueKey.split('.')[1]]
                  : entry[valueKey];
              if (entryValue !== undefined) {
                const date = new Date(key).getDate();
                dataMap[date - 1] = Math.round(entryValue); // date는 1부터 시작
              }
            });
          });
          break;
        case 'hour':
          targetElement.forEach((entry: any) => {
            let entryValue =
              valueKey.split('.').length > 1
                ? entry[valueKey.split('.')[0]][valueKey.split('.')[1]]
                : entry[valueKey];
            if (!isElementEmpty(entry[filterKey]) && entryValue !== undefined) {
              const hour = new Date(entry[filterKey]).getHours();
              dataMap[hour] = Math.round(entryValue);
            }
          });
          break;
        case 'hourlyRates':
          Object.keys(targetElement).forEach((key: any) => {
            let entryValue =
              valueKey.split('.').length > 1
                ? targetElement[key][valueKey.split('.')[0]][
                    valueKey.split('.')[1]
                  ]
                : targetElement[key][valueKey];
            if (entryValue !== undefined) {
              dataMap[key] = entryValue;
            }
          });
          break;
        case 'etc':
          _.flatMap(targetElement, (monthlyEntry: any) => {
            _.flatMap(
              monthlyEntry.dailyResponse,
              (dailyEntry: any, index: number) => {
                let dailyEntryValue =
                  valueKey.split('.').length > 1
                    ? dailyEntry[valueKey.split('.')[0]][valueKey.split('.')[1]]
                    : dailyEntry[valueKey];
                if (dailyEntryValue !== undefined) {
                  dataMap[index] = Math.round(dailyEntryValue);
                }
              },
            );
          });

          // Object.keys(targetElement).forEach((key: any) => {
          //   targetElement[key].forEach((entry: any) => {
          //     let entryValue =
          //       valueKey.split('.').length > 1
          //         ? entry[valueKey.split('.')[0]][valueKey.split('.')[1]]
          //         : entry[valueKey];
          //     if (entryValue !== undefined) {
          //       const date = new Date(key).getDate();
          //       dataMap[date - 1] = Math.round(entryValue); // date는 1부터 시작
          //     }
          //   });
          // });

          // return _.flatMap(response.data.monthlyResponse, (month: any) => {
          //   return _.flatMap(month.dailyResponse, (entry: any) => {
          //     return _.map(entry.hourlyResponse, (hourlyEntry: any) => {
          //       return {
          //         referenceTime: moment(hourlyEntry.referenceTime).format(
          //           'YYYY-MM-DD HH:mm:ss',
          //         ),
          //         usage: `${Math.round(hourlyEntry.usage).toLocaleString('en-US')} kwh`,
          //         forecastUsage: `${Math.round(hourlyEntry.forecastUsage).toLocaleString('en-US')} kwh`,
          //         bill: `${Math.round(hourlyEntry.bill).toLocaleString('en-US')} $`,
          //         forecastBill: `${Math.round(hourlyEntry.forecastBill).toLocaleString('en-US')} $`,
          //         deviationRate: `${hourlyEntry.deviationRate.toFixed(2)} %`,
          //       };
          //     });
          //   });
          // });

          break;
        default:
          break;
      }
    }
  } catch (error) {
    console.error('error', error);
  }

  // dataMap의 values만 추출하여 list 반환
  return Object.values(dataMap);
};

// Dashboard에 사용되는 기본적인 Option의 정의 - BarChart
export const initBarChartOptions = (
  height: number,
  colors: string[],
  annotations?: any,
  categories?: any,
  valueFormat?: 'default' | 'toFixed', // default : 반올림, toFixed : 소숫점 2자리
): ApexOptions => {
  return {
    annotations,
    colors,
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'bar',
      height,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '70%',
        borderRadius: 2,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ['transparent'],
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'right',
      fontFamily: 'Satoshi',
      markers: {
        radius: 99,
      },
      showForSingleSeries: true,
    },
    grid: {
      show: true,
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },

    tooltip: {
      x: {
        show: false,
      },
      // y: {
      //   formatter: function (val) {
      //     return val;
      //   },
      // },
    },
    xaxis: {
      type: 'category',
      categories: categories || [],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: '0px',
        },
      },
      min: 0,
      tickAmount: 5,
      forceNiceScale: true,
      labels: {
        formatter: function (val: any) {
          if (valueFormat === 'toFixed') {
            return val.toFixed(2).toLocaleString('en-US');
          } else {
            return Math.round(val).toLocaleString('en-US');
          }
        },
      },
    },
  };
};

// Dashboard에 사용되는 기본적인 Option의 정의 - DoubleBarChart
export const initDoubleBarChartOptions = (
  height: number,
  colors: string[],
  annotations?: any,
  categories?: any,
  valueFormat?: 'default' | 'toFixed', // default : 반올림, toFixed : 소숫점 2자리
): ApexOptions => {
  return {
    annotations,
    colors,
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'bar',
      height,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '70%',
        borderRadius: 2,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ['transparent'],
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'right',
      fontFamily: 'Satoshi',

      markers: {
        radius: 99,
      },
    },
    grid: {
      show: true,
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },

    tooltip: {
      x: {
        show: false,
      },
      // y: {
      //   formatter: function (val) {
      //     return val;
      //   },
      // },
    },
    xaxis: {
      type: 'category',
      categories: categories || [],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: '0px',
        },
      },
      min: 0,
      tickAmount: 5,
      forceNiceScale: true,
      labels: {
        formatter: function (val: any) {
          if (valueFormat === 'toFixed') {
            return val.toFixed(2).toLocaleString('en-US');
          } else {
            return Math.round(val).toLocaleString('en-US');
          }
        },
      },
    },
  };
};

// Dashboard에 사용되는 기본적인 Option의 정의 - LineChart
export const initLineChartOptions = (
  height: number,
  colors: string[],
  annotations?: any,
  categories?: any,
  valueFormat?: 'default' | 'toFixed2' | 'toFixed4', // default : 반올림, toFixed2 : 소숫점 2자리, toFixed4 : 소숫점 4자리
): ApexOptions => {
  return {
    annotations,
    colors,
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'right',
      showForSingleSeries: true,
    },
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      height,
      type: 'area',
      dropShadow: {
        enabled: true,
        color: '#623CEA14',
        top: 10,
        blur: 4,
        left: 0,
        opacity: 0.1,
      },
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 350,
          },
        },
      },
    ],
    stroke: {
      width: [2, 2],
      curve: 'straight',
    },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 4,
      colors: '#fff',
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      hover: {
        size: undefined,
        sizeOffset: 5,
      },
      strokeColors: colors,
    },
    noData: {
      text: t('No data available'), // 데이터가 없을 때 표시할 문구
      align: 'center',
      verticalAlign: 'middle',
      offsetX: 0,
      offsetY: 0,
      style: {
        color: '#888',
        fontSize: '14px',
      },
    },
    xaxis: {
      type: 'category',
      categories: categories || [],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: '0px',
        },
      },
      min: 0,
      tickAmount: 5,
      labels: {
        formatter: function (val: any) {
          if (valueFormat === 'toFixed4') {
            return val.toFixed(4).toLocaleString('en-US');
          } else if (valueFormat === 'toFixed2') {
            return val.toFixed(2).toLocaleString('en-US');
          } else {
            return Math.round(val).toLocaleString('en-US');
          }
        },
      },
    },
  };
};

// Dashboard에 사용되는 기본적인 Option의 정의 - DoubleLineChart
export const initDoubleLineChartOptions = (
  height: number,
  colors: string[],
  annotations?: any,
  categories?: any,
  valueFormat?: 'default' | 'toFixed', // default : 반올림, toFixed : 소숫점 2자리
): ApexOptions => {
  return {
    annotations,
    colors,
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'right',
    },
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      height,
      type: 'area',
      dropShadow: {
        enabled: true,
        color: '#623CEA14',
        top: 10,
        blur: 4,
        left: 0,
        opacity: 0.1,
      },
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 350,
          },
        },
      },
    ],
    stroke: {
      width: [2, 2],
      curve: 'straight',
    },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 4,
      colors: '#fff',
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      hover: {
        size: undefined,
        sizeOffset: 5,
      },
      strokeColors: colors,
    },
    xaxis: {
      type: 'category',
      categories: categories || [],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: '0px',
        },
      },
      min: 0,
      tickAmount: 5,
      labels: {
        formatter: function (val: any) {
          if (valueFormat === 'toFixed') {
            return val.toFixed(2).toLocaleString('en-US');
          } else {
            return Math.round(val).toLocaleString('en-US');
          }
        },
      },
    },
    noData: {
      text: t('No data available'), // 데이터가 없을 때 표시할 문구
      align: 'center',
      verticalAlign: 'middle',
      offsetX: 0,
      offsetY: 0,
      style: {
        color: '#888',
        fontSize: '14px',
      },
    },
  };
};

// Dashboard에 사용되는 기본적인 Option의 정의 - MixBarChart
export const initMixBarChartOptions = (
  height: number,
  colors: string[],
  annotations?: any,
  categories?: any,
  valueFormat?: 'default' | 'toFixed', // default : 반올림, toFixed : 소숫점 2자리
): ApexOptions => {
  return {
    annotations,
    colors,
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'bar',
      height,
      stacked: true,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },

    responsive: [
      {
        breakpoint: 1536,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 0,
              columnWidth: '25%',
            },
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 0,
        columnWidth: '25%',
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'right',
      fontFamily: 'Satoshi',
      fontWeight: 500,
      fontSize: '14px',
      markers: {
        radius: 99,
      },
    },
    fill: {
      opacity: 1,
    },
    xaxis: {
      type: 'category',
      categories: categories || [],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: '0px',
        },
      },
      min: 0,
      tickAmount: 5,
      labels: {
        formatter: function (val: any) {
          if (valueFormat === 'toFixed') {
            return val.toFixed(2).toLocaleString('en-US');
          } else {
            return Math.round(val).toLocaleString('en-US');
          }
        },
      },
    },
  };
};

// Dashboard에 사용되는 기본적인 Option의 정의 - RadialBarChart
export const initRadialBarChartOptions = (
  height: number,
  colors: string[],
  annotations?: any,
  categories?: any,
  valueFormat?: 'default' | 'toFixed', // default : 반올림, toFixed : 소숫점 2자리
): ApexOptions => {
  return {
    annotations,
    colors,
    chart: {
      type: 'radialBar',
      height,
    },
    labels: [t('Cumulative Usage')],
    legend: {
      show: false,
      position: 'bottom',
    },
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 10,
          size: '85%',
        },
        dataLabels: {
          name: {
            offsetY: -20,
            show: true,
            color: '#7A7A7A',
            fontSize: '20px',
          },
          value: {
            show: true,
            color: 'black',
            fontSize: '35px',
            formatter: function (val: any) {
              if (valueFormat === 'toFixed') {
                return `${val.toFixed(2).toLocaleString('en-US')} kwh`;
              } else {
                return `${Math.round(val).toLocaleString('en-US')} kwh`;
              }
            },
          },
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        gradientToColors: ['#349ED4'],
        stops: [0, 100],
      },
    },
    stroke: {
      lineCap: 'round',
    },
    xaxis: {
      type: 'category',
      categories: categories || [],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: '0px',
        },
      },
      min: 0,
      tickAmount: 5,
      labels: {
        formatter: function (val: any) {
          if (valueFormat === 'toFixed') {
            return val.toFixed(2).toLocaleString('en-US');
          } else {
            return Math.round(val).toLocaleString('en-US');
          }
        },
      },
    },
  };
};

// Dashboard에 사용되는 기본적인 Option의 정의 - DatepickLineChart
export const initDatepickLineChartOptions = (
  height: number,
  colors: string[],
  annotations?: any,
  categories?: any,
  valueFormat?: 'default' | 'toFixed', // default : 반올림, toFixed : 소숫점 2자리
): ApexOptions => {
  return {
    annotations,
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'right',
      showForSingleSeries: true,
    },
    colors,
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      height,
      type: 'area',
      dropShadow: {
        enabled: true,
        color: '#623CEA14',
        top: 10,
        blur: 4,
        left: 0,
        opacity: 0.1,
      },
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          markers: {
            size: 0,
          },
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 350,
          },
        },
      },
    ],
    stroke: {
      width: [3, 3],
      curve: 'straight',
    },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 4,
      colors: '#fff',
      strokeColors: colors,
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      hover: {
        size: undefined,
        sizeOffset: 5,
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: '0px',
        },
      },
      min: 0,
      max: 50000, // 초기값으로 설정
      tickAmount: 4,
      labels: {
        formatter: function (val: any) {
          if (valueFormat === 'toFixed') {
            return val.toFixed(2).toLocaleString('en-US');
          } else {
            return Math.round(val).toLocaleString('en-US');
          }
        },
      },
    },
    xaxis: {
      type: 'category',
      categories: categories || [],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    noData: {
      text: t('No data available'), // 데이터가 없을 때 표시할 문구
      align: 'center',
      verticalAlign: 'middle',
      offsetX: 0,
      offsetY: 0,
      style: {
        color: '#888',
        fontSize: '14px',
      },
    },
  };
};
