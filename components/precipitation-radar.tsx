"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, SkipBack, SkipForward } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface PrecipitationRadarProps {
  location: string
}

export function PrecipitationRadar({ location }: PrecipitationRadarProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentFrame, setCurrentFrame] = useState(0)
  const totalFrames = 6

  // Simulate radar frames with timestamps
  const frames = Array.from({ length: totalFrames }, (_, i) => {
    const date = new Date()
    date.setMinutes(date.getMinutes() - (totalFrames - i - 1) * 10)
    return {
      id: i,
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
  })

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % totalFrames)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handlePrev = () => {
    setCurrentFrame((prev) => (prev - 1 + totalFrames) % totalFrames)
    if (isPlaying) setIsPlaying(false)
  }

  const handleNext = () => {
    setCurrentFrame((prev) => (prev + 1) % totalFrames)
    if (isPlaying) setIsPlaying(false)
  }

  return (
    <Card className="border-none bg-blue-900/50 text-white shadow-none">
      <CardHeader className="p-4 pb-0">
        <motion.h2
          className="text-lg font-semibold"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Precipitation Radar
        </motion.h2>
      </CardHeader>
      <CardContent className="p-4">
        <div className="relative h-48 w-full overflow-hidden rounded-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFrame}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center bg-blue-800/50"
            >
              <div className="text-center">
                <p className="mb-2">Radar for {location}</p>
                <p className="text-sm text-white/60">{frames[currentFrame].time}</p>
              </div>

              {/* This would be a real radar image in a production app */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-500/20" />

              {/* Simulated precipitation patterns */}
              {Array.from({ length: 5 }).map((_, i) => {
                const size = 20 + i * 15
                const opacity = 0.1 + i * 0.1
                const delay = i * 0.1

                return (
                  <motion.div
                    key={i}
                    className="absolute rounded-full bg-blue-500"
                    style={{
                      width: size,
                      height: size,
                      left: `${30 + (currentFrame * 5) + i * 3}%`,
                      top: `${40 + i * 2}%`,
                      opacity,
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay }}
                  />
                )
              })}
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-2 left-0 right-0 flex justify-center">
            <div className="flex items-center space-x-2 rounded-full bg-black/50 px-3 py-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white" onClick={handlePrev}>
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white" onClick={handlePlayPause}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white" onClick={handleNext}>
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-3 flex justify-between">
          {frames.map((frame, index) => (
            <motion.button
              key={frame.id}
              className={`h-1 flex-1 mx-0.5 rounded-full ${index === currentFrame ? "bg-white" : "bg-white/30"}`}
              whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
              onClick={() => {
                setCurrentFrame(index)
                if (isPlaying) setIsPlaying(false)
              }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

