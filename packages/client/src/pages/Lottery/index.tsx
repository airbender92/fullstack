import React, { useState, useEffect } from 'react';
import { EChartsReact } from 'react-echarts-wrapper';
import 'echarts';
import axios from 'axios';

interface FrequencyData {
  redBallFrequency: Record<number, number>;
  blueBallFrequency: Record<number, number>;
}

interface TimeRangeOption {
  value: string;
  label: string;
}

const LotteryChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>('oneYear');
  const [frequencyData, setFrequencyData] = useState<FrequencyData | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 时间范围选项
  const timeRangeOptions: TimeRangeOption[] = [
    { value: 'threeYears', label: '近三年' },
    { value: 'oneYear', label: '近一年' },
    { value: 'halfYear', label: '近半年' },
    { value: 'threeMonths', label: '近3个月' },
    { value: 'oneMonth', label: '近一个月' },
  ];

  // 获取图表配置
  const getChartOptions = () => {
    if (!frequencyData) return {};

    // 处理红球数据
    const redBalls = Object.keys(frequencyData.redBallFrequency)
      .map(Number)
      .sort((a, b) => a - b);
    const redBallCounts = redBalls.map(
      (ball) => frequencyData?.redBallFrequency[ball] || 0,
    );

    // 处理蓝球数据
    const blueBalls = Object.keys(frequencyData.blueBallFrequency)
      .map(Number)
      .sort((a, b) => a - b);
    const blueBallCounts = blueBalls.map(
      (ball) => frequencyData?.blueBallFrequency[ball] || 0,
    );

    return {
      title: {
        text: `双色球号码频率统计 (${timeRangeOptions.find((option) => option.value === timeRange)?.label || timeRange})`,
        left: 'center',
        textStyle: {
          fontSize: 18,
          fontWeight: 'bold',
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: ['红球', '蓝球'],
        top: '5%',
        left: 'center',
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: [...redBalls, ...blueBalls],
          axisLabel: {
            interval: 0,
            rotate: 45,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '出现次数',
          min: 0,
        },
      ],
      series: [
        {
          name: '红球',
          type: 'bar',
          data: redBallCounts,
          color: '#ff4d4f',
          barWidth: '40%',
        },
        {
          name: '蓝球',
          type: 'bar',
          data: blueBallCounts,
          color: '#1890ff',
          barWidth: '40%',
        },
      ],
    };
  };

  // 加载数据
  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/lottery?timeRange=${timeRange}`);
      setFrequencyData(response.data);
    } catch (err: any) {
      setError(err.message || '获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    loadData();
  }, [timeRange]);

  return (
    <div className="container mx-auto p-4 bg-white rounded-lg shadow-lg">
      {/* 选择时间范围 */}
      <div className="mb-6 flex justify-center">
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {timeRangeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* 加载状态 */}
      {loading && (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">错误:</strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* 图表 */}
      {frequencyData && (
        <div className="h-[500px]">
          <EChartsReact option={getChartOptions()} style={{ height: '100%' }} />
        </div>
      )}

      {/* 图表下方的说明 */}
      <div className="mt-6 text-gray-600 text-sm">
        <p>说明: 本图表展示了双色球在不同时间段内各个号码的出现频率。</p>
        <p className="mt-2">红球范围: 01-33, 蓝球范围: 01-16</p>
      </div>
    </div>
  );
};

export default LotteryChart;
