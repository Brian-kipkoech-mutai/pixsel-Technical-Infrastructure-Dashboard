"use client"

import { Bar } from "@/components/ui/chart"
import { data } from "@/lib/data"
import { useTheme } from "next-themes"
import { useStudioArea } from "./studio-area-filter"

// Get top 10 panels by count
const getTopPanels = (studioArea = "") => {
  const panels = data.panelsInWorkstations.workStationCountByPanel
  const filteredPanels = studioArea
    ? Object.entries(panels).filter(([name]) => name.startsWith(studioArea))
    : Object.entries(panels)

  const sortedPanels = filteredPanels.sort((a, b) => b[1] - a[1]).slice(0, 10)

  return {
    labels: sortedPanels.map(([name]) => {
      // Shorten panel names for better display
      const parts = name.split("/")
      return parts.length > 1 ? `${parts[0]}/${parts[1].substring(0, 15)}...` : name
    }),
    data: sortedPanels.map(([_, count]) => count),
    fullLabels: sortedPanels.map(([name]) => name),
  }
}

export function PanelDistributionChart() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const { selectedStudioArea } = useStudioArea()

  const { labels, data: chartData, fullLabels } = getTopPanels(selectedStudioArea)

  return (
    <>
      {selectedStudioArea && (
        <div className="text-sm text-muted-foreground mb-4">
          Showing panel distribution for <span className="font-medium">{selectedStudioArea}</span>
        </div>
      )}
      {chartData.length > 0 ? (
        <Bar
          data={{
            labels,
            datasets: [
              {
                label: "Panel Count",
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
                  maxRotation: 45,
                  minRotation: 45,
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
                  title: (context) => {
                    const index = context[0].dataIndex
                    return fullLabels[index]
                  },
                  label: (context) => `Count: ${context.parsed.y}`,
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
      ) : (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          No panel data available for the selected filter.
        </div>
      )}
    </>
  )
}
