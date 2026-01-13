import TableConfetti from './TableConfetti'

interface User {
  id: string
  name: string
  vote: number | null
  hasVoted: boolean
}

interface PokerTableProps {
  users: User[]
  isRevealed: boolean
  currentUser: string
  currentStory: string
  onReveal?: () => void
  allVoted?: boolean
  showConfetti?: boolean
}

export default function PokerTable({ users, isRevealed, currentUser, currentStory, onReveal, allVoted, showConfetti }: PokerTableProps) {
  // Calculate positions for users around the table (circular)
  const getPosition = (index: number, total: number) => {
    if (total === 0) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
    
    const angle = (index * 360) / total - 90 // Start from top
    const radius = total <= 4 ? 35 : total <= 6 ? 40 : 45 // Adjust radius based on number of users
    const radian = (angle * Math.PI) / 180
    
    const x = 50 + radius * Math.cos(radian)
    const y = 50 + radius * Math.sin(radian)
    
    return {
      top: `${y}%`,
      left: `${x}%`,
      transform: 'translate(-50%, -50%)',
    }
  }

  return (
    <div className="relative w-full mx-auto" style={{ paddingBottom: '35%' }}>
      {/* Confetti Overlay */}
      {showConfetti && (
        <>
          <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden rounded-[50%]" id="poker-table-confetti-container">
            {/* Confetti canvas will be rendered here */}
          </div>
          <TableConfetti trigger={showConfetti} containerId="poker-table-confetti-container" />
        </>
      )}
      
      {/* Poker Table Surface - Horizontal/Oval shape */}
      <div className="absolute inset-0 rounded-[50%] bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-900 shadow-2xl border-8 border-slate-800">
        {/* Table felt texture */}
        <div className="absolute inset-0 rounded-full bg-emerald-700 opacity-90" 
             style={{
               backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.15) 1px, transparent 0)',
               backgroundSize: '20px 20px'
             }}>
        </div>
        
        {/* Table center area */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/5 h-2/5 rounded-full bg-emerald-800 border-4 border-slate-700 flex items-center justify-center">
          <div className="text-center p-4">
            {allVoted && !isRevealed && onReveal ? (
              <button
                onClick={onReveal}
                className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold py-3 px-6 rounded-lg shadow-xl transform hover:scale-105 transition-all text-sm"
              >
                🎴 Reveal Cards
              </button>
            ) : currentStory ? (
              <div className="text-white text-xs font-semibold max-w-xs">
                {currentStory}
              </div>
            ) : (
              <div className="text-emerald-200 text-xs italic">
                Enter story above
              </div>
            )}
            {!isRevealed && users.length > 0 && !allVoted && (
              <div className="mt-2 text-emerald-200 text-xs">
                {users.filter(u => u.hasVoted).length} / {users.length} voted
              </div>
            )}
          </div>
        </div>

        {/* User Seats */}
        {users.map((user, index) => {
          const position = getPosition(index, users.length)
          const isCurrentUser = user.name === currentUser
          
          return (
            <div
              key={user.id}
              className="absolute"
              style={position}
            >
              <div className={`
                relative transform transition-all duration-300 flex flex-col items-center
                ${isCurrentUser ? 'scale-110 z-10' : 'scale-100'}
              `}>
                {/* Card Symbol - More realistic playing card */}
                <div className={`
                  w-12 rounded-lg border-2 shadow-2xl relative overflow-hidden
                  ${isCurrentUser 
                    ? 'bg-gradient-to-br from-white to-slate-50 border-teal-400 ring-4 ring-teal-300' 
                    : 'bg-gradient-to-br from-white to-slate-100 border-slate-400'
                  }
                `}
                style={{ height: '4.5rem' }}>
                  {/* Card corner decoration */}
                  <div className="absolute top-1 left-1 text-teal-600 font-bold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute bottom-1 right-1 text-teal-600 font-bold text-xs rotate-180">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  {/* Card center symbol */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl">🃏</span>
                  </div>
                  {/* Card suit pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-teal-600 text-lg">♠</div>
                    <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 text-teal-600 text-lg">♠</div>
                  </div>
                </div>
                
                {/* Name Label - Larger */}
                <div className="mt-2 whitespace-nowrap">
                  <div className={`
                    px-3 py-1.5 rounded-lg text-sm font-bold text-white shadow-lg
                    ${isCurrentUser ? 'bg-gradient-to-r from-teal-600 to-cyan-600' : 'bg-gradient-to-r from-slate-700 to-slate-800'}
                  `}>
                    {user.name}
                    {isCurrentUser && <span className="ml-1 text-sm">(You)</span>}
                  </div>
                </div>

                {/* Vote Card Display */}
                {user.hasVoted && (
                  <div className={`absolute left-1/2 transform -translate-x-1/2 ${isRevealed ? '-top-16' : '-top-12'} z-20`}>
                    {isRevealed ? (
                      <div className={`
                        bg-gradient-to-br from-teal-500/90 via-cyan-500/90 to-teal-600/90 
                        w-14 rounded-lg border-2 flex items-center justify-center 
                        shadow-xl transform transition-all duration-500
                        ${isCurrentUser 
                          ? 'border-teal-300 ring-2 ring-teal-400/50 ring-opacity-50 scale-105' 
                          : 'border-teal-400/60 ring-1 ring-teal-300/30 ring-opacity-30 scale-100'
                        }
                      `}
                      style={{ height: '5.5rem' }}>
                        <div className="text-center">
                          <span className="text-4xl font-black text-white drop-shadow-lg">
                            {user.vote !== null ? user.vote : '?'}
                          </span>
                          <div className="text-xs font-semibold text-teal-100 mt-0.5 opacity-90">
                            {user.name}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-red-600 w-10 h-14 rounded border-2 border-red-800 flex items-center justify-center shadow-xl">
                        <span className="text-white text-xs font-bold">VOTED</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Waiting Indicator */}
                {!user.hasVoted && !isRevealed && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gray-600 px-2 py-1 rounded text-white text-xs animate-pulse">
                      Waiting...
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {/* Empty seats indicator */}
        {users.length === 0 && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-emerald-200 text-center">
            <p className="text-lg font-semibold">Waiting for players...</p>
            <p className="text-sm mt-2">Share the room ID to invite teammates</p>
          </div>
        )}
      </div>
    </div>
  )
}
