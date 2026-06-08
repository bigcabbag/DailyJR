import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { formatMonthLabel } from '../lib/ledger'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
)

interface MonthlyLineChartProps {
  data: { month: string; total: number }[]
  darkMode: boolean
}

export function MonthlyLineChart({ data, darkMode }: MonthlyLineChartProps) {
  if (data.length === 0) {
    return (
      <p className="flex h-48 items-center justify-center text-sm text-[var(--color-ink-muted)]">
        该时间范围内暂无月度支出数据。
      </p>
    )
  }

  const textColor = darkMode ? '#e4e4e7' : '#3f3f46'
  const gridColor = darkMode ? 'rgba(161,161,170,0.15)' : 'rgba(228,228,231,0.9)'

  return (
    <div className="h-56">
      <Line
        data={{
          labels: data.map((d) => formatMonthLabel(d.month)),
          datasets: [
            {
              label: '支出',
              data: data.map((d) => d.total),
              borderColor: '#18181b',
              backgroundColor: 'rgba(236, 72, 153, 0.12)',
              fill: true,
              tension: 0.2,
              pointBackgroundColor: '#ec4899',
              pointBorderColor: '#18181b',
              pointRadius: 4,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: {
              ticks: {
                color: textColor,
                font: { family: 'Public Sans', size: 10 },
              },
              grid: { color: gridColor },
            },
            y: {
              ticks: {
                color: textColor,
                font: { family: 'Public Sans', size: 10 },
              },
              grid: { color: gridColor },
            },
          },
        }}
      />
    </div>
  )
}
