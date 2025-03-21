import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import PriceChart from '@/components/PriceChart'
import { ChartData, Commodity, LocationType, PriceData } from '@/lib/types'
import { getLocationsByType } from '@/lib/mockData'
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react'
import AnimatedNumber from '@/components/AnimatedNumber'

interface DetailedReportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  chartData: ChartData[]
  selectedCommodity?: Commodity
  locationPrices: Record<string, PriceData[]>
  timeRangeDescription: string
}

const DetailedReportModal = ({
  open,
  onOpenChange,
  chartData,
  selectedCommodity,
  locationPrices,
  timeRangeDescription,
}: DetailedReportModalProps) => {
  const locationTypes: LocationType[] = [
    'Nasional',
    'Provinsi',
    'Kabupaten',
    'Pasar',
  ]

  console.log('locationPrices', locationPrices)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className=" md:min-w-3xl max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {selectedCommodity
              ? `Laporan ${selectedCommodity.name}`
              : 'Laporan Detil Pasar'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <div className="h-[300px] mb-6">
            <PriceChart
              data={chartData}
              title={`Tren Harga (${timeRangeDescription})`}
              className="h-full"
            />
          </div>

          {selectedCommodity && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 glass-panel rounded-xl">
                <h3 className="text-lg font-semibold mb-2">Detil Komoditas</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Nama</span>
                    <span className="font-medium">
                      {selectedCommodity.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Kategori
                    </span>
                    <span className="font-medium">
                      {selectedCommodity.category}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Satuan
                    </span>
                    <span className="font-medium">
                      {selectedCommodity.unit}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 glass-panel rounded-xl">
                <h3 className="text-lg font-semibold mb-2">Statistik Harga</h3>
                <div className="space-y-2">
                  {Object.values(locationPrices).flat().length > 0 && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Harga Rata-rata
                        </span>
                        <span className="font-medium text-primary">
                          Rp.&nbsp;
                          <AnimatedNumber
                            value={
                              Object.values(locationPrices)
                                .flat()
                                .reduce((sum, price) => sum + price.price, 0) /
                              Object.values(locationPrices).flat().length
                            }
                            formatValue={(val) => val.toFixed(2)}
                          />
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Harga Tertinggi
                        </span>
                        <span className="font-medium text-primary">
                          Rp.&nbsp;
                          <AnimatedNumber
                            value={Math.max(
                              ...Object.values(locationPrices)
                                .flat()
                                .map((price) => price.price)
                            )}
                            formatValue={(val) => val.toFixed(2)}
                          />
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Harga Terendah
                        </span>
                        <span className="font-medium text-primary">
                          Rp.&nbsp;
                          <AnimatedNumber
                            value={Math.min(
                              ...Object.values(locationPrices)
                                .flat()
                                .map((price) => price.price)
                            )}
                            formatValue={(val) => val.toFixed(2)}
                          />
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          <Tabs defaultValue="Nasional" className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              {locationTypes.map((type) => (
                <TabsTrigger
                  key={type}
                  value={type}
                  disabled={
                    !locationPrices[type] || locationPrices[type].length === 0
                  }
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>

            {locationTypes.map((type) => (
              <TabsContent key={type} value={type} className="mt-0">
                {locationPrices[type] && locationPrices[type].length > 0 ? (
                  <ScrollArea className="h-[200px] rounded-md border p-4">
                    <div className="space-y-4">
                      {locationPrices[type].map((priceData) => (
                        <div
                          key={priceData.id}
                          className="flex justify-between items-center border-b pb-2"
                        >
                          <div>
                            <p className="font-medium">
                              {getLocationsByType(type).find(
                                (loc) => loc.id === priceData.locationId
                              )?.name || 'Unknown'}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="font-medium text-primary">
                              ${priceData.price.toFixed(2)}
                            </span>
                            {priceData.changePercentage && (
                              <span
                                className={`flex items-center ${
                                  priceData.changePercentage > 0
                                    ? 'text-green-500'
                                    : 'text-red-500'
                                }`}
                              >
                                {priceData.changePercentage > 0 ? (
                                  <ArrowUpIcon size={14} className="mr-1" />
                                ) : (
                                  <ArrowDownIcon size={14} className="mr-1" />
                                )}
                                {Math.abs(priceData.changePercentage).toFixed(
                                  2
                                )}
                                %
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Tidak ada data yang tersedia
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DetailedReportModal
