import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Commodity } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

interface AllCommoditiesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  commodities: Commodity[]
  onSelect: (commodityId: string) => void
  selectedCommodityId?: string
}

const AllCommoditiesModal = ({
  open,
  onOpenChange,
  commodities,
  onSelect,
  selectedCommodityId,
}: AllCommoditiesModalProps) => {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCommodities =
    searchQuery.trim() === ''
      ? commodities
      : commodities.filter(
          (c) =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.category.toLowerCase().includes(searchQuery.toLowerCase())
        )

  const categories = [...new Set(commodities.map((c) => c.category))]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl lg:min-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl">Semua Komoditas</DialogTitle>
        </DialogHeader>

        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari Komoditas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-6">
            {categories.map((category) => {
              const categoryCommodities = filteredCommodities.filter(
                (c) => c.category === category
              )
              if (categoryCommodities.length === 0) return null

              return (
                <div key={category}>
                  <h3 className="font-semibold text-lg mb-3">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {categoryCommodities.map((commodity) => (
                      <Button
                        key={commodity.id}
                        variant={
                          selectedCommodityId === commodity.id
                            ? 'default'
                            : 'outline'
                        }
                        className="justify-start h-auto py-3 px-4 overflow-hidden"
                        onClick={() => {
                          onSelect(commodity.id)
                          onOpenChange(false)
                        }}
                      >
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{commodity.name}</span>
                          <span
                            className={`${
                              selectedCommodityId === commodity.id
                                ? 'text-gray-100'
                                : 'text-gray-700'
                            } text-xs`}
                          >
                            {commodity.unit}
                          </span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              )
            })}

            {filteredCommodities.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Tidak ada Komoditas "{searchQuery}"
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default AllCommoditiesModal
