"use client"

import { useState, createContext, useContext } from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { data } from "@/lib/data"
import { Badge } from "@/components/ui/badge"

// Create a context to share the selected studio area across components
export const StudioAreaContext = createContext<{
  selectedStudioArea: string
  setSelectedStudioArea: (area: string) => void
}>({
  selectedStudioArea: "",
  setSelectedStudioArea: () => {},
})

// Hook to use the studio area context
export const useStudioArea = () => useContext(StudioAreaContext)

// Extract studio areas from panel names
const getStudioAreas = () => {
  const areas = new Set<string>()

  Object.keys(data.panelsInWorkstations.workStationCountByPanel).forEach((panel) => {
    const parts = panel.split("/")
    if (parts.length > 0 && parts[0]) {
      areas.add(parts[0])
    }
  })

  return Array.from(areas).sort()
}

export function StudioAreaFilter() {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const { selectedStudioArea, setSelectedStudioArea } = useStudioArea()

  const studioAreas = getStudioAreas()
  const filteredAreas = studioAreas.filter((area) => area.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between font-medium"
          >
            {selectedStudioArea ? selectedStudioArea : "Filter by studio area"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput
              placeholder="Search studio area..."
              value={searchTerm}
              onValueChange={setSearchTerm}
              className="text-foreground"
            />
            <CommandList>
              <CommandEmpty>No studio area found.</CommandEmpty>
              <CommandGroup>
                {filteredAreas.map((area) => (
                  <CommandItem
                    key={area}
                    value={area}
                    onSelect={(currentValue) => {
                      setSelectedStudioArea(currentValue === selectedStudioArea ? "" : currentValue)
                      setSearchTerm("")
                      setOpen(false)
                    }}
                    className="text-foreground hover:text-foreground"
                  >
                    <Check className={cn("mr-2 h-4 w-4", selectedStudioArea === area ? "opacity-100" : "opacity-0")} />
                    {area}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedStudioArea && (
        <Badge variant="secondary" className="gap-1 px-2 py-1">
          Filtering: {selectedStudioArea}
          <button className="ml-1 rounded-full hover:bg-muted" onClick={() => setSelectedStudioArea("")}>
            ✕
          </button>
        </Badge>
      )}
    </div>
  )
}
