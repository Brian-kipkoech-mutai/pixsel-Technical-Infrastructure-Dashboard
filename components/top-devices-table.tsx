"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { data } from "@/lib/data"

export function TopDevicesTable() {
  const [searchTerm, setSearchTerm] = useState("")

  // Get device types sorted by count
  const deviceTypes = Object.entries(data.deviceTypes.countByType)
    .sort((a, b) => b[1] - a[1])
    .filter(([name]) => name.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, 20) // Show top 20 by default

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search device types..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-muted/50">
              <TableHead className="w-[50px] font-semibold">Rank</TableHead>
              <TableHead className="font-semibold">Device Type</TableHead>
              <TableHead className="text-right font-semibold">Count</TableHead>
              <TableHead className="text-right font-semibold">% of Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deviceTypes.map(([name, count], index) => (
              <TableRow key={name} className="hover:bg-muted/50">
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{name}</TableCell>
                <TableCell className="text-right font-medium">{count}</TableCell>
                <TableCell className="text-right font-medium">
                  {((count / data.deviceTypes.totalCount) * 100).toFixed(2)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
