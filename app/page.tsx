// pages/dashboard.tsx or app/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Call, ApiResponse } from '../lib/types'
import { CallCard } from '../components/CallCard'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { SearchAndFilter } from '../components/SearchAndFilter'
import { BarChart3, TrendingUp, Users, Phone } from 'lucide-react'

export default function Dashboard() {
  const [allCalls, setAllCalls] = useState<Call[]>([])
  const [filteredCalls, setFilteredCalls] = useState<Call[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCalls()
  }, [])

  const fetchCalls = async () => {
    try {
      const response = await fetch('/api/calls')
      const data: ApiResponse<Call[]> = await response.json()
      
      if (data.success) {
        setAllCalls(data.data)
        setFilteredCalls(data.data) // Initially show all calls
      } else {
        setError(data.error || 'Failed to fetch calls')
      }
    } catch (err) {
      setError('Failed to fetch calls')
    } finally {
      setLoading(false)
    }
  }

  const handleFilteredCalls = (filtered: Call[]) => {
    setFilteredCalls(filtered)
  }

  // Calculate stats based on filtered calls
  const stats = {
    totalCalls: filteredCalls.length,
    avgDuration: filteredCalls.reduce((acc, call) => acc + call.duration, 0) / filteredCalls.length / 60,
    qualifiedRate: (filteredCalls.filter(call => call.outcome === 'qualified' || call.outcome === 'closed-won').length / filteredCalls.length) * 100,
    avgSentiment: filteredCalls.reduce((acc, call) => acc + call.sentimentScore, 0) / filteredCalls.length
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-3xl font-bold mb-2"
          style={{ color: "rgb(var(--foreground))" }}
        >
          Sales Dashboard
        </h1>
        <p style={{ color: "rgb(var(--foreground))" }}>
          Overview of your sales call performance
        </p>
      </div>

      {/* Search and Filter */}
      <SearchAndFilter 
        calls={allCalls} 
        onFilteredCalls={handleFilteredCalls} 
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Stats cards remain the same but now use filteredCalls data */}
        <div
          className="rounded-lg border p-6"
          style={{
            backgroundColor: "rgb(var(--background))",
            color: "rgb(var(--foreground))",
            borderColor: "rgb(var(--border))"
          }}
        >
          <div className="flex items-center">
            <Phone className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium">Total Calls</p>
              <p className="text-2xl font-bold">{stats.totalCalls}</p>
            </div>
          </div>
        </div>

        <div
          className="rounded-lg border p-6"
          style={{
            backgroundColor: "rgb(var(--background))",
            color: "rgb(var(--foreground))",
            borderColor: "rgb(var(--border))"
          }}
        >
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium">Avg Duration</p>
              <p className="text-2xl font-bold">
                {isNaN(stats.avgDuration) ? '0' : Math.round(stats.avgDuration)}m
              </p>
            </div>
          </div>
        </div>

        <div
          className="rounded-lg border p-6"
          style={{
            backgroundColor: "rgb(var(--background))",
            color: "rgb(var(--foreground))",
            borderColor: "rgb(var(--border))"
          }}
        >
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium">Qualified Rate</p>
              <p className="text-2xl font-bold">
                {isNaN(stats.qualifiedRate) ? '0' : Math.round(stats.qualifiedRate)}%
              </p>
            </div>
          </div>
        </div>

        <div
          className="rounded-lg border p-6"
          style={{
            backgroundColor: "rgb(var(--background))",
            color: "rgb(var(--foreground))",
            borderColor: "rgb(var(--border))"
          }}
        >
          <div className="flex items-center">
            <Users className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium">Avg Sentiment</p>
              <p className="text-2xl font-bold">
                {isNaN(stats.avgSentiment) ? '0' : (stats.avgSentiment * 100).toFixed(0)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Calls */}
      <div className="mb-8">
        <h2
          className="text-2xl font-bold mb-6"
          style={{ color: "rgb(var(--foreground))" }}
        >
          {filteredCalls.length === allCalls.length ? 'Recent Calls' : 'Filtered Results'}
        </h2>
        
        {error ? (
          <ErrorMessage message={error} />
        ) : filteredCalls.length === 0 ? (
          <div className="text-center py-12">
            <p style={{ color: "rgb(var(--foreground))" }}>
              No calls match your search criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCalls.slice(0, 12).map((call) => (
              <CallCard key={call.id} call={call} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}