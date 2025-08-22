// app/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Call, ApiResponse } from '../lib/types'
import { CallCard } from '../components/CallCard'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { SearchAndFilter } from '../components/SearchAndFilter'
import { Charts } from '../components/Charts'
import { BarChart3, TrendingUp, Users, Phone, FileText } from 'lucide-react'

// XLSX & FileSaver
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export default function Dashboard() {
  const [allCalls, setAllCalls] = useState<Call[]>([])
  const [filteredCalls, setFilteredCalls] = useState<Call[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetchCalls()
  }, [])

  const fetchCalls = async () => {
    try {
      const response = await fetch('/api/calls')

      if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`)

      const data: ApiResponse<Call[]> = await response.json()

      if (data.success) {
        setAllCalls(data.data)
        setFilteredCalls(data.data)
      } else {
        throw new Error(data.error || 'Failed to fetch calls')
      }
    } catch (err: any) {
      setError(err.message || 'Unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleFilteredCalls = (filtered: Call[]) => {
    setFilteredCalls(filtered)
    setCurrentPage(1) // Reset page when filter changes
  }

  // Pagination logic
  const lastIndex = currentPage * itemsPerPage
  const firstIndex = lastIndex - itemsPerPage
  const currentCalls = filteredCalls.slice(firstIndex, lastIndex)
  const totalPages = Math.ceil(filteredCalls.length / itemsPerPage)

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return
    setCurrentPage(newPage)
  }

  // Export CSV/Excel
  const exportToExcel = () => {
    if (filteredCalls.length === 0) return
    const ws = XLSX.utils.json_to_sheet(filteredCalls)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Calls')
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([buf], { type: 'application/octet-stream' })
    saveAs(blob, 'calls.xlsx')
  }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />

  const stats = {
    totalCalls: filteredCalls.length,
    avgDuration:
      filteredCalls.length > 0
        ? filteredCalls.reduce((acc, call) => acc + call.duration, 0) / filteredCalls.length / 60
        : 0,
    qualifiedRate:
      filteredCalls.length > 0
        ? (filteredCalls.filter(
            (call) =>
              (call.outcome ?? '').toLowerCase() === 'qualified' ||
              (call.outcome ?? '').toLowerCase() === 'closed-won'
          ).length /
            filteredCalls.length) *
          100
        : 0,
    avgSentiment:
      filteredCalls.length > 0
        ? filteredCalls.reduce((acc, call) => acc + call.sentimentScore, 0) / filteredCalls.length
        : 0,
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'rgb(var(--foreground))' }}>
          Sales Dashboard
        </h1>
        <p style={{ color: 'rgb(var(--foreground))' }}>Overview of your sales call performance</p>
      </div>

      {/* Search and Filter */}
      <SearchAndFilter calls={allCalls} onFilteredCalls={handleFilteredCalls} />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="rounded-lg border p-6" style={{ backgroundColor: 'rgb(var(--background))', color: 'rgb(var(--foreground))', borderColor: 'rgb(var(--border))' }}>
          <div className="flex items-center">
            <Phone className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium">Total Calls</p>
              <p className="text-2xl font-bold">{stats.totalCalls}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-6" style={{ backgroundColor: 'rgb(var(--background))', color: 'rgb(var(--foreground))', borderColor: 'rgb(var(--border))' }}>
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium">Avg Duration</p>
              <p className="text-2xl font-bold">{Math.round(stats.avgDuration)}m</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-6" style={{ backgroundColor: 'rgb(var(--background))', color: 'rgb(var(--foreground))', borderColor: 'rgb(var(--border))' }}>
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium">Qualified Rate</p>
              <p className="text-2xl font-bold">{Math.round(stats.qualifiedRate)}%</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-6" style={{ backgroundColor: 'rgb(var(--background))', color: 'rgb(var(--foreground))', borderColor: 'rgb(var(--border))' }}>
          <div className="flex items-center">
            <Users className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium">Avg Sentiment</p>
              <p className="text-2xl font-bold">{(stats.avgSentiment * 100).toFixed(0)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <Charts calls={filteredCalls} />

      {/* Export Button */}
      <div className="mb-4 text-right">
        <button
          onClick={exportToExcel}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <FileText className="mr-2" /> Export Excel
        </button>
      </div>

      {/* Recent Calls with Pagination */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'rgb(var(--foreground))' }}>
          {filteredCalls.length === allCalls.length ? 'Recent Calls' : 'Filtered Results'}
        </h2>

        {currentCalls.length === 0 ? (
          <div className="text-center py-12">
            <p style={{ color: 'rgb(var(--foreground))' }}>No calls match your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCalls.map((call) => (
              <CallCard key={call.id} call={call} />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {filteredCalls.length > itemsPerPage && (
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-1">{currentPage} / {totalPages}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
