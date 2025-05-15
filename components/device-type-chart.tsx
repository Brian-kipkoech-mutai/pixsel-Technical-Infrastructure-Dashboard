  "use client"

import { Bar } from "@/components/ui/chart"
import { data } from "@/lib/data"
import { useTheme } from "next-themes"

// Get top 10 device types by count
const getTopDeviceTypes = () => {
  const deviceTypes = data.deviceTypes.countByType
  const sortedDeviceTypes = Object.entries(deviceTypes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  return {
    labels: sortedDeviceTypes.map(([name]) => name),
    data: sortedDeviceTypes.map(([_, count]) => count),
  }
}

export function DeviceTypeChart() {
  const { labels, data: chartData } = getTopDeviceTypes()
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <Bar
      data={{
        labels,
        datasets: [
          {
            label: "Device Count",
            data: chartData,
            backgroundColor: "rgba(59, 130, 246, 0.8)", // Blue color for all themes
            borderRadius: 4,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: true,
              color: isDark ? "rgba(255, 255, 255, 0.1)" : "hsl(var(--border) / 0.2)",
            },
            ticks: {
              color: isDark ? "rgba(255, 255, 255, 0.9)" : undefined,
              font: {
                weight: isDark ? "bold" : "normal",
              },
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: isDark ? "rgba(255, 255, 255, 0.9)" : undefined,
              font: {
                weight: isDark ? "bold" : "normal",
              },
            },
          },
        },
        plugins: {
          legend: {
            display: false,
            labels: {
              color: isDark ? "rgba(255, 255, 255, 0.9)" : undefined,
              font: {
                weight: "bold",
              },
            },
          },
          tooltip: {
            callbacks: {
              label: (context:any) => `Count: ${context.parsed.y}`,
            },
            backgroundColor: isDark ? "rgba(0, 0, 0, 0.8)" : undefined,
            titleColor: isDark ? "rgba(255, 255, 255, 1)" : undefined,
            bodyColor: isDark ? "rgba(255, 255, 255, 1)" : undefined,
            padding: 10,
            titleFont: {
              weight: "bold",
            },
          },
        },
      }}
      className="aspect-[4/3]"
    />
  )
}
