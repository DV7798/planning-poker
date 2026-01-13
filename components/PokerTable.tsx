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
  // Using smaller radius values that work better on mobile
  const getPosition = (index: number, total: number) => {
    if (total === 0) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
    
    const angle = (index * 360) / total - 90 // Start from top
    // More conservative radius to prevent overlapping on mobile
    // These values work well on both mobile and desktop
    const radius = total <= 2 ? 30 : total <= 4 ? 32 : total <= 6 ? 36 : 38
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
    <div className="relative w-full mx-auto" style={{ paddingBottom: 'clamp(30%, 50%, 40%)' }}>
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
      <div className="absolute inset-0 rounded-[50%] bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-900 shadow-2xl border-4 sm:border-8 border-slate-800">
        {/* Table felt texture */}
        <div className="absolute inset-0 rounded-full bg-emerald-700 opacity-90" 
             style={{
               backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.15) 1px, transparent 0)',
               backgroundSize: '20px 20px'
             }}>
        </div>
        
        {/* Table center area */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 sm:w-2/5 h-4/5 sm:h-2/5 rounded-full bg-emerald-800 border-2 sm:border-4 border-slate-700 flex items-center justify-center">
          <div className="text-center p-1.5 sm:p-4">
            {allVoted && !isRevealed && onReveal ? (
              <button
                onClick={onReveal}
                className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold py-1.5 px-2 sm:py-3 sm:px-6 rounded-lg shadow-xl transform hover:scale-105 transition-all text-[10px] sm:text-sm touch-manipulation"
              >
                🎴 Reveal
              </button>
            ) : currentStory ? (
              <div className="text-white text-[9px] sm:text-xs font-semibold max-w-[90%] mx-auto px-0.5 sm:px-1 break-words line-clamp-2 sm:line-clamp-none">
                {currentStory}
              </div>
            ) : (
              <div className="text-emerald-200 text-[9px] sm:text-xs italic">
                Enter story above
              </div>
            )}
            {!isRevealed && users.length > 0 && !allVoted && (
              <div className="mt-0.5 sm:mt-2 text-emerald-200 text-[9px] sm:text-xs">
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
                ${isCurrentUser ? 'scale-100 sm:scale-110 z-10' : 'scale-90 sm:scale-100'}
              `}>
                {/* Status Card - Always shown above username */}
                <div className={`absolute left-1/2 transform -translate-x-1/2 -top-6 sm:-top-12 z-20`}>
                  {isRevealed ? (
                    // Revealed vote card - same size as status card
                    <div className={`
                      bg-gradient-to-br from-teal-500/90 via-cyan-500/90 to-teal-600/90 
                      w-6 sm:w-10 h-6 sm:h-14 rounded border-2 flex items-center justify-center shadow-xl
                      ${isCurrentUser 
                        ? 'border-teal-300 ring-1 sm:ring-2 ring-teal-400/50 ring-opacity-50' 
                        : 'border-teal-400/60 ring-1 ring-teal-300/30 ring-opacity-30'
                      }
                    `}>
                      <span className="text-white text-[9px] sm:text-base font-bold">
                        {user.vote !== null ? user.vote : '?'}
                      </span>
                    </div>
                  ) : (
                    // Status card (VOTED or Waiting...)
                    <div className={`
                      ${user.hasVoted 
                        ? 'bg-red-600 border-red-800' 
                        : 'bg-gray-600 border-gray-700'
                      }
                      w-6 sm:w-10 h-6 sm:h-14 rounded border-2 flex items-center justify-center shadow-xl
                      ${!user.hasVoted ? 'animate-pulse' : ''}
                    `}>
                      {user.hasVoted && (
                        <span className="text-white text-[6px] sm:text-xs font-bold">
                          VOTED
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Name Label - Below status card */}
                <div className="mt-0.5 sm:mt-2 whitespace-nowrap max-w-[60px] sm:max-w-none">
                  <div className={`
                    px-1.5 sm:px-3 py-0.5 sm:py-1.5 rounded text-[10px] sm:text-sm font-bold text-white shadow-lg truncate
                    ${isCurrentUser ? 'bg-gradient-to-r from-teal-600 to-cyan-600' : 'bg-gradient-to-r from-slate-700 to-slate-800'}
                  `}>
                    {user.name}
                    {isCurrentUser && <span className="ml-0.5 sm:ml-1 text-[8px] sm:text-sm hidden sm:inline">(You)</span>}
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {/* Empty seats indicator */}
        {users.length === 0 && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-emerald-200 text-center px-4">
            <p className="text-base sm:text-lg font-semibold">Waiting for players...</p>
            <p className="text-xs sm:text-sm mt-2">Share the room ID to invite teammates</p>
          </div>
        )}
      </div>
    </div>
  )
}
