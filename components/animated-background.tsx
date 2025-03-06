"use client"

import type React from "react"
import { useEffect, useState, useRef, memo } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Cloud, CloudRain, Sun, Moon, Snowflake } from "lucide-react"
import { useTheme } from "next-themes"

interface AnimatedBackgroundProps {
  weatherCondition?: string
  isNight?: boolean
}

function AnimatedBackgroundComponent({ weatherCondition = "clear", isNight = false }: AnimatedBackgroundProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [elements, setElements] = useState<React.ReactNode[]>([])
  const prefersReducedMotion = useReducedMotion()
  const requestRef = useRef<number | null>(null)
  const previousTimeRef = useRef<number | null>(null)

  // Wait for client-side hydration
  useEffect(() => {
    setMounted(true)

    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [])

  // Generate background elements based on weather condition
  useEffect(() => {
    if (!mounted || prefersReducedMotion) return

    const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
    const condition = weatherCondition.toLowerCase()

    // Reduce number of elements based on device performance
    const isMobile = window.innerWidth < 768
    const isLowPowerMode =
      "connection" in navigator &&
      ((navigator as any).connection?.saveData || (navigator as any).connection?.effectiveType === "2g")

    // Adjust number of elements based on device capabilities
    let numElements = 15 // Default
    if (isLowPowerMode) {
      numElements = 3
    } else if (isMobile) {
      numElements = 6
    }

    const newElements: React.ReactNode[] = []

    for (let i = 0; i < numElements; i++) {
      const size = Math.random() * 30 + 10 // 10-40px
      const left = Math.random() * 100 // 0-100%
      const top = Math.random() * 100 // 0-100%
      const duration = Math.random() * 60 + 60 // 60-120s
      const delay = Math.random() * 10 // 0-10s
      const opacity = Math.random() * 0.3 + 0.1 // 0.1-0.4

      let element

      if (condition.includes("rain") || condition.includes("drizzle")) {
        element = (
          <motion.div
            key={`rain-${i}`}
            className="absolute"
            style={{ left: `${left}%`, top: `${top}%` }}
            initial={{ opacity: 0, y: -20 }}
            animate={{
              opacity,
              y: window.innerHeight,
              transition: {
                duration: duration / 4,
                delay,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              },
            }}
          >
            <CloudRain className="text-blue-300" style={{ width: size, height: size }} />
          </motion.div>
        )
      } else if (condition.includes("snow")) {
        element = (
          <motion.div
            key={`snow-${i}`}
            className="absolute"
            style={{ left: `${left}%`, top: `${top}%` }}
            initial={{ opacity: 0, y: -20 }}
            animate={{
              opacity,
              y: window.innerHeight,
              x: [0, 20, -20, 0],
              transition: {
                y: { duration: duration / 2, delay, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                x: { duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
              },
            }}
          >
            <Snowflake className="text-blue-100" style={{ width: size, height: size }} />
          </motion.div>
        )
      } else if (condition.includes("cloud")) {
        element = (
          <motion.div
            key={`cloud-${i}`}
            className="absolute"
            style={{ left: `${left}%`, top: `${top}%` }}
            initial={{ opacity: 0, x: -100 }}
            animate={{
              opacity,
              x: window.innerWidth + 100,
              transition: {
                duration,
                delay,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              },
            }}
          >
            <Cloud className={isDark ? "text-gray-700" : "text-white"} style={{ width: size * 2, height: size }} />
          </motion.div>
        )
      } else {
        // Clear sky - sun or moon
        if (isNight) {
          element = (
            <motion.div
              key={`star-${i}`}
              className="absolute"
              style={{ left: `${left}%`, top: `${top}%` }}
              animate={{
                opacity: [opacity, opacity * 2, opacity],
                scale: [1, 1.2, 1],
                transition: {
                  duration: 3,
                  delay,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                },
              }}
            >
              <div className="bg-white rounded-full" style={{ width: size / 5, height: size / 5 }} />
            </motion.div>
          )
        } else {
          // During day, add some subtle sun rays
          if (i === 0) {
            element = (
              <motion.div
                key="sun"
                className="absolute"
                style={{ left: `${Math.random() * 30 + 60}%`, top: `${Math.random() * 20 + 10}%` }}
                animate={{
                  rotate: 360,
                  transition: {
                    duration: 120,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  },
                }}
              >
                <div className="relative">
                  <Sun className="text-yellow-400" style={{ width: 60, height: 60 }} />
                  <motion.div
                    className="absolute inset-0 rounded-full bg-yellow-400"
                    animate={{
                      opacity: [0.2, 0.4, 0.2],
                      scale: [1, 1.2, 1],
                      transition: { duration: 5, repeat: Number.POSITIVE_INFINITY },
                    }}
                  />
                </div>
              </motion.div>
            )
          } else {
            element = (
              <motion.div
                key={`cloud-day-${i}`}
                className="absolute"
                style={{ left: `${left}%`, top: `${top}%` }}
                initial={{ opacity: 0, x: -100 }}
                animate={{
                  opacity: opacity / 2,
                  x: window.innerWidth + 100,
                  transition: {
                    duration,
                    delay,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  },
                }}
              >
                <Cloud className="text-white" style={{ width: size * 2, height: size }} />
              </motion.div>
            )
          }
        }
      }

      newElements.push(element)
    }

    // Add a moon for night scenes
    if (isNight) {
      newElements.push(
        <motion.div
          key="moon"
          className="absolute"
          style={{ left: `${Math.random() * 30 + 60}%`, top: `${Math.random() * 20 + 10}%` }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 0.7,
            transition: { duration: 2 },
          }}
        >
          <Moon className="text-gray-200" style={{ width: 50, height: 50 }} />
        </motion.div>,
      )
    }

    setElements(newElements)
  }, [mounted, weatherCondition, isNight, theme, prefersReducedMotion])

  if (!mounted || prefersReducedMotion) return null

  return <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">{elements}</div>
}

// Memoize the component to prevent unnecessary re-renders
export const AnimatedBackground = memo(AnimatedBackgroundComponent)

export default AnimatedBackground

