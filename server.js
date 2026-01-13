const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { Server } = require('socket.io')

const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.HOSTNAME || '0.0.0.0'
const port = process.env.PORT || 3000

const app = next({ dev, hostname, port: parseInt(port) })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })

  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  })

  // Store room data
  const rooms = new Map()

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)

    socket.on('join-room', ({ roomId, username }) => {
      // Normalize room ID to uppercase
      const normalizedRoomId = roomId.toUpperCase()
      socket.join(normalizedRoomId)
      
      if (!rooms.has(normalizedRoomId)) {
        rooms.set(normalizedRoomId, {
          users: [],
          isRevealed: false,
          currentStory: '',
        })
      }

      const room = rooms.get(normalizedRoomId)
      const existingUser = room.users.find(u => u.id === socket.id)
      
      if (!existingUser) {
        const newUser = {
          id: socket.id,
          name: username,
          vote: null,
          hasVoted: false,
        }
        room.users.push(newUser)
      }

      // Send current room state to the user
      socket.emit('room-state', room)

      // Notify others in the room
      socket.to(roomId).emit('user-joined', {
        id: socket.id,
        name: username,
        vote: null,
        hasVoted: false,
      })

      // Broadcast updated user list to all in room
      io.to(normalizedRoomId).emit('room-state', room)

      console.log(`${username} joined room ${normalizedRoomId}`)
    })

    socket.on('vote', ({ roomId, value }) => {
      const normalizedRoomId = roomId.toUpperCase()
      const room = rooms.get(normalizedRoomId)
      if (!room) return

      const user = room.users.find(u => u.id === socket.id)
      if (user) {
        user.vote = value
        user.hasVoted = true
      }

      // Broadcast vote status to room (but don't reveal value if not revealed)
      socket.to(normalizedRoomId).emit('vote-received', {
        userId: socket.id,
        vote: room.isRevealed ? value : null,
        hasVoted: true,
      })

      // Broadcast updated state to all (with vote hidden if not revealed, but hasVoted visible)
      const stateToSend = {
        ...room,
        users: room.users.map(u => ({
          ...u,
          vote: room.isRevealed ? u.vote : (u.id === socket.id ? u.vote : null),
          // hasVoted should be visible to everyone
        })),
      }
      io.to(normalizedRoomId).emit('room-state', stateToSend)
    })

    socket.on('reveal-votes', ({ roomId }) => {
      const normalizedRoomId = roomId.toUpperCase()
      const room = rooms.get(normalizedRoomId)
      if (!room) return

      room.isRevealed = true
      io.to(normalizedRoomId).emit('votes-revealed')
      io.to(normalizedRoomId).emit('room-state', room)
    })

    socket.on('reset-votes', ({ roomId }) => {
      const normalizedRoomId = roomId.toUpperCase()
      const room = rooms.get(normalizedRoomId)
      if (!room) return

      room.isRevealed = false
      room.users.forEach(user => {
        user.vote = null
        user.hasVoted = false
      })

      io.to(normalizedRoomId).emit('votes-reset')
      io.to(normalizedRoomId).emit('room-state', room)
    })

    socket.on('update-story', ({ roomId, story }) => {
      const normalizedRoomId = roomId.toUpperCase()
      const room = rooms.get(normalizedRoomId)
      if (!room) return

      room.currentStory = story
      io.to(normalizedRoomId).emit('story-updated', story)
      io.to(normalizedRoomId).emit('room-state', room)
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)

      // Remove user from all rooms
      rooms.forEach((room, normalizedRoomId) => {
        const userIndex = room.users.findIndex(u => u.id === socket.id)
        if (userIndex !== -1) {
          room.users.splice(userIndex, 1)
          socket.to(normalizedRoomId).emit('user-left', socket.id)
          io.to(normalizedRoomId).emit('room-state', room)
        }
      })
    })
  })

  httpServer
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
    })
})
