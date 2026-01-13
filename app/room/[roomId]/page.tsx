'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { io, Socket } from 'socket.io-client'
import PokerCard from '@/components/PokerCard'
import PokerTable from '@/components/PokerTable'
import ResultsDisplay from '@/components/ResultsDisplay'
import RoomControls from '@/components/RoomControls'

interface User {
  id: string
  name: string
  vote: number | null
  hasVoted: boolean
}

interface RoomState {
  users: User[]
  isRevealed: boolean
  currentStory: string
}

export default function RoomPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const roomId = (params.roomId as string)?.toUpperCase() || ''
  const username = searchParams.get('username') || 'Anonymous'
  
  const [socket, setSocket] = useState<Socket | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [isRevealed, setIsRevealed] = useState(false)
  const [currentStory, setCurrentStory] = useState('')
  const [myVote, setMyVote] = useState<number | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [hasShownConfetti, setHasShownConfetti] = useState(false)
  const [showCopied, setShowCopied] = useState(false)
  const socketRef = useRef<Socket | null>(null)

  const handleShareGame = async () => {
    const shareUrl = `${window.location.origin}/?room=${roomId}`
    try {
      await navigator.clipboard.writeText(shareUrl)
      setShowCopied(true)
      setTimeout(() => setShowCopied(false), 2000)
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = shareUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setShowCopied(true)
      setTimeout(() => setShowCopied(false), 2000)
    }
  }

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || window.location.origin, {
      transports: ['websocket', 'polling'],
    })

    socketInstance.on('connect', () => {
      setIsConnected(true)
      socketInstance.emit('join-room', { roomId, username })
    })

    socketInstance.on('disconnect', () => {
      setIsConnected(false)
    })

    socketInstance.on('room-state', (state: RoomState) => {
      setUsers(state.users)
      setIsRevealed(state.isRevealed)
      setCurrentStory(state.currentStory || '')
      
      // Find my vote
      const myUser = state.users.find(u => u.name === username)
      setMyVote(myUser?.vote || null)
    })

    socketInstance.on('user-joined', (user: User) => {
      setUsers(prev => {
        const exists = prev.find(u => u.id === user.id)
        if (exists) return prev
        return [...prev, user]
      })
    })

    socketInstance.on('user-left', (userId: string) => {
      setUsers(prev => prev.filter(u => u.id !== userId))
    })

    socketInstance.on('vote-received', (data: { userId: string; vote: number | null; hasVoted: boolean }) => {
      setUsers(prev => prev.map(u => 
        u.id === data.userId ? { ...u, vote: data.vote, hasVoted: data.hasVoted } : u
      ))
    })


    socketInstance.on('votes-reset', () => {
      setIsRevealed(false)
      setMyVote(null)
      setHasShownConfetti(false) // Reset confetti flag when votes are reset
      setUsers(prev => prev.map(u => ({ ...u, vote: null, hasVoted: false })))
    })
    
    socketInstance.on('votes-revealed', () => {
      setIsRevealed(true)
      // Reset confetti flag so it can trigger again if all votes match
      setHasShownConfetti(false)
    })

    socketInstance.on('story-updated', (story: string) => {
      setCurrentStory(story)
    })

    setSocket(socketInstance)
    socketRef.current = socketInstance

    return () => {
      socketInstance.disconnect()
    }
  }, [roomId, username])

  const handleVote = (value: number) => {
    if (socket && !isRevealed) {
      socket.emit('vote', { roomId, value })
      setMyVote(value)
    }
  }

  const handleReveal = () => {
    if (socket) {
      socket.emit('reveal-votes', { roomId })
    }
  }

  const handleReset = () => {
    if (socket) {
      socket.emit('reset-votes', { roomId })
    }
  }

  const handleUpdateStory = (story: string) => {
    if (socket) {
      socket.emit('update-story', { roomId, story })
    }
  }

  const fibonacciSequence = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, '?', '☕']

  const allVoted = users.length > 0 && users.every(u => u.hasVoted)
  
  // Check if all votes are the same (for confetti)
  const allVotesSame = isRevealed && users.length > 1 && users.every(u => u.hasVoted && u.vote !== null) && 
    users.filter(u => u.vote !== null).every((u, _, arr) => u.vote === arr[0].vote)
  
  // Trigger confetti once when all votes match
  useEffect(() => {
    if (allVotesSame && !hasShownConfetti) {
      setHasShownConfetti(true)
      // Reset after animation completes
      setTimeout(() => {
        // Keep the flag true so it doesn't retrigger
      }, 3000)
    }
  }, [allVotesSame, hasShownConfetti])

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-900 p-2 sm:p-3">
      <div className="max-w-7xl mx-auto">
        {/* Header - Compact */}
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-lg shadow-2xl p-2 sm:p-3 mb-2 sm:mb-3 border-2 border-teal-500/50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-teal-200 truncate">🎯 Basil Planning Poker</h1>
              <p className="text-xs text-teal-300 mt-0.5 truncate">
                Room: <span className="font-mono font-semibold text-cyan-300">{roomId}</span>
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <button
                onClick={handleShareGame}
                className="relative px-2 sm:px-3 py-1.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white text-xs font-semibold rounded-lg transition-all transform hover:scale-105 shadow-md flex items-center gap-1 touch-manipulation"
              >
                <span>🔗</span>
                <span className="hidden sm:inline">Share Game</span>
                {showCopied && (
                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50">
                    Link Copied!
                  </span>
                )}
              </button>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-500'}`}></div>
                <span className="text-xs text-teal-200 font-semibold truncate max-w-[80px] sm:max-w-none">{username}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Poker Table */}
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-lg shadow-2xl p-2 sm:p-4 mb-2 sm:mb-3 border-2 border-teal-500/50">
          <PokerTable 
            users={users} 
            isRevealed={isRevealed} 
            currentUser={username}
            currentStory={currentStory}
            onReveal={handleReveal}
            onReset={handleReset}
            allVoted={allVoted}
            showConfetti={allVotesSame}
          />
        </div>

        {/* Celebration Message - Compact */}
        {allVotesSame && (
          <div className="mb-2 sm:mb-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-400/50 rounded-lg p-2 sm:p-3 text-center animate-pulse">
            <div className="text-xl sm:text-2xl mb-1">🎉</div>
            <h3 className="text-base sm:text-lg font-bold text-yellow-300 mb-1">Perfect Consensus!</h3>
            <p className="text-yellow-200 text-xs sm:text-sm">
              Everyone voted <span className="font-bold text-lg sm:text-xl text-yellow-100">
                {users.find(u => u.vote !== null)?.vote}
              </span>
            </p>
          </div>
        )}

        {/* Results Display - Compact */}
        {isRevealed && (
          <div className="mb-3">
            <ResultsDisplay users={users} />
          </div>
        )}

        {/* Voting Cards at Bottom - Compact */}
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-lg shadow-2xl p-2 sm:p-4 mb-2 sm:mb-3 border-2 border-teal-500/50">
          <h2 className="text-base sm:text-lg font-semibold text-teal-200 mb-2 sm:mb-3 text-center">
            {isRevealed ? '🎴 Votes Revealed' : '🎴 Select Your Estimate'}
          </h2>
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 max-w-4xl mx-auto overflow-x-auto pb-2">
            {fibonacciSequence.map((value, index) => (
              <PokerCard
                key={index}
                value={value}
                onClick={() => typeof value === 'number' && handleVote(value)}
                isSelected={myVote === value}
                disabled={isRevealed || typeof value !== 'number'}
              />
            ))}
          </div>
        </div>

        {/* Controls */}
        <RoomControls
          onReveal={handleReveal}
          onReset={handleReset}
          isRevealed={isRevealed}
          hasVotes={users.some(u => u.hasVoted)}
        />
      </div>
    </div>
  )
}
