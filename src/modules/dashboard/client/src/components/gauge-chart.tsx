'use client';

import { Cell, Pie, PieChart } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@repo/ui/components/ui/chart';
import type { ChartConfig } from '@repo/ui/components/ui/chart';

interface GaugeChartProps {
  value: number;
  maxValue?: number;
  minValue?: number;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const chartConfig = {
  value: {
    label: 'Value',
  },
  remaining: {
    label: 'Remaining',
  },
} satisfies ChartConfig;

export function GaugeChart({
  value,
  maxValue = 100,
  minValue = 0,
  label = 'Progress',
  className,
  size = 'md',
  color = 'red',
}: GaugeChartProps) {
  const normalizedValue = Math.max(minValue, Math.min(maxValue, value));
  const percentage = ((normalizedValue - minValue) / (maxValue - minValue)) * 100;
  const remaining = 100 - percentage;

  const data = [
    {
      name: 'value',
      value: percentage,
      fill: color,
    },
    {
      name: 'remaining',
      value: remaining,
      fill: '#eee',
    },
  ];

  const sizeConfig = {
    sm: { width: 120, height: 120, innerRadius: 30, outerRadius: 50 },
    md: { width: 160, height: 120, innerRadius: 40, outerRadius: 70 },
    lg: { width: 200, height: 160, innerRadius: 50, outerRadius: 90 },
  };

  const { width, height, innerRadius, outerRadius } = sizeConfig[size];

  return (
    <div className={className}>
      <ChartContainer config={chartConfig} className="mx-auto aspect-square" style={{ width, height }}>
        <PieChart>
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            startAngle={180}
            endAngle={0}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
      <div className="text-center mt-2">
        <div className="text-2xl font-bold">{normalizedValue}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</div>
      </div>
    </div>
  );
}
