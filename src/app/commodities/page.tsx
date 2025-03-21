'use client'
import React, { useState } from 'react'
import { commodities } from '@/lib/mockData'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AllCommodities() {
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

  const handleCommoditySelect = (commodityId: string) => {
    // navigate('/', { state: { selectedCommodityId: commodityId } })
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        <motion.div
          className="mb-6 flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                // navigate('/')
              }}
              asChild
            >
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <ArrowLeft className="h-5 w-5" />
              </motion.div>
            </Button>
            <h1 className="text-2xl font-bold ml-2">All Commodities</h1>
          </div>
          <motion.div
            className="relative w-64"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search commodities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </motion.div>
        </motion.div>

        <motion.div
          className="space-y-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {categories.map((category, categoryIndex) => {
            const categoryCommodities = filteredCommodities.filter(
              (c) => c.category === category
            )
            if (categoryCommodities.length === 0) return null

            return (
              <motion.div
                key={category}
                variants={item}
                transition={{ duration: 0.3, delay: categoryIndex * 0.1 }}
              >
                <h3 className="font-semibold text-xl mb-4">{category}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {categoryCommodities.map((commodity, index) => (
                    <motion.div
                      key={commodity.id}
                      className="glass-panel p-4 rounded-xl hover:bg-accent/50 cursor-pointer transition-colors"
                      onClick={() => handleCommoditySelect(commodity.id)}
                      variants={item}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{
                        scale: 1.03,
                        backgroundColor: 'rgba(var(--accent), 0.2)',
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <h4 className="font-medium">{commodity.name}</h4>
                      <div className="flex justify-between mt-2">
                        <span className="text-sm text-muted-foreground">
                          {commodity.unit}
                        </span>
                        {commodity.icon && (
                          <div className="text-primary">{commodity.icon}</div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )
          })}

          {filteredCommodities.length === 0 && (
            <motion.div
              className="text-center py-12 text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              No commodities found matching "{searchQuery}"
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
