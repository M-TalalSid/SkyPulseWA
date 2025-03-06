"use client"

import { ArrowUp } from "lucide-react"
import { motion } from "framer-motion"

interface WindDirectionProps {
  direction: string
  speed: number
}

export function WindDirection({ direction, speed }: WindDirectionProps) {
  // Convert wind direction to degrees
  const getWindDirectionDegrees = (dir: string): number => {
    const directions: Record<string, number> = {
      N: 0,
      NNE: 22.5,
      NE: 45,
      ENE: 67.5,
      E: 90,
      ESE: 112.5,
      SE: 135,
      SSE: 157.5,
      S: 180,
      SSW: 202.5,
      SW: 225,
      WSW: 247.5,
      W: 270,
      WNW: 292.5,
      NW: 315,
      NNW: 337.5,
    }

    return directions[dir] || 0
  }

  const degrees = getWindDirectionDegrees(direction)

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-16 w-16 rounded-full border-2 border-white/20 flex items-center justify-center">
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: degrees }}
          transition={{ duration: 1, type: "spring", damping: 15 }}
          className="absolute"
        >
          <ArrowUp className="h-5 w-5 text-white" />
        </motion.div>
        <div className="absolute text-xs font-medium">{speed} km/h</div>
      </div>
      <div className="mt-2 text-sm text-white/80">{direction}</div>
    </div>
  )
}

