"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { data } from "@/lib/data"
import { useStudioArea } from "./studio-area-filter"

export function TopPanelsTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const { selectedStudioArea } = useStudioArea()

  // Get panels sorted by count
  const panels = Object.entries(data.panelsInWorkstations.workStationCountByPanel)
    .filter(([name]) => {
      // Filter by studio area if selected
      if (selectedStudioArea) {
        return name.startsWith(selectedStudioArea)
      }
      return true
      
    })
    .sort((a, b) => b[1] - a[1])
    .filter(([name]) => name.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, 10) // Show top 10 by default

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search panels..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
      {selectedStudioArea && (
        <div className="text-sm text-muted-foreground mb-2">
          Showing panels for <span className="font-medium">{selectedStudioArea}</span>
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-muted/50">
              <TableHead className="w-[50px] font-semibold">Rank</TableHead>
              <TableHead className="font-semibold">Panel Name</TableHead>
              <TableHead className="text-right font-semibold">Count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {panels.length > 0 ? (
              panels.map(([name, count], index) => (
                <TableRow key={name} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{name}</TableCell>
                  <TableCell className="text-right font-medium">{count}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                  No panels found for the selected filter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
