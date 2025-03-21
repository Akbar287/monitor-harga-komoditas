'use client'
import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { FilterState, PriceData, Commodity, Location } from '@/lib/types'
import {
  getFilteredPriceData,
  getChartData,
  getLatestPrices,
  commodities,
  locations,
  getPriceDataByLocation,
} from '@/lib/mockData'
import Header from '@/components/Header'
import PriceChart from '@/components/PriceChart'
import FilterPanel from '@/components/FilterPanel'
import CommodityCard from '@/components/CommodityCard'
import AnimatedNumber from '@/components/AnimatedNumber'
import DetailedReportModal from '@/components/DetailedReportModal'
import AllCommoditiesModal from '@/components/AllCommoditiesModal'
import { Button } from '@/components/ui/button'
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  Info,
  ListFilter,
  MoonIcon,
  SunIcon,
} from 'lucide-react'
import { useTheme } from 'next-themes'

export default function Home() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const { theme, setTheme } = useTheme()

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

  const [chartData, setChartData] = useState<any[]>([])
  const [topCommodities, setTopCommodities] = useState<
    { commodity: Commodity; priceData: PriceData }[]
  >([])
  const [selectedCommodityId, setSelectedCommodityId] = useState<
    string | undefined
  >(undefined)
  const [selectedLocation, setSelectedLocation] = useState<
    Location | undefined
  >(locations.find((loc) => loc.id === 'nat-1'))

  // State for modals
  const [detailedReportOpen, setDetailedReportOpen] = useState(false)
  const [allCommoditiesOpen, setAllCommoditiesOpen] = useState(false)
  const [locationPrices, setLocationPrices] = useState<
    Record<string, PriceData[]>
  >({
    national: [],
    province: [],
    city: [],
    market: [],
  })

  // Check for route state (from AllCommodities page)
  useEffect(() => {
    const commodityId = searchParams.get('selectedCommodityId')
    if (commodityId) {
      setSelectedCommodityId(commodityId)
      setFilters((prev) => ({
        ...prev,
        commodityId,
      }))

      // Remove the query param from URL
      const newParams = new URLSearchParams(searchParams.toString())
      newParams.delete('selectedCommodityId')
      router.replace(`?${newParams.toString()}`)
    }
  }, [searchParams, router])

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)

    if (newFilters.locationId) {
      setSelectedLocation(
        locations.find((loc) => loc.id === newFilters.locationId)
      )
    }

    if (
      newFilters.commodityId &&
      newFilters.commodityId !== selectedCommodityId
    ) {
      setSelectedCommodityId(newFilters.commodityId)
    } else if (!newFilters.commodityId) {
      setSelectedCommodityId(undefined)
    }
  }

  useEffect(() => {
    const startDate = filters.dateRange[0]
      ? filters.dateRange[0].toISOString().split('T')[0]
      : undefined
    const endDate = filters.dateRange[1]
      ? filters.dateRange[1].toISOString().split('T')[0]
      : undefined

    if (selectedCommodityId) {
      const locationIds = locations
        .filter((loc) => loc.type === filters.locationType)
        .map((loc) => loc.id)

      const locationsToChart = filters.locationId
        ? [filters.locationId]
        : locationIds.slice(0, 5)

      const newChartData = getChartData(selectedCommodityId, locationsToChart)
      setChartData(newChartData)
    } else if (filters.locationId) {
      const commodityIds = commodities.slice(0, 5).map((c) => c.id)

      const newChartData = commodityIds.map((commodityId) => {
        const commodity = commodities.find((c) => c.id === commodityId)
        const prices = getFilteredPriceData(
          commodityId,
          filters.locationId,
          startDate,
          endDate
        ).sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )

        return {
          id: commodityId,
          name: commodity?.name || 'Unknown',
          data: prices.map((p) => ({
            date: p.date,
            value: p.price,
          })),
        }
      })

      console.log('New chart data:', newChartData)

      setChartData(newChartData)
    }
  }, [filters, selectedCommodityId])

  useEffect(() => {
    if (filters.locationId) {
      const latestPrices = getLatestPrices(filters.locationId)

      const sorted = latestPrices
        .sort(
          (a, b) =>
            Math.abs(b.changePercentage || 0) -
            Math.abs(a.changePercentage || 0)
        )
        .slice(0, 6)

      const topItems = sorted.map((priceData) => ({
        commodity: commodities.find(
          (c) => c.id === priceData.commodityId
        ) as Commodity,
        priceData,
      }))

      setTopCommodities(topItems)
    }
  }, [filters.locationId])

  // Populate location prices for the detailed report
  useEffect(() => {
    if (detailedReportOpen) {
      const commodityId = selectedCommodityId || topCommodities[0]?.commodity.id

      if (commodityId) {
        const nationalPrices = getPriceDataByLocation('Nasional', commodityId)
        const provincePrices = getPriceDataByLocation('Provinsi', commodityId)
        const cityPrices = getPriceDataByLocation('Kabupaten', commodityId)
        const marketPrices = getPriceDataByLocation('Pasar', commodityId)

        setLocationPrices({
          Nasional: nationalPrices,
          Provinsi: provincePrices,
          Kabupaten: cityPrices,
          Pasar: marketPrices,
        })
      }
    }
  }, [detailedReportOpen, selectedCommodityId, topCommodities])

  const handleCommoditySelect = (commodityId: string) => {
    if (selectedCommodityId === commodityId) {
      setSelectedCommodityId(undefined)
    } else {
      setSelectedCommodityId(commodityId)
    }
  }

  const totalCommodities = commodities.length

  const highestPriceCommodity =
    topCommodities.length > 0
      ? topCommodities.reduce((prev, current) =>
          prev.priceData.price > current.priceData.price ? prev : current
        )
      : undefined

  const lowestPriceCommodity =
    topCommodities.length > 0
      ? topCommodities.reduce((prev, current) =>
          prev.priceData.price < current.priceData.price ? prev : current
        )
      : undefined

  const biggestIncrease =
    topCommodities.length > 0
      ? topCommodities.reduce((prev, current) =>
          (current.priceData.changePercentage || 0) >
          (prev.priceData.changePercentage || 0)
            ? current
            : prev
        )
      : undefined

  const biggestDecrease =
    topCommodities.length > 0
      ? topCommodities.reduce((prev, current) =>
          (current.priceData.changePercentage || 0) <
          (prev.priceData.changePercentage || 0)
            ? current
            : prev
        )
      : undefined

  const selectedCommodity = selectedCommodityId
    ? commodities.find((c) => c.id === selectedCommodityId)
    : undefined

  const selectedCommodityPrice =
    selectedCommodityId && filters.locationId
      ? getLatestPrices(filters.locationId).find(
          (p) => p.commodityId === selectedCommodityId
        )
      : undefined

  const getTimeRangeDescription = () => {
    switch (filters.timeRangeType) {
      case 'Hari':
        return 'Hari Ini'
      case 'Minggu':
        return 'Minggu Lalu'
      case 'Bulan':
        return 'Bulan Lalu'
      case 'Kustom':
        if (filters.dateRange[0] && filters.dateRange[1]) {
          const options = { month: 'short', day: 'numeric' } as const
          const start = filters.dateRange[0].toLocaleDateString(
            undefined,
            options
          )
          const end = filters.dateRange[1].toLocaleDateString(
            undefined,
            options
          )
          return `${start} - ${end}`
        }
        return 'Rentang Kustom'
    }
  }

  const renderMarketOverview = () => {
    if (selectedCommodity && selectedCommodityPrice) {
      return (
        <div className="space-y-4">
          <div className="flex items-center">
            <Info className="mr-2 text-primary h-5 w-5" />
            <h3 className="text-lg font-semibold">
              Ringkasan {selectedCommodity.name}
            </h3>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Kategori</span>
            <span className="font-semibold">{selectedCommodity.category}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Satuan</span>
            <span className="font-semibold">{selectedCommodity.unit}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Harga</span>
            <span className="font-semibold text-primary">
              <AnimatedNumber
                duration={100}
                value={selectedCommodityPrice.price}
                formatValue={(val) => `Rp. ${val.toFixed(2)}`}
              />
            </span>
          </div>

          {selectedCommodityPrice.changePercentage !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Perubahan Harga
              </span>
              <div
                className={`flex items-center ${
                  selectedCommodityPrice.changePercentage > 0
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}
              >
                {selectedCommodityPrice.changePercentage > 0 ? (
                  <ArrowUpIcon size={14} className="mr-1" />
                ) : (
                  <ArrowDownIcon size={14} className="mr-1" />
                )}
                <AnimatedNumber
                  duration={100}
                  value={Math.abs(selectedCommodityPrice.changePercentage)}
                  formatValue={(val) => `${val.toFixed(2)}%`}
                />
              </div>
            </div>
          )}
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total Komoditas</span>
          <span className="font-semibold">
            <AnimatedNumber
              duration={70}
              value={totalCommodities}
              formatValue={(val) => val.toString()}
            />
          </span>
        </div>

        {highestPriceCommodity && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Harga Tertinggi
            </span>
            <div className="flex items-center">
              <span className="font-semibold mr-1">
                {highestPriceCommodity.commodity.name}:
              </span>
              <span className="text-primary font-semibold">
                <AnimatedNumber
                  duration={70}
                  value={highestPriceCommodity.priceData.price}
                  formatValue={(val) => `Rp. ${val.toFixed(2)}`}
                />
              </span>
            </div>
          </div>
        )}

        {lowestPriceCommodity && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Harga Terendah
            </span>
            <div className="flex items-center">
              <span className="font-semibold mr-1">
                {lowestPriceCommodity.commodity.name}:
              </span>
              <span className="text-primary font-semibold">
                <AnimatedNumber
                  duration={70}
                  value={lowestPriceCommodity.priceData.price}
                  formatValue={(val) => `Rp. ${val.toFixed(2)}`}
                />
              </span>
            </div>
          </div>
        )}

        {biggestIncrease && biggestIncrease.priceData.changePercentage! > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Persentase Tertinggi
            </span>
            <div className="flex items-center">
              <span className="font-semibold mr-1">
                {biggestIncrease.commodity.name}:
              </span>
              <span className="text-green-500 font-semibold flex items-center">
                <ArrowUpIcon size={14} className="mr-1" />
                <AnimatedNumber
                  duration={70}
                  value={biggestIncrease.priceData.changePercentage || 0}
                  formatValue={(val) => `${val.toFixed(2)}%`}
                />
              </span>
            </div>
          </div>
        )}

        {biggestDecrease && biggestDecrease.priceData.changePercentage! < 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Persentase Terendah
            </span>
            <div className="flex items-center">
              <span className="font-semibold mr-1">
                {biggestDecrease.commodity.name}:
              </span>
              <span className="text-red-500 font-semibold flex items-center">
                <ArrowDownIcon size={14} className="mr-1" />
                <AnimatedNumber
                  duration={70}
                  value={Math.abs(
                    biggestDecrease.priceData.changePercentage || 0
                  )}
                  formatValue={(val) => `${val.toFixed(2)}%`}
                />
              </span>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 dark:from-green-100/10  to-red-200 dark:to-red-200/10 via-indigo-100 dark:via-indigo-100/10">
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        <Header className="animate-fade-in" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <FilterPanel
              onFilterChange={handleFilterChange}
              className="animate-fade-in animate-delay-200 sticky top-6"
            />

            <div className="mt-6 glass-panel rounded-xl p-4 animate-fade-in animate-delay-300">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Ringkasan Pasar</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAllCommoditiesOpen(true)}
                  className="text-xs"
                >
                  <ListFilter className="h-3.5 w-3.5 mr-1" />
                  Semua Komoditas
                </Button>
              </div>

              {renderMarketOverview()}

              <div className="mt-6 flex items-center justify-center">
                <Button
                  variant="link"
                  className="text-sm text-primary p-0 h-auto"
                  onClick={() => setDetailedReportOpen(true)}
                >
                  <span>Lihat Laporan Detail</span>
                  <ArrowRightIcon size={14} className="ml-1" />
                </Button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel rounded-xl p-6 animate-fade-in animate-delay-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">
                    {selectedLocation?.name || 'Nasional'} Pasar
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    {getTimeRangeDescription()} tren harga{' '}
                    {selectedCommodityId
                      ? commodities.find((c) => c.id === selectedCommodityId)
                          ?.name
                      : 'Semua Komoditas'}
                  </p>
                </div>

                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
                    <span className="text-sm">Peningkatan</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                    <span className="text-sm">Penurunan</span>
                  </div>
                </div>
              </div>
            </div>

            <PriceChart
              data={chartData}
              title={`${
                selectedCommodityId
                  ? `${
                      commodities.find((c) => c.id === selectedCommodityId)
                        ?.name
                    } `
                  : 'Komoditas Teratas '
              } Tren Harga (${getTimeRangeDescription()})`}
              className="animate-fade-in animate-delay-200"
            />

            <div className="animate-fade-in animate-delay-300">
              <h3 className="text-lg font-semibold mb-3">Komoditas Teratas</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {topCommodities.map(({ commodity, priceData }, index) => (
                  <CommodityCard
                    key={commodity.id}
                    commodity={commodity}
                    priceData={priceData}
                    isSelected={selectedCommodityId === commodity.id}
                    onClick={() => handleCommoditySelect(commodity.id)}
                    className="animate-fade-in"
                    animationDelay={`${400 + index * 100}ms`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          className={
            'flex flex-col md:flex-row items-center justify-between py-4 px-6 glass-panel rounded-xl my-5'
          }
        >
          <div className="flex items-center w-full justify-between mb-4 md:mb-0">
            <h1 className="text-normal font-semibold">
              {' '}
              {new Date().getFullYear()} &copy; Disperindag Prov. Lampung
            </h1>
            <h1 className="text-normal flex items-center font-semibold">
              Build with &nbsp;
              <span className="text-red-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="icon icon-tabler icons-tabler-filled icon-tabler-heart"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037 .033l.034 -.03a6 6 0 0 1 4.733 -1.44l.246 .036a6 6 0 0 1 3.364 10.008l-.18 .185l-.048 .041l-7.45 7.379a1 1 0 0 1 -1.313 .082l-.094 -.082l-7.493 -7.422a6 6 0 0 1 3.176 -10.215z" />
                </svg>
              </span>
              &nbsp; By Akbar
            </h1>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DetailedReportModal
        open={detailedReportOpen}
        onOpenChange={setDetailedReportOpen}
        chartData={chartData}
        selectedCommodity={selectedCommodity}
        locationPrices={locationPrices}
        timeRangeDescription={getTimeRangeDescription()}
      />

      <AllCommoditiesModal
        open={allCommoditiesOpen}
        onOpenChange={setAllCommoditiesOpen}
        commodities={commodities}
        onSelect={handleCommoditySelect}
        selectedCommodityId={selectedCommodityId}
      />
      <Button
        variant="default"
        className="fixed bottom-10 right-10 rounded-4xl bg-gray-500 w-12 h-12 cursor-pointer shadow-lg hover:bg-gray-600 transition-colors duration-300"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
      </Button>
    </div>
  )
}
