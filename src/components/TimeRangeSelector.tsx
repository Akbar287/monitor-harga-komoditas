import React from 'react'
import {
  Calendar as CalendarIcon,
  Clock,
  Calendar,
  CalendarDays,
  CalendarRange,
} from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { TimeRangeType } from '@/lib/types'

interface TimeRangeSelectorProps {
  timeRangeType: TimeRangeType
  dateRange: [Date | null, Date | null]
  onTimeRangeTypeChange: (type: TimeRangeType) => void
  onDateRangeChange: (range: [Date | null, Date | null]) => void
  className?: string
}

const TimeRangeSelector = ({
  timeRangeType,
  dateRange,
  onTimeRangeTypeChange,
  onDateRangeChange,
  className,
}: TimeRangeSelectorProps) => {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">Waktu</label>
        {timeRangeType === 'Kustom' && (
          <span className="text-xs text-muted-foreground">
            {dateRange[0] && dateRange[1]
              ? `${format(dateRange[0], 'MMM d')} - ${format(
                  dateRange[1],
                  'MMM d, yyyy'
                )}`
              : 'Pilih rentang waktu'}
          </span>
        )}
      </div>

      <ToggleGroup
        type="single"
        value={timeRangeType}
        onValueChange={(value) => {
          if (value) onTimeRangeTypeChange(value as TimeRangeType)
        }}
        className="justify-center"
      >
        <ToggleGroupItem
          value="Hari"
          aria-label="Toggle day view"
          className={`flex items-center gap-1`}
        >
          <Clock className="h-4 w-4" />
          <span className=" sm:inline">Hari</span>
        </ToggleGroupItem>
        <ToggleGroupItem
          value="Minggu"
          aria-label="Toggle week view"
          className="flex items-center gap-1"
        >
          <Calendar className="h-4 w-4" />
          <span className=" sm:inline">Minggu</span>
        </ToggleGroupItem>
        <ToggleGroupItem
          value="Bulan"
          aria-label="Toggle month view"
          className="flex items-center gap-1"
        >
          <CalendarDays className="h-4 w-4" />
          <span className=" sm:inline">Bulan</span>
        </ToggleGroupItem>
        <ToggleGroupItem
          value="Kustom"
          aria-label="Toggle custom view"
          className="flex items-center gap-1"
        >
          <CalendarRange className="h-4 w-4" />
          <span className=" sm:inline">Kustom</span>
        </ToggleGroupItem>
      </ToggleGroup>

      {timeRangeType === 'Kustom' && (
        <div className="grid grid-cols-2 gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange[0] ? (
                  format(dateRange[0], 'MMM d, yyyy')
                ) : (
                  <span>Tanggal Awal</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={dateRange[0] || undefined}
                onSelect={(date) =>
                  onDateRangeChange([date ?? null, dateRange[1]])
                }
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange[1] ? (
                  format(dateRange[1], 'MMM d, yyyy')
                ) : (
                  <span>Tanggal Akhir</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={dateRange[1] || undefined}
                onSelect={(date) =>
                  onDateRangeChange([dateRange[0], date ?? null])
                }
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  )
}

export default TimeRangeSelector
