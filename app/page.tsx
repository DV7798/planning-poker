'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function HomeContent() {
  const searchParams = useSearchParams()
  const [roomId, setRoomId] = useState('')
  const [username, setUsername] = useState('')
  const router = useRouter()

  // Check if room ID is in URL (from share link)
  useEffect(() => {
    const urlRoomId = searchParams.get('room')
    if (urlRoomId) {
      setRoomId(urlRoomId.toUpperCase())
    }
  }, [searchParams])

  const handleCreateRoom = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    console.log('Create room clicked, username:', username)
    if (!username.trim()) {
      alert('Please enter your name')
      return
    }
    const newRoomId = Math.random().toString(36).substring(2, 9).toUpperCase()
    console.log('Navigating to room:', newRoomId)
    const url = `/room/${newRoomId}?username=${encodeURIComponent(username)}`
    console.log('URL:', url)
    
    // Try router.push first, fallback to window.location if it fails
    try {
      router.push(url)
    } catch (err) {
      console.error('Router push failed, using window.location:', err)
      window.location.href = url
    }
  }

  const handleJoinRoom = () => {
    if (!username.trim() || !roomId.trim()) {
      alert('Please enter your name and room ID')
      return
    }
    router.push(`/room/${roomId.toUpperCase()}?username=${encodeURIComponent(username)}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-900 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-8 w-full max-w-md border-2 border-teal-500/50">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-teal-200 mb-2">🎯 Basil Planning Poker</h1>
          <p className="text-sm sm:text-base text-teal-300">Estimate user stories together in real-time</p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-teal-200 mb-2">
              Your Name
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-teal-500/50 rounded-lg bg-slate-700/50 text-teal-100 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none placeholder-teal-400"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && roomId) {
                  handleJoinRoom()
                } else if (e.key === 'Enter') {
                  handleCreateRoom()
                }
              }}
            />
          </div>

          <div>
            <label htmlFor="roomId" className="block text-sm font-medium text-teal-200 mb-2">
              Room ID {roomId && '(from link)'}
            </label>
            <input
              id="roomId"
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              placeholder="Enter room ID to join"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-teal-500/50 rounded-lg bg-slate-700/50 text-teal-100 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none placeholder-teal-400"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && username) {
                  handleJoinRoom()
                }
              }}
            />
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleCreateRoom(e)
              }}
              type="button"
              className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-semibold py-3 sm:py-3.5 px-4 text-sm sm:text-base rounded-lg transition-all transform hover:scale-105 shadow-lg touch-manipulation cursor-pointer active:scale-95"
            >
              Create New Room
            </button>
            {roomId && (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleJoinRoom()
                }}
                type="button"
                className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Join Room
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-teal-500/30">
          <p className="text-xs text-teal-300 text-center px-2">
            Planning Poker helps teams estimate story points using the Fibonacci sequence
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md border-2 border-teal-500/50">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-teal-200 mb-2">🎯 Basil Planning Poker</h1>
            <p className="text-teal-300">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  )
}
