"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { data } from "@/lib/data"
import { useTheme } from "next-themes"
import { useStudioArea } from "./studio-area-filter"

// Calculate studio distribution
const getStudioDistribution = (filterStudio = "") => {
  const studios: Record<string, number> = {}

  Object.entries(data.panelsInWorkstations.workStationCountByPanel).forEach(([panel, count]) => {
    // If filtering is applied, only include panels from that studio
    if (filterStudio && !panel.startsWith(filterStudio)) {
      return
    }

    const parts = panel.split("/")
    if (parts.length > 0 && parts[0].startsWith("studio_")) {
      const studio = parts[0]
      studios[studio] = (studios[studio] || 0) + count
    }
  })

  return Object.entries(studios)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
}

// Count panels for a specific studio area
const countPanelsForStudio = (studioArea: string) => {
  let count = 0

  Object.entries(data.panelsInWorkstations.workStationCountByPanel).forEach(([panel, panelCount]) => {
    if (panel.startsWith(studioArea)) {
      count += panelCount
    }
  })

  return count
}

export function Overview() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const { selectedStudioArea } = useStudioArea()

  const studioDistribution = getStudioDistribution(selectedStudioArea)

  // Calculate total panels for the selected studio area
  const totalPanels = selectedStudioArea
    ? countPanelsForStudio(selectedStudioArea)
    : data.panelsInWorkstations.totalCount

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Dashboard Overview</CardTitle>
          <CardDescription>
            {selectedStudioArea ? `Key metrics for ${selectedStudioArea}` : "Key metrics from device and panel data"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Device Types</p>
                <p className="text-2xl font-bold">{Object.keys(data.deviceTypes.countByType).length}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {selectedStudioArea ? `Panels in ${selectedStudioArea}` : "Total Panel Types"}
                </p>
                <p className="text-2xl font-bold">
                  {selectedStudioArea
                    ? totalPanels
                    : Object.keys(data.panelsInWorkstations.workStationCountByPanel).length}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Most Common Device</p>
                <p className="text-2xl font-bold">CP-1000E</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Most Used Panel</p>
                <p className="text-2xl font-bold">Package Router</p>
              </div>
            </div>
            <div className="pt-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">
                {selectedStudioArea ? `Panel Distribution in ${selectedStudioArea}` : "Top Studios by Panel Count"}
              </h4>
              {studioDistribution.length > 0 ? (
                <div className="space-y-2">
                  {studioDistribution.map(([studio, count]) => (
                    <div key={studio} className="flex items-center">
                      <div className="w-40 text-sm font-medium">{studio.replace("studio_", "Studio ")}</div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${isDark ? "bg-blue-500" : "bg-blue-500"}`}
                          style={{ width: `${Math.min(100, (count / studioDistribution[0][1]) * 100)}%` }}
                        ></div>
                      </div>
                      <div className="w-12 text-sm font-medium text-right ml-2">{count}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground py-4">No studio data available for the selected filter.</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>
            {selectedStudioArea ? `Technical details for ${selectedStudioArea}` : "Technical infrastructure details"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="devices">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="devices">Devices</TabsTrigger>
              <TabsTrigger value="panels">Panels</TabsTrigger>
            </TabsList>
            <TabsContent value="devices" className="space-y-4 pt-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Device Type Distribution</h4>
                <p className="text-sm text-muted-foreground">
                  The system contains {Object.keys(data.deviceTypes.countByType).length} unique device types with a
                  total of {data.deviceTypes.totalCount} devices.
                  {selectedStudioArea && " Filtering is applied to panels only."}
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Top Device Categories</h4>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  <li>Control Panels (CP-1000E, CP-2048E)</li>
                  <li>Routers (Router, RRS18)</li>
                  <li>Multiviewers (tag_mv_ssm_tile)</li>
                  <li>Signal Processors (IQHIP10, HES20)</li>
                  <li>Interface Devices (GEP100, GFS010)</li>
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="panels" className="space-y-4 pt-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Panel Distribution</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedStudioArea
                    ? `${selectedStudioArea} contains ${totalPanels} panels.`
                    : `The system contains ${Object.keys(data.panelsInWorkstations.workStationCountByPanel).length} unique
                      panel types with a total of ${data.panelsInWorkstations.totalCount} panels across all workstations.`}
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Top Panel Categories</h4>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  <li>Ringmaster Packaging (package_router, arrivals_board, os_view)</li>
                  <li>Studio Common (router_sdi_salt_xy_list, router_sdi_pepper_xy_list)</li>
                  <li>Communications (ringmaster_xy, ringmaster_xy_list)</li>
                  <li>Studio Controls (video_xy_mapped, video_xy_list)</li>
                  <li>Configuration (axon_config, studio_dolby_e)</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
