import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const Loading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 dark:from-green-100/10  to-red-200 dark:to-red-200/10 via-indigo-100 dark:via-indigo-100/10">
      <div className="container mx-auto py-6 px-4 max-w-7xl space-y-2">
        <div className="flex flex-col justify-center">
          <Skeleton className="w-full h-32 rounded-lg" />
        </div>
        <div className="flex flex-col md:flex-row justify-between space-x-2">
          <Skeleton className="w-1/3 h-64 rounded-lg" />
          <Skeleton className="w-2/3 h-64 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export default Loading
