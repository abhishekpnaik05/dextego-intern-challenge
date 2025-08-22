// components/SearchAndFilter.tsx
'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Calendar, X } from 'lucide-react'
import { Call } from '../lib/types'

interface SearchAndFilterProps {
  calls: Call[]
  onFilteredCalls: (filteredCalls: Call[]) => void
}

interface Filters {
  searchTerm: string
  outcome: string
  sentiment: string
  duration: string
  dateRange: string
  status: string
}

export function SearchAndFilter({ calls, onFilteredCalls }: SearchAndFilterProps) {
  const [filters, setFilters] = useState<Filters>({
    searchTerm: '',
    outcome: 'all',
    sentiment: 'all',
    duration: 'all',
    dateRange: 'all',
    status: 'all'
  })
  const [showFilters, setShowFilters] = useState(false)

  // Debounce search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      filterCalls()
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [filters, calls])

  const filterCalls = () => {
    let filtered = calls

    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(call => 
        call.prospectName?.toLowerCase().includes(searchLower) ||
        call.outcome?.toLowerCase().includes(searchLower) ||
        call.notes?.toLowerCase().includes(searchLower) ||
        call.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(call => call.status === filters.status)
    }

    // Outcome filter
    if (filters.outcome !== 'all') {
      filtered = filtered.filter(call => call.outcome === filters.outcome)
    }

    // Sentiment filter
    if (filters.sentiment !== 'all') {
      filtered = filtered.filter(call => {
        if (filters.sentiment === 'positive') return call.sentimentScore > 0.6
        if (filters.sentiment === 'neutral') return call.sentimentScore >= 0.4 && call.sentimentScore <= 0.6
        if (filters.sentiment === 'negative') return call.sentimentScore < 0.4
        return true
      })
    }

    // Duration filter
    if (filters.duration !== 'all') {
      filtered = filtered.filter(call => {
        const durationMinutes = call.duration / 60
        if (filters.duration === 'short') return durationMinutes < 5
        if (filters.duration === 'medium') return durationMinutes >= 5 && durationMinutes <= 15
        if (filters.duration === 'long') return durationMinutes > 15
        return true
      })
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date()
      const filterDate = new Date()
      
      if (filters.dateRange === '7days') {
        filterDate.setDate(now.getDate() - 7)
      } else if (filters.dateRange === '30days') {
        filterDate.setDate(now.getDate() - 30)
      } else if (filters.dateRange === '90days') {
        filterDate.setDate(now.getDate() - 90)
      }

      filtered = filtered.filter(call => 
        new Date(call.date) >= filterDate
      )
    }

    onFilteredCalls(filtered)
  }

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      outcome: 'all',
      sentiment: 'all',
      duration: 'all',
      dateRange: 'all',
      status: 'all'
    })
  }

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== 'all' && value !== ''
  )

  return (
    <div className="mb-6 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search calls by prospect name, outcome, notes, or tags..."
          value={filters.searchTerm}
          onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
              {Object.values(filters).filter(v => v !== 'all' && v !== '').length}
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
          >
            <X className="h-4 w-4" />
            Clear all
          </button>
        )}
      </div>

              {/* Filters Panel */}
      {showFilters && (
        <div className="p-4 bg-gray-50 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {/* Outcome Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Outcome
              </label>
              <select
                value={filters.outcome}
                onChange={(e) => setFilters(prev => ({ ...prev, outcome: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Outcomes</option>
                <option value="qualified">Qualified</option>
                <option value="not-qualified">Not Qualified</option>
                <option value="closed-won">Closed Won</option>
                <option value="closed-lost">Closed Lost</option>
                <option value="follow-up">Follow Up</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="scheduled">Scheduled</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Sentiment Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sentiment
              </label>
              <select
                value={filters.sentiment}
                onChange={(e) => setFilters(prev => ({ ...prev, sentiment: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Sentiments</option>
                <option value="positive">Positive (&gt;60%)</option>
                <option value="neutral">Neutral (40-60%)</option>
                <option value="negative">Negative (&lt;40%)</option>
              </select>
            </div>

            {/* Duration Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration
              </label>
              <select
                value={filters.duration}
                onChange={(e) => setFilters(prev => ({ ...prev, duration: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Durations</option>
                <option value="short">Short (&lt;5 min)</option>
                <option value="medium">Medium (5-15 min)</option>
                <option value="long">Long (&gt;15 min)</option>
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Range
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Time</option>
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="90days">Last 90 days</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {calls.length} calls
      </div>
    </div>
  )
}