import React, { useState, useEffect } from 'react'
import { Search, X, ChevronRight, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'

import {
  FilterState,
  Location,
  Commodity,
  LocationType,
  TimeRangeType,
} from '@/lib/types'
import { getLocationsByType, locations, commodities } from '@/lib/mockData'
import TimeRangeSelector from './TimeRangeSelector'

interface FilterPanelProps {
  onFilterChange: (filters: FilterState) => void
  className?: string
}

export const FilterPanel = ({
  onFilterChange,
  className,
}: FilterPanelProps) => {
  const [filters, setFilters] = useState<FilterState>({
    locationType: 'Nasional',
    locationId: 'nat-1',
    commodityId: undefined,
    timeRangeType: 'Bulan',
    dateRange: [
      new Date(new Date().setDate(new Date().getDate() - 30)),
      new Date(),
    ],
  })

  const [locationOptions, setLocationOptions] = useState<Location[]>([])
  const [selectedLocation, setSelectedLocation] = useState<
    Location | undefined
  >()
  const [selectedCommodity, setSelectedCommodity] = useState<
    Commodity | undefined
  >()
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    new Date(new Date().setDate(new Date().getDate() - 30)),
    new Date(),
  ])

  // Breadcrumb state for hierarchical navigation
  const [locationPath, setLocationPath] = useState<Location[]>([])

  // Initialize location options
  useEffect(() => {
    const nationLocations = getLocationsByType('Nasional')
    setLocationOptions(nationLocations)

    if (nationLocations.length > 0) {
      setSelectedLocation(nationLocations[0])
      setLocationPath([nationLocations[0]])
    }
  }, [])

  // Update filters when selections change
  useEffect(() => {
    const newFilters: FilterState = {
      ...filters,
      locationId: selectedLocation?.id,
      commodityId: selectedCommodity?.id,
      dateRange,
    }

    setFilters(newFilters)
    onFilterChange(newFilters)
  }, [selectedLocation, selectedCommodity, dateRange, filters.timeRangeType])

  // Handle time range type change
  const handleTimeRangeChange = (type: TimeRangeType) => {
    const today = new Date()
    let startDate: Date

    switch (type) {
      case 'Hari':
        startDate = today
        break
      case 'Minggu':
        startDate = new Date(today)
        startDate.setDate(today.getDate() - 7)
        break
      case 'Bulan':
        startDate = new Date(today)
        startDate.setDate(today.getDate() - 30)
        break
      case 'Kustom':
        // Keep existing date range
        startDate =
          dateRange[0] || new Date(today.setDate(today.getDate() - 30))
        break
    }

    if (type !== 'Kustom') {
      setDateRange([startDate, today])
    }

    setFilters((prev) => ({ ...prev, timeRangeType: type }))
  }

  // Handle location type change
  const handleLocationTypeChange = (type: LocationType) => {
    setFilters((prev) => ({ ...prev, locationType: type }))

    // Reset the path and selected location when changing location type
    const nationLocations = getLocationsByType('Nasional')
    const nationalLocation = nationLocations[0]

    if (type === 'Nasional') {
      setLocationOptions(nationLocations)
      setSelectedLocation(nationalLocation)
      setLocationPath([nationalLocation])
    } else {
      let parentId: string | undefined
      let parentLocation: Location | undefined

      if (type === 'Provinsi') {
        parentLocation = locations.find((loc) => loc.type === 'Nasional')
        parentId = parentLocation?.id
      } else if (type === 'Kabupaten') {
        const firstProvince = locations.find((loc) => loc.type === 'Provinsi')
        parentLocation = firstProvince
        parentId = firstProvince?.id
      } else if (type === 'Pasar') {
        const firstCity = locations.find((loc) => loc.type === 'Kabupaten')
        parentLocation = firstCity
        parentId = firstCity?.id
      }

      const newOptions = getLocationsByType(type, parentId)
      setLocationOptions(newOptions)

      if (newOptions.length > 0) {
        setSelectedLocation(newOptions[0])
        setLocationPath(
          parentLocation
            ? [nationalLocation, parentLocation, newOptions[0]]
            : [nationalLocation, newOptions[0]]
        )
      } else {
        setSelectedLocation(undefined)
        setLocationPath(
          parentLocation
            ? [nationalLocation, parentLocation]
            : [nationalLocation]
        )
      }
    }
  }

  // Handle selected location change
  const handleLocationChange = (locationId: string) => {
    const location = locations.find((loc) => loc.id === locationId)
    if (!location) return

    setSelectedLocation(location)

    // Update the location path
    let newPath: Location[] = []

    if (location.type === 'Nasional') {
      newPath = [location]
    } else if (location.type === 'Provinsi') {
      const national = locations.find((loc) => loc.type === 'Nasional')
      if (national) newPath = [national, location]
    } else if (location.type === 'Kabupaten') {
      const national = locations.find((loc) => loc.type === 'Nasional')
      const parentProvince = locations.find(
        (loc) => loc.id === location.parentId
      )
      if (national && parentProvince)
        newPath = [national, parentProvince, location]
    } else if (location.type === 'Pasar') {
      const national = locations.find((loc) => loc.type === 'Nasional')
      const parentCity = locations.find((loc) => loc.id === location.parentId)
      const grandParentProvince = parentCity
        ? locations.find((loc) => loc.id === parentCity.parentId)
        : undefined

      if (national && grandParentProvince && parentCity) {
        newPath = [national, grandParentProvince, parentCity, location]
      }
    }

    setLocationPath(newPath)

    // Update location options based on the selected location
    if (location.type === 'Provinsi') {
      const cityOptions = getLocationsByType('Kabupaten', location.id)
      setLocationOptions(cityOptions.length > 0 ? cityOptions : [location])
      setFilters((prev) => ({ ...prev, locationType: 'Kabupaten' }))
    } else if (location.type === 'Kabupaten') {
      const marketOptions = getLocationsByType('Pasar', location.id)
      setLocationOptions(marketOptions.length > 0 ? marketOptions : [location])
      setFilters((prev) => ({ ...prev, locationType: 'Pasar' }))
    }
  }

  // Navigate up the hierarchy
  const handleNavigateToParent = (location: Location) => {
    if (location.type === 'Nasional') {
      handleLocationTypeChange('Nasional')
    } else if (location.type === 'Provinsi') {
      setFilters((prev) => ({ ...prev, locationType: 'Provinsi' }))
      const provinceOptions = getLocationsByType('Provinsi')
      setLocationOptions(provinceOptions)
      setSelectedLocation(location)

      // Update path
      const national = locations.find((loc) => loc.type === 'Nasional')
      if (national) setLocationPath([national, location])
    } else if (location.type === 'Kabupaten') {
      setFilters((prev) => ({ ...prev, locationType: 'Kabupaten' }))
      const parentProvince = locations.find(
        (loc) => loc.id === location.parentId
      )
      if (parentProvince) {
        const cityOptions = getLocationsByType('Kabupaten', parentProvince.id)
        setLocationOptions(cityOptions)
        setSelectedLocation(location)

        // Update path
        const national = locations.find((loc) => loc.type === 'Nasional')
        if (national) setLocationPath([national, parentProvince, location])
      }
    }
  }

  // Handle clearing commodity filter
  const handleClearCommodity = () => {
    setSelectedCommodity(undefined)
  }

  // Render location breadcrumb
  const renderLocationBreadcrumb = () => {
    if (locationPath.length <= 1) return null

    return (
      <div className="flex flex-wrap items-center text-sm text-muted-foreground mb-2 animate-fade-in">
        {locationPath.map((location, index) => (
          <React.Fragment key={index}>
            <button
              type="button"
              className="hover:text-foreground transition-colors hover:underline cursor-pointer flex items-center"
              onClick={() =>
                index < locationPath.length - 1 &&
                handleNavigateToParent(location)
              }
            >
              {index === 0 && <MapPin className="w-3 h-3 mr-1" />}
              {location.name}
            </button>
            {index < locationPath.length - 1 && (
              <ChevronRight className="mx-1 w-3 h-3" />
            )}
          </React.Fragment>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('glass-panel rounded-xl p-4', className)}>
      <div className="space-y-4">
        {/* Location Type Filter */}
        <div className="flex space-x-2 overflow-x-auto pb-2 scroll-hidden">
          {(
            ['Nasional', 'Provinsi', 'Kabupaten', 'Pasar'] as LocationType[]
          ).map((type) => (
            <Button
              key={type}
              variant={filters.locationType === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleLocationTypeChange(type)}
              className="animate-scale-in"
              style={{
                animationDelay: `${
                  (
                    [
                      'Nasional',
                      'Provinsi',
                      'Kabupaten',
                      'Pasar',
                    ] as LocationType[]
                  ).indexOf(type) * 100
                }ms`,
              }}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>

        {/* Location Breadcrumb Navigation */}
        {renderLocationBreadcrumb()}

        {/* Location Dropdown */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">Lokasi</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="justify-between"
              >
                {selectedLocation?.name || 'Cari Lokasi ...'}
                <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Cari Lokasi..." />
                <CommandList>
                  <CommandEmpty>Lokasi tidak ditemukan.</CommandEmpty>
                  <CommandGroup>
                    {locationOptions.map((location) => (
                      <CommandItem
                        key={location.id}
                        value={location.id}
                        onSelect={handleLocationChange}
                        className="flex items-center"
                      >
                        {location.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Commodity Dropdown */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">Komoditas</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="justify-between"
              >
                {selectedCommodity?.name || 'Semua Komoditas'}
                <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Cari Komoditas..." />
                <CommandList>
                  <CommandEmpty>Komoditas tidak ada.</CommandEmpty>
                  <CommandGroup>
                    {commodities.map((commodity) => (
                      <CommandItem
                        key={commodity.id}
                        value={commodity.id}
                        onSelect={(id) =>
                          setSelectedCommodity(
                            commodities.find((c) => c.id === id)
                          )
                        }
                        className="flex items-center"
                      >
                        {commodity.name}
                        <Badge className="ml-2 text-xs" variant="outline">
                          {commodity.category}
                        </Badge>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Show selected commodity with clear button */}
          {selectedCommodity && (
            <div className="flex items-center mt-2">
              <Badge className="flex items-center" variant="secondary">
                {selectedCommodity.name}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1 p-0"
                  onClick={handleClearCommodity}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            </div>
          )}
        </div>

        {/* Time Range Selector */}
        <TimeRangeSelector
          timeRangeType={filters.timeRangeType}
          dateRange={dateRange}
          onTimeRangeTypeChange={handleTimeRangeChange}
          onDateRangeChange={setDateRange}
          className="animate-fade-in animate-delay-100"
        />
      </div>
    </div>
  )
}

export default FilterPanel
