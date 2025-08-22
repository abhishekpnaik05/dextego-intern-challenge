import { NextResponse } from 'next/server'
import { Call, ApiResponse } from '../../../lib/types'
import callsData from '../../../data/calls.json'

export async function GET(): Promise<NextResponse<ApiResponse<Call[]>>> {
  try {
    const calls = callsData.calls as Call[]

    return NextResponse.json({
      data: calls,
      success: true
    })
  } catch (error) {
    return NextResponse.json({
      data: [],
      success: false,
      error: 'Failed to fetch calls'
    }, { status: 500 })
  }
}
