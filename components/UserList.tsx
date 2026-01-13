interface User {
  id: string
  name: string
  vote: number | null
  hasVoted: boolean
}

interface UserListProps {
  users: User[]
  isRevealed: boolean
  currentUser: string
}

export default function UserList({ users, isRevealed, currentUser }: UserListProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Participants ({users.length})
      </h2>
      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user.id}
            className={`
              flex items-center justify-between p-3 rounded-lg
              ${user.name === currentUser ? 'bg-primary-50 border-2 border-primary-300' : 'bg-gray-50'}
            `}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium text-gray-800">
                {user.name}
                {user.name === currentUser && (
                  <span className="text-xs text-primary-600 ml-1">(You)</span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {user.hasVoted ? (
                isRevealed ? (
                  <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full font-semibold text-sm">
                    {user.vote !== null ? user.vote : '?'}
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold flex items-center gap-1">
                    <span className="text-green-600">✓</span> Voted
                  </span>
                )
              ) : (
                <span className="px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-xs flex items-center gap-1">
                  <span className="animate-pulse">⏳</span> Waiting...
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
