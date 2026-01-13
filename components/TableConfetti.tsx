'use client'

import { useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'

interface TableConfettiProps {
  trigger: boolean
  containerId: string
}

export default function TableConfetti({ trigger, containerId }: TableConfettiProps) {
  const hasTriggered = useRef(false)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (trigger && !hasTriggered.current) {
      hasTriggered.current = true
      
      const container = document.getElementById(containerId)
      if (!container) return

      // Create canvas for confetti
      const canvas = document.createElement('canvas')
      canvas.style.position = 'absolute'
      canvas.style.top = '0'
      canvas.style.left = '0'
      canvas.style.width = '100%'
      canvas.style.height = '100%'
      canvas.style.pointerEvents = 'none'
      canvas.style.zIndex = '1000'
      container.appendChild(canvas)
      canvasRef.current = canvas

      const updateCanvasSize = () => {
        const rect = container.getBoundingClientRect()
        canvas.width = rect.width
        canvas.height = rect.height
      }
      
      updateCanvasSize()
      window.addEventListener('resize', updateCanvasSize)

      const confettiInstance = confetti.create(canvas, { resize: true })

      const duration = 3000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 }

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min
      }

      intervalRef.current = setInterval(function() {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
          return
        }

        const particleCount = 50 * (timeLeft / duration)
        
        // Launch confetti from center of table
        confettiInstance({
          ...defaults,
          particleCount,
          origin: { x: 0.5, y: 0.5 }
        })
        // Also from edges
        confettiInstance({
          ...defaults,
          particleCount: particleCount / 2,
          origin: { x: randomInRange(0.2, 0.8), y: randomInRange(0.2, 0.8) }
        })
      }, 200)

      // Cleanup
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
        window.removeEventListener('resize', updateCanvasSize)
        if (canvas && canvas.parentNode) {
          canvas.parentNode.removeChild(canvas)
        }
      }
    }
    
    // Reset when trigger becomes false
    if (!trigger) {
      hasTriggered.current = false
    }
  }, [trigger, containerId])

  return null
}
