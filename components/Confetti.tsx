'use client'

import { useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'

interface ConfettiProps {
  trigger: boolean
}

export default function Confetti({ trigger }: ConfettiProps) {
  const hasTriggered = useRef(false)

  useEffect(() => {
    if (trigger && !hasTriggered.current) {
      hasTriggered.current = true
      
      const duration = 3000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min
      }

      const interval: NodeJS.Timeout = setInterval(function() {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)
        
        // Launch confetti from different positions
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        })
      }, 250)

      // Cleanup
      return () => clearInterval(interval)
    }
    
    // Reset when trigger becomes false
    if (!trigger) {
      hasTriggered.current = false
    }
  }, [trigger])

  return null
}
