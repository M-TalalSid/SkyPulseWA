"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"

interface GradientBackgroundProps {
  weatherCondition?: string
  isNight?: boolean
}

export function GradientBackground({ weatherCondition = "clear", isNight = false }: GradientBackgroundProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [gradientStyle, setGradientStyle] = useState<React.CSSProperties>({})

  // Wait for client-side hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Set gradient based on weather condition and time
  useEffect(() => {
    if (!mounted) return

    const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
    const condition = weatherCondition.toLowerCase()

    let gradient: React.CSSProperties = {}

    if (isDark || isNight) {
      // Night themes
      if (condition.includes("rain") || condition.includes("drizzle")) {
        gradient = {
          backgroundImage: "linear-gradient(to bottom, #1e3a8a, #1e293b)",
        }
      } else if (condition.includes("snow")) {
        gradient = {
          backgroundImage: "linear-gradient(to bottom, #1e293b, #312e81)",
        }
      } else if (condition.includes("cloud")) {
        gradient = {
          backgroundImage: "linear-gradient(to bottom, #1e293b, #0f172a)",
        }
      } else {
        // Clear night
        gradient = {
          backgroundImage: "linear-gradient(to bottom, #0f172a, #020617)",
        }
      }
    } else {
      // Day themes
      if (condition.includes("rain") || condition.includes("drizzle")) {
        gradient = {
          backgroundImage: "linear-gradient(to bottom, #1e40af, #3b82f6)",
        }
      } else if (condition.includes("snow")) {
        gradient = {
          backgroundImage: "linear-gradient(to bottom, #60a5fa, #93c5fd)",
        }
      } else if (condition.includes("cloud")) {
        gradient = {
          backgroundImage: "linear-gradient(to bottom, #3b82f6, #60a5fa)",
        }
      } else {
        // Clear day
        gradient = {
          backgroundImage: "linear-gradient(to bottom, #2563eb, #3b82f6)",
        }
      }
    }

    setGradientStyle(gradient)
  }, [mounted, weatherCondition, isNight, theme])

  if (!mounted) return null

  return (
    <motion.div
      className="fixed inset-0 z-0"
      style={gradientStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    />
  )
}

