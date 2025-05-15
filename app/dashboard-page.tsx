"use client";

import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DeviceTypeChart } from "@/components/device-type-chart";
import { PanelDistributionChart } from "@/components/panel-distribution-chart";
import { TopDevicesTable } from "@/components/top-devices-table";
import { TopPanelsTable } from "@/components/top-panels-table";
import {
  StudioAreaFilter,
  StudioAreaContext,
} from "@/components/studio-area-filter";
import { Overview } from "@/components/overview";
import { useState } from "react";
import { data } from "@/lib/data";

export default function DashboardPageClient() {
  const [selectedStudioArea, setSelectedStudioArea] = useState("");
  const panelsData = data.panelsInWorkstations;
  const panelEntries = Object.entries(panelsData.workStationCountByPanel);

  // Total panels
  const totalPanels = panelsData.totalCount;

  // Find the most used panel
  const [mostUsedPanel, highestCount] = panelEntries.reduce(
    (max, current) => (current[1] > max[1] ? current : max),
    ["", 0]
  );

  return (
    <StudioAreaContext.Provider
      value={{ selectedStudioArea, setSelectedStudioArea }}
    >
      <div className="flex min-h-screen flex-col">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <div className="font-semibold">
              Technical Infrastructure Dashboard
            </div>
            <div className="ml-auto flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-[200px] pl-8 md:w-[300px] lg:w-[400px]"
                />
              </div>
              <Button>Export Data</Button>
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2">
              <StudioAreaFilter />
            </div>
          </div>
          {selectedStudioArea && (
            <div className="bg-muted p-4 rounded-md mb-4">
              <h3 className="text-lg font-medium mb-2">
                Filter Applied: {selectedStudioArea}
              </h3>
              <p className="text-muted-foreground">
                The dashboard is now showing data filtered by{" "}
                <strong>{selectedStudioArea}</strong>. This affects the panels
                table, device distribution, and overview statistics.
              </p>
            </div>
          )}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="devices">Devices</TabsTrigger>
              <TabsTrigger value="panels">Panels</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <Overview />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Total Devices</CardTitle>
                    <CardDescription>
                      Total number of devices in the system
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">
                      {data.deviceTypes.totalCount}
                    </div>
                  </CardContent>
                </Card>
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Total Panels</CardTitle>
                    <CardDescription>
                      Total number of panels across workstations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">
                      {data.panelsInWorkstations.totalCount}
                    </div>
                  </CardContent>
                </Card>
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Device Types</CardTitle>
                    <CardDescription>
                      Number of unique device types
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">
                      {Object.keys(data.deviceTypes.countByType).length}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Top Device Types</CardTitle>
                    <CardDescription>
                      Distribution of most common device types
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <DeviceTypeChart />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Top Panels by Workstation</CardTitle>
                    <CardDescription>
                      Most used panels across workstations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TopPanelsTable />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="devices" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-2">
                  <CardHeader>
                    <CardTitle>Device Type Distribution</CardTitle>
                    <CardDescription>
                      Breakdown of device types by count
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <DeviceTypeChart />
                  </CardContent>
                </Card>
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Device Statistics</CardTitle>
                    <CardDescription>
                      Key metrics about device usage
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-4">
                      <div className="flex items-center justify-between">
                        <dt className="text-sm font-medium text-muted-foreground">
                          Total Devices
                        </dt>
                        <dd className="text-xl font-bold">
                          {data.deviceTypes.totalCount}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-sm font-medium text-muted-foreground">
                          Most Common Type
                        </dt>
                        <dd className="text-xl font-bold">CP-1000E</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-sm font-medium text-muted-foreground">
                          Highest Count
                        </dt>
                        <dd className="text-xl font-bold">
                          {data.deviceTypes.totalCount}
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>All Device Types</CardTitle>
                  <CardDescription>
                    Complete list of device types with counts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TopDevicesTable />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="panels" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-2">
                  <CardHeader>
                    <CardTitle>Panel Distribution by Workstation</CardTitle>
                    <CardDescription>
                      How panels are distributed across workstations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <PanelDistributionChart />
                  </CardContent>
                </Card>
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Panel Statistics</CardTitle>
                    <CardDescription>
                      Key metrics about panel usage
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-4">
                      <div className="flex items-center justify-between">
                        <dt className="text-sm font-medium text-muted-foreground">
                          Total Panels
                        </dt>
                        <dd className="text-xl font-bold">{totalPanels}</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-sm font-medium text-muted-foreground">
                          Most Used Panel
                        </dt>
                        <dd className=" font-bold text-sm">{mostUsedPanel}</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-sm font-medium text-muted-foreground">
                          Highest Count
                        </dt>
                        <dd className="text-xl font-bold">{highestCount}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Top Panels by Workstation</CardTitle>
                  <CardDescription>
                    Most used panels across different workstations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TopPanelsTable />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </StudioAreaContext.Provider>
  );
}
