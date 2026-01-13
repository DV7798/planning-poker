interface User {
  id: string
  name: string
  vote: number | null
  hasVoted: boolean
}

interface PlayerSeatProps {
  user: User
  isCurrentUser: boolean
  isRevealed: boolean
  position: { top: string; left: string; transform: string }
}

export default function PlayerSeat({ user, isCurrentUser, isRevealed, position }: PlayerSeatProps) {
  return (
    <div
      className="absolute"
      style={position}
    >
      <div className={`
        relative transform transition-all duration-300
        ${isCurrentUser ? 'scale-110 z-10' : 'scale-100'}
      `}>
        {/* Player Chip/Seat */}
        <div className={`
          w-20 h-20 rounded-full border-4 flex flex-col items-center justify-center
          ${isCurrentUser 
            ? 'bg-amber-600 border-amber-400 shadow-lg ring-4 ring-amber-300' 
            : 'bg-amber-700 border-amber-600 shadow-md'
          }
        `}>
          {/* Avatar */}
          <div className={`
            w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg
            ${isCurrentUser ? 'bg-blue-600' : 'bg-blue-700'}
          `}>
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>
        
        {/* Name Label */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <div className={`
            px-3 py-1 rounded-full text-xs font-semibold text-white
            ${isCurrentUser ? 'bg-blue-600' : 'bg-gray-800'}
          `}>
            {user.name}
            {isCurrentUser && ' (You)'}
          </div>
        </div>

        {/* Vote Card Display */}
        {user.hasVoted && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
            {isRevealed ? (
              <div className="bg-white w-12 h-16 rounded border-2 border-gray-800 flex items-center justify-center shadow-xl transform rotate-0 hover:rotate-3 transition-transform">
                <span className="text-2xl font-bold text-gray-800">
                  {user.vote !== null ? user.vote : '?'}
                </span>
              </div>
            ) : (
              <div className="bg-red-600 w-12 h-16 rounded border-2 border-red-800 flex items-center justify-center shadow-xl">
                <div className="text-white text-xs font-bold text-center leading-tight">
                  VOTED
                </div>
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
}
