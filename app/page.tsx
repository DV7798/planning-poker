'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [roomId, setRoomId] = useState('')
  const [username, setUsername] = useState('')
  const router = useRouter()

  const handleCreateRoom = () => {
    if (!username.trim()) {
      alert('Please enter your name')
      return
    }
    const newRoomId = Math.random().toString(36).substring(2, 9)
    router.push(`/room/${newRoomId}?username=${encodeURIComponent(username)}`)
  }

  const handleJoinRoom = () => {
    if (!username.trim() || !roomId.trim()) {
      alert('Please enter your name and room ID')
      return
    }
    router.push(`/room/${roomId}?username=${encodeURIComponent(username)}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 flex items-center justify-center p-4">
      <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md border-2 border-indigo-500/50">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-200 mb-2">🎯 Planning Poker</h1>
          <p className="text-indigo-300">Estimate user stories together in real-time</p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-indigo-200 mb-2">
              Your Name
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border-2 border-indigo-500/50 rounded-lg bg-slate-700/50 text-indigo-100 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none placeholder-indigo-400"
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
            <label htmlFor="roomId" className="block text-sm font-medium text-indigo-200 mb-2">
              Room ID (optional)
            </label>
            <input
              id="roomId"
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              placeholder="Enter room ID to join"
              className="w-full px-4 py-3 border-2 border-indigo-500/50 rounded-lg bg-slate-700/50 text-indigo-100 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none placeholder-indigo-400"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && username) {
                  handleJoinRoom()
                }
              }}
            />
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <button
              onClick={handleCreateRoom}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Create New Room
            </button>
            {roomId && (
              <button
                onClick={handleJoinRoom}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Join Room
              </button>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-indigo-500/30">
          <p className="text-xs text-indigo-300 text-center">
            Planning Poker helps teams estimate story points using the Fibonacci sequence
          </p>
        </div>
      </div>
    </div>
  )
}
