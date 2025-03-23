// components/GiveawayStatusUpdater.tsx
"use client"

import { useEffect, useState } from 'react'
import { checkAndUpdateGiveawayStatuses } from '@/lib/api'

/**
 * This component doesn't render anything visually but performs background status updates.
 * Include this component in your layout or pages where giveaway status should be kept updated.
 */
export default function GiveawayStatusUpdater() {
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [updateCount, setUpdateCount] = useState(0)

  useEffect(() => {
    // Run the update immediately on first load
    const updateStatuses = async () => {
      try {
        await checkAndUpdateGiveawayStatuses()
        setLastUpdate(new Date())
        setUpdateCount(prev => prev + 1)
        console.log('Giveaway statuses updated successfully')
      } catch (error) {
        console.error('Failed to update giveaway statuses:', error)
      }
    }

    updateStatuses()

    // Set up an interval to check every 5 minutes (300000ms)
    // You can adjust this interval as needed
    const intervalId = setInterval(updateStatuses, 300000)

    return () => clearInterval(intervalId)
  }, [])

  // This component doesn't render anything visible
  return null
}