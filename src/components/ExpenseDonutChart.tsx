import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { CATEGORY_META } from '../lib/types'
import type { Category } from '../lib/types'

ChartJS.register(ArcElement, Tooltip, Legend)

interface ExpenseDonutChartProps {
  data: { category: Category; total: number }[]
  darkMode: boolean
}

export function ExpenseDonutChart({ data, darkMode }: ExpenseDonutChartProps) {
  if (data.length === 0) {
    return (
      <p className="flex h-48 items-center justify-center text-sm opacity-60">
        暂无支出数据，无法生成图表。
      </p>
    )
  }

  const labels = data.map((d) => CATEGORY_META[d.category].label)
  const textColor = darkMode ? '#e0e0e0' : '#333333'

  return (
    <div className="h-56">
      <Doughnut
        data={{
          labels,
          datasets: [
            {
              data: data.map((d) => d.total),
              backgroundColor: [
                'rgba(15, 157, 88, 0.65)',
                'rgba(20, 184, 166, 0.55)',
                'rgba(56, 142, 60, 0.5)',
              ],
              borderColor: 'rgba(255, 255, 255, 0.4)',
              borderWidth: 2,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: textColor, boxWidth: 12 },
            },
          },
        }}
      />
    </div>
  )
}
