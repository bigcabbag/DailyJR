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
      <p className="flex h-48 items-center justify-center text-sm text-[var(--color-ink-muted)]">
        暂无支出数据，无法生成图表。
      </p>
    )
  }

  const labels = data.map((d) => CATEGORY_META[d.category].label)
  const textColor = darkMode ? '#e4e4e7' : '#3f3f46'

  return (
    <div className="h-56">
      <Doughnut
        data={{
          labels,
          datasets: [
            {
              data: data.map((d) => d.total),
              backgroundColor: [
                'rgba(236, 72, 153, 0.85)',
                'rgba(24, 24, 27, 0.75)',
                'rgba(161, 161, 170, 0.65)',
              ],
              borderColor: darkMode ? '#18181b' : '#ffffff',
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
              labels: {
                color: textColor,
                boxWidth: 10,
                font: { family: 'Public Sans', size: 11 },
              },
            },
          },
        }}
      />
    </div>
  )
}
