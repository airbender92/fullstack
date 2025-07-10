import React, { useState, useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import { DatePicker, Button } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import 'echarts';
import { useStore } from '@/stores/useStore';
import { observer } from 'mobx-react'
import { emit } from '@/utils/event-bus';


interface FrequencyData {
  redBallFrequency: Record<number, number>;
  blueBallFrequency: Record<number, number>;
}

interface TimeRangeOption {
  value: string;
  label: string;
}

const LotteryChart: React.FC = observer(() => {
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
  const chartRef = useRef<HTMLDivElement>(null);

  const store = useStore();
  const { error, loading, lotteries, fetchLotteriesByRange } = store.LotteryStore;

  const handleDateChange = (dates: [Dayjs | null, Dayjs | null] | null, _dateStrings: [string, string]) => {
    setDateRange(dates ?? [null, null]);
  };

    // 格式化日期显示为更友好的格式
  const formatDate = (dateStr: string) => {
    try {
      return dayjs(dateStr).format('MM-DD');
    } catch (e) {
      return dateStr;
    }
  };

  const getChartOptions = () => {
    if (!lotteries || lotteries.length === 0) {
      return {
        title: { text: '暂无数据', left: 'center' },
        xAxis: {},
        yAxis: {},
        series: []
      };
    }
    // x 轴为开奖日期，y 轴为球号
    const redData: { value: [string, number] }[] = [];
    const blueData: { value: [string, number] }[] = [];
    lotteries.forEach((item: any) => {
      const date = item.date || item.openDate || item.expect || '';
      // 假设 item.redBalls 是红球数组，item.blueBall 是蓝球号码
      if (Array.isArray(item.redBalls)) {
        item.redBalls.forEach((num: number) => {
          redData.push({ value: [date, num] });
        });
      }
      if (item.blueBall) {
        blueData.push({ value: [date, item.blueBall] });
      }
    });
    return {
      title: { text: '双色球号码散点分布', left: 'center' },
      tooltip: {
        trigger: 'item', formatter: (params: any) => {
          return `日期: ${params.value[0]}<br/>号码: ${params.value[1]}`;
        }
      },
      legend: { data: ['红球', '蓝球'], top: 30 },
      xAxis: {
        type: 'category',
        name: '日期',
        data: lotteries.map((item: any) => item.date || item.openDate || item.expect || ''),
        axisLabel: { 
          rotate: 45,
          // 使用函数格式化日期显示
          formatter: (value: string) => formatDate(value)
        },
         axisTick: { interval: 2 }
      },
      yAxis: {
        type: 'value',
        name: '球号',
        min: 1,
        max: 33,
        interval: 1
      },
      series: [
        {
          name: '红球',
          type: 'scatter',
          data: redData,
          itemStyle: { color: '#e74c3c' },
          symbolSize: 10
        },
        {
          name: '蓝球',
          type: 'scatter',
          data: blueData,
          itemStyle: { color: '#3498db' },
          symbolSize: 10
        }
      ]
    };
  };


  const loadData = async () => {
    if (!dateRange[0] || !dateRange[1]) {
      emit('warning', '请选择开始和结束日期');
      return;
    }
    try {
      const params = {
        startDate: dateRange[0].format('YYYY-MM-DD'),
        endDate: dateRange[1].format('YYYY-MM-DD'),
      };
      await fetchLotteriesByRange(params);
    } catch (err: any) {
      console.log('err', err)
    }
  };


  // 监听错误状态，在错误发生时显示错误信息
  useEffect(() => {
    if (error) {
      console.error('数据加载错误:', error);
    }
  }, [error]);

  return (
    <div className="container mx-auto p-4 bg-white rounded-lg shadow-lg">
      {/* 选择时间范围 */}
      <div className="mb-6 flex justify-center">
        <DatePicker.RangePicker
          value={dateRange}
          onChange={handleDateChange}
          allowClear={false}
          format="YYYY-MM-DD"
          style={{ marginRight: 16 }}
          disabledDate={current => current && current > dayjs()}
        />
        <Button type="primary" onClick={loadData} disabled={loading}>
          查询
        </Button>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">错误:</strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* 加载状态 */}
      {loading && (
        <div className="h-[500px] flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* 图表容器 */}
      {!loading && (
        <div className="h-[600px]" ref={chartRef}>
          <ReactECharts option={getChartOptions()} style={{ height: '100%' }} />
        </div>
      )}

      {/* 图表下方的说明 */}
      <div className="mt-6 text-gray-600 text-sm">
        <p>说明: 本图表展示了双色球在不同时间段内各个号码的出现频率。</p>
        <p className="mt-2">红球范围: 01-33, 蓝球范围: 01-16</p>
      </div>
    </div>
  );
});

export default LotteryChart;    