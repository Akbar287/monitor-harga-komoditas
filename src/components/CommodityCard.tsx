import React from 'react'
import { cn } from '@/lib/utils'
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react'
import { Commodity, PriceData } from '@/lib/types'
import AnimatedNumber from './AnimatedNumber'
import { motion } from 'framer-motion'

export interface CommodityCardProps {
  commodity: Commodity
  priceData: PriceData
  isSelected?: boolean
  onClick?: () => void
  className?: string
  animationDelay?: string
}

const CommodityCard = ({
  commodity,
  priceData,
  isSelected = false,
  onClick,
  className,
  animationDelay,
}: CommodityCardProps) => {
  const isUp = (priceData.changePercentage || 0) > 0

  return (
    <motion.div
      className={cn(
        'glass-panel rounded-xl p-4 transition-all duration-200 cursor-pointer hover:shadow-md',
        isSelected ? 'ring-2 ring-primary' : '',
        className
      )}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: animationDelay ? parseFloat(animationDelay) / 1000 : 0,
      }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">{commodity.name}</h3>
        <span className="text-xs px-2 py-1 rounded-full bg-secondary/20">
          {commodity.category}
        </span>
      </div>

      <div className="mt-3">
        <div className="text-2xl font-bold flex items-center">
          <AnimatedNumber
            value={priceData.price}
            duration={250}
            formatValue={(val) => `Rp. ${val.toFixed(2)}`}
          />
          <span className="text-xs ml-1">/ {commodity.unit}</span>
        </div>

        {priceData.changePercentage !== undefined && (
          <motion.div
            className={cn(
              'flex items-center mt-1',
              isUp ? 'text-green-500' : 'text-red-500'
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {isUp ? <ArrowUpIcon size={14} /> : <ArrowDownIcon size={14} />}
            <AnimatedNumber
              duration={250}
              value={Math.abs(priceData.changePercentage)}
              formatValue={(val) => `${val.toFixed(2)}%`}
              className="ml-1 text-sm"
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default CommodityCard
