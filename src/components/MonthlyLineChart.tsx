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
      <p className="flex h-48 items-center justify-center text-sm opacity-60">
        该时间范围内暂无月度支出数据。
      </p>
    )
  }

  const textColor = darkMode ? '#e0e0e0' : '#333333'

  return (
    <div className="h-56">
      <Line
        data={{
          labels: data.map((d) => formatMonthLabel(d.month)),
          datasets: [
            {
              label: '支出',
              data: data.map((d) => d.total),
              borderColor: 'rgba(15, 157, 88, 0.9)',
              backgroundColor: 'rgba(20, 184, 166, 0.25)',
              fill: true,
              tension: 0.35,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            x: {
              ticks: { color: textColor },
              grid: { color: 'rgba(128,128,128,0.15)' },
            },
            y: {
              ticks: { color: textColor },
              grid: { color: 'rgba(128,128,128,0.15)' },
            },
          },
        }}
      />
    </div>
  )
}
