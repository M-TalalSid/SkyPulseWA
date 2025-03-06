"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { CurrentWeatherData } from "@/types/weather"
import { motion } from "framer-motion"

interface SunriseSunsetProps {
  data: CurrentWeatherData
}

export function SunriseSunset({ data }: SunriseSunsetProps) {
  // Convert 12-hour time format to 24-hour for calculations
  const convertTo24Hour = (time12h: string) => {
    const [time, modifier] = time12h.split(" ")
    let [hours, minutes] = time.split(":")

    if (hours === "12") {
      hours = "00"
    }

    if (modifier === "PM") {
      hours = (Number.parseInt(hours, 10) + 12).toString()
    }

    return `${hours}:${minutes}`
  }

  // Calculate daylight duration in hours
  const calculateDaylightHours = () => {
    try {
      const sunrise24 = convertTo24Hour(data.sunrise)
      const sunset24 = convertTo24Hour(data.sunset)

      const [sunriseHours, sunriseMinutes] = sunrise24.split(":").map(Number)
      const [sunsetHours, sunsetMinutes] = sunset24.split(":").map(Number)

      const sunriseMinutesTotal = sunriseHours * 60 + sunriseMinutes
      const sunsetMinutesTotal = sunsetHours * 60 + sunsetMinutes

      const daylightMinutes = sunsetMinutesTotal - sunriseMinutesTotal
      const hours = Math.floor(daylightMinutes / 60)
      const minutes = daylightMinutes % 60

      return `${hours} hrs ${minutes} mins`
    } catch (e) {
      return "11 hrs 44 mins" // Fallback
    }
  }

  return (
    <Card className="border-none bg-blue-900/50 text-white shadow-none">
      <CardContent className="p-4">
        <motion.h2
          className="mb-4 text-lg font-semibold"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Sun
        </motion.h2>
        <div className="flex flex-col">
          <div className="relative h-32 w-full">
            <motion.div
              className="absolute left-0 right-0 top-1/2 h-0.5 bg-white/20"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            ></motion.div>
            <div className="absolute left-1/4 right-1/4 top-0 h-full">
              <div className="relative h-full w-full">
                <motion.div
                  className="absolute left-0 top-0 h-16 w-16 rounded-full border-2 border-white/20"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                ></motion.div>
                <motion.div
                  className="absolute right-0 top-0 h-16 w-16 rounded-full border-2 border-white/20"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                ></motion.div>
                <motion.div
                  className="absolute top-0 h-16 w-full"
                  style={{
                    clipPath: "ellipse(50% 50% at 50% 50%)",
                    background: "linear-gradient(180deg, transparent 0%, #f97316 100%)",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                ></motion.div>
              </div>
            </div>
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="text-sm">{calculateDaylightHours()}</div>
            </motion.div>
          </div>
          <div className="mt-4 flex justify-between">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <div className="text-xs text-white/60">AM</div>
              <div className="text-lg font-bold">{data.sunrise}</div>
              <div className="text-xs text-white/60">Sunrise</div>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <div className="text-xs text-white/60">PM</div>
              <div className="text-lg font-bold">{data.sunset}</div>
              <div className="text-xs text-white/60">Sunset</div>
            </motion.div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

