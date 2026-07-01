'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
  LabelList,
} from 'recharts'

type ChartEntry = {
  dim: string
  label: string
  score: number
  color: string
}

type TickProps = {
  x?: number | string
  y?: number | string
  payload?: { value: string }
}

export function HollandChart({ data }: { data: ChartEntry[] }) {
  const CustomTick = ({ x = 0, y = 0, payload }: TickProps) => {
    const nx = Number(x)
    const ny = Number(y)
    const entry = data.find((d) => d.dim === payload?.value)
    return (
      <g transform={`translate(${nx},${ny})`}>
        <text
          x={0}
          y={0}
          dy={14}
          textAnchor="middle"
          fontSize={14}
          fontWeight={700}
          fill={entry?.color ?? '#888'}
        >
          {payload?.value}
        </text>
        <text
          x={0}
          y={0}
          dy={28}
          textAnchor="middle"
          fontSize={10}
          fill="#888"
        >
          {entry?.label ?? ''}
        </text>
      </g>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 24, right: 4, left: -16, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis
          dataKey="dim"
          tick={CustomTick}
          height={44}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, 45]}
          ticks={[0, 15, 30, 45]}
          tick={{ fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          formatter={(value, _name, entry) => [
            `${value ?? 0} puan`,
            (entry.payload as ChartEntry).label,
          ]}
          contentStyle={{
            fontSize: 12,
            borderRadius: 6,
            border: '1px solid hsl(var(--border))',
            backgroundColor: 'hsl(var(--card))',
          }}
        />
        <Bar dataKey="score" radius={[5, 5, 0, 0]}>
          <LabelList
            dataKey="score"
            position="top"
            style={{ fontSize: 12, fontWeight: 700, fill: 'hsl(var(--foreground))' }}
          />
          {data.map((entry) => (
            <Cell key={entry.dim} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
