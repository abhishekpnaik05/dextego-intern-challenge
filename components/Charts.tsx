// components/Charts.tsx
'use client'

import { Call } from '../lib/types'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, BarChart, Bar,
} from 'recharts'

interface ChartsProps {
  calls: Call[]
}

export function Charts({ calls }: ChartsProps) {
  // ----- LineChart: Calls Over Time -----
  const callsByDate = Object.values(
    calls.reduce((acc: any, call) => {
      const date = new Date(call.date).toLocaleDateString()
      if (!acc[date]) acc[date] = { date, total: 0, qualified: 0 }
      acc[date].total++
      if (call.outcome === 'qualified' || call.outcome === 'closed-won') acc[date].qualified++
      return acc
    }, {})
  )

  // ----- PieChart: Outcome Distribution -----
  const outcomeData = [
    { name: 'Qualified', value: calls.filter(c => c.outcome === 'qualified' || c.outcome === 'closed-won').length },
    { name: 'Lost', value: calls.filter(c => c.outcome === 'lost').length },
    { name: 'Other', value: calls.filter(c => !['qualified','closed-won','lost'].includes(c.outcome)).length },
  ]
  const COLORS = ['#00C49F', '#FF8042', '#8884d8']

  // ----- BarChart: Avg Sentiment by Outcome -----
  const outcomeGroups = ['qualified', 'closed-won', 'lost', 'other']
  const sentimentData = outcomeGroups.map((o) => {
    const filtered = calls.filter(c => 
      o === 'other' ? !['qualified','closed-won','lost'].includes(c.outcome) : c.outcome === o
    )
    const avgSentiment = filtered.length > 0 ? filtered.reduce((a,b) => a+b.sentimentScore,0)/filtered.length : 0
    return { outcome: o, sentiment: avgSentiment }
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      
      {/* Line Chart */}
      <div className="p-4 rounded-lg border" style={{ borderColor: 'rgb(var(--border))', backgroundColor: 'rgb(var(--background))' }}>
        <h3 className="font-bold mb-2">Calls Over Time</h3>
        <LineChart width={400} height={250} data={callsByDate}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="total" stroke="#8884d8" />
          <Line type="monotone" dataKey="qualified" stroke="#00C49F" />
        </LineChart>
      </div>

      {/* Pie Chart */}
      <div className="p-4 rounded-lg border" style={{ borderColor: 'rgb(var(--border))', backgroundColor: 'rgb(var(--background))' }}>
        <h3 className="font-bold mb-2">Call Outcome Distribution</h3>
        <PieChart width={400} height={250}>
          <Pie
            data={outcomeData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {outcomeData.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      {/* Bar Chart */}
      <div className="p-4 rounded-lg border col-span-1 md:col-span-2" style={{ borderColor: 'rgb(var(--border))', backgroundColor: 'rgb(var(--background))' }}>
        <h3 className="font-bold mb-2">Avg Sentiment by Outcome</h3>
        <BarChart width={800} height={300} data={sentimentData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="outcome" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="sentiment" fill="#FF8042" />
        </BarChart>
      </div>
    </div>
  )
}
