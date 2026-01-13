interface RoomControlsProps {
  onReveal: () => void
  onReset: () => void
  isRevealed: boolean
  hasVotes: boolean
}

export default function RoomControls({ onReveal, onReset, isRevealed, hasVotes }: RoomControlsProps) {
  return (
    <div className="bg-slate-800/90 backdrop-blur-sm rounded-lg shadow-2xl p-6 border-2 border-indigo-500/50">
      <div className="flex gap-3">
        {!isRevealed ? (
          <button
            onClick={onReveal}
            disabled={!hasVotes}
            className={`
              flex-1 py-4 px-6 rounded-lg font-bold text-lg transition-all transform
              ${hasVotes
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg hover:shadow-xl hover:scale-105'
                : 'bg-slate-600 text-slate-400 cursor-not-allowed'
              }
            `}
          >
            🎴 Reveal Votes
          </button>
        ) : (
          <button
            onClick={onReset}
            className="flex-1 py-4 px-6 rounded-lg font-bold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white transition-all transform shadow-lg hover:shadow-xl hover:scale-105"
          >
            🔄 Reset & Start New Round
          </button>
        )}
      </div>
    </div>
  )
}
