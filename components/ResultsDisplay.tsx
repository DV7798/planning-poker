interface User {
  id: string
  name: string
  vote: number | null
  hasVoted: boolean
}

interface ResultsDisplayProps {
  users: User[]
}

export default function ResultsDisplay({ users }: ResultsDisplayProps) {
  const votes = users
    .filter(u => u.hasVoted && u.vote !== null)
    .map(u => u.vote as number)

  const getStats = () => {
    if (votes.length === 0) return null

    const sorted = [...votes].sort((a, b) => a - b)
    const min = sorted[0]
    const max = sorted[sorted.length - 1]
    const avg = votes.reduce((a, b) => a + b, 0) / votes.length
    const median = sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)]

    // Count occurrences
    const counts: Record<number, number> = {}
    votes.forEach(v => {
      counts[v] = (counts[v] || 0) + 1
    })

    const mostCommon = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])[0]

    return { min, max, avg, median, mostCommon, counts }
  }

  const stats = getStats()

  return (
    <div className="bg-slate-800/90 backdrop-blur-sm rounded-lg shadow-2xl p-6 border-2 border-indigo-500/50">
      <h2 className="text-xl font-semibold text-indigo-200 mb-4">📊 Voting Results</h2>
      
      {stats ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-600/30 border-2 border-blue-500/50 p-4 rounded-lg backdrop-blur-sm">
              <div className="text-sm text-indigo-200">Minimum</div>
              <div className="text-2xl font-bold text-blue-300">{stats.min}</div>
            </div>
            <div className="bg-green-600/30 border-2 border-green-500/50 p-4 rounded-lg backdrop-blur-sm">
              <div className="text-sm text-indigo-200">Maximum</div>
              <div className="text-2xl font-bold text-green-300">{stats.max}</div>
            </div>
            <div className="bg-purple-600/30 border-2 border-purple-500/50 p-4 rounded-lg backdrop-blur-sm">
              <div className="text-sm text-indigo-200">Average</div>
              <div className="text-2xl font-bold text-purple-300">{stats.avg.toFixed(1)}</div>
            </div>
            <div className="bg-orange-600/30 border-2 border-orange-500/50 p-4 rounded-lg backdrop-blur-sm">
              <div className="text-sm text-indigo-200">Median</div>
              <div className="text-2xl font-bold text-orange-300">{stats.median.toFixed(1)}</div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-indigo-200 mb-3">Vote Distribution</h3>
            <div className="space-y-2">
              {Object.entries(stats.counts)
                .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
                .map(([value, count]) => {
                  const percentage = (count / votes.length) * 100
                  return (
                    <div key={value} className="flex items-center gap-3">
                      <div className="w-12 text-sm font-semibold text-indigo-200">{value}</div>
                      <div className="flex-1 bg-slate-700/50 rounded-full h-6 overflow-hidden border border-indigo-500/30">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full flex items-center justify-end pr-2"
                          style={{ width: `${percentage}%` }}
                        >
                          {percentage > 10 && (
                            <span className="text-xs text-white font-semibold">{count}</span>
                          )}
                        </div>
                      </div>
                      <div className="w-8 text-sm text-indigo-200 text-right">{count}</div>
                    </div>
                  )
                })}
            </div>
          </div>

          {stats.mostCommon && parseInt(stats.mostCommon[1]) > 1 && (
            <div className="mt-4 p-4 bg-yellow-600/30 border-2 border-yellow-500/50 rounded-lg backdrop-blur-sm">
              <p className="text-sm text-yellow-200">
                <span className="font-semibold">Most common vote:</span> {stats.mostCommon[0]} 
                {' '}({stats.mostCommon[1]} {parseInt(stats.mostCommon[1]) === 1 ? 'vote' : 'votes'})
              </p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-indigo-300 text-center py-4">No votes yet</p>
      )}
    </div>
  )
}
