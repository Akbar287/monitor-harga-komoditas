import React, { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { ChartData } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'

interface PriceChartProps {
  data: ChartData[]
  title: string
  className?: string
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF']

interface CustomTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 rounded-md shadow-lg border border-border">
        <p className="text-xs font-medium text-muted-foreground mb-1">
          {label}
        </p>
        {payload.map((entry, index) => (
          <div key={`tooltip-${index}`} className="flex items-center">
            <div
              className="w-2 h-2 rounded-full mr-1"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs font-medium">{entry.name}: </span>
            <span className="text-xs ml-1 font-semibold">
              Rp.{entry.value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export const PriceChart = ({ data, title, className }: PriceChartProps) => {
  const [animatedData, setAnimatedData] = useState<ChartData[]>([])
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  useEffect(() => {
    // Reset the animation when data changes
    setAnimatedData([])
    console.log(data)

    // Create a deep copy of the data with empty data points
    const initialData = data.map((series) => ({
      ...series,
      data: series.data.map((point) => ({ ...point, value: 0 })),
    }))

    setAnimatedData(initialData)

    // Animate the data points
    const timeout = setTimeout(() => {
      setAnimatedData(data)
    }, 300)

    return () => clearTimeout(timeout)
  }, [data])

  // Format the date for the X-axis
  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem)
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  return (
    <div className={cn('chart-container glass-panel', className)}>
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={
            animatedData.length > 0 && animatedData[0].data.length > 0
              ? animatedData[0].data
              : []
          }
          margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}
          />
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxis}
            tick={{ fontSize: 12 }}
            stroke={isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.2)'}
          />
          <YAxis
            tickFormatter={(value) => `Rp.${value}`}
            tick={{ fontSize: 12 }}
            stroke={isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.2)'}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: 15 }} />

          {animatedData.map((series, index) => (
            <Line
              key={series.id}
              type="monotone"
              dataKey="value"
              name={series.name}
              data={series.data}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
              isAnimationActive={true}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PriceChart
