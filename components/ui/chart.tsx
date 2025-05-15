"use client"

import { Bar as ChartJSBar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import { useTheme } from "next-themes"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export function Bar(props: any) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Set default chart colors based on theme
  const defaultOptions = {
    scales: {
      y: {
        grid: {
          color: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
        },
      },
      x: {
        ticks: {
          color: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
        },
      },
    },
  }

  const mergedOptions = {
    ...defaultOptions,
    ...props.options,
  }

  return <ChartJSBar {...props} options={mergedOptions} />
}
