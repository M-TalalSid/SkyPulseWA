"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Sun } from "lucide-react"
import Image from "next/image"
import type { DailyWeatherData } from "@/types/weather"
import { useTemperature } from "@/hooks/use-temperature"
import { motion } from "framer-motion"

interface DailyForecastProps {
  data: DailyWeatherData[]
}

export function DailyForecast({ data }: DailyForecastProps) {
  const { formatTemperature } = useTemperature()

  const getDayName = (dateStr: Date | string) => {
    // Ensure we're working with a valid date
    try {
      // If dateStr is already a Date object, use it directly
      const date = dateStr instanceof Date ? dateStr : new Date(dateStr)
      return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date)
    } catch (error) {
      console.error("Invalid date:", dateStr)
      return "N/A"
    }
  }

  return (
    <Card className="border-none bg-blue-900/50 text-white shadow-none">
      <CardContent className="p-4">
        <h2 className="mb-4 text-lg font-semibold">7-Day Forecast</h2>
        <div className="flex flex-col gap-2">
          {data.map((day, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-between"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="w-16 text-sm">{index === 0 ? "Today" : getDayName(day.date)}</div>
              <div className="flex items-center">
                {day.icon ? (
                  <Image src={`https:${day.icon}`} alt={day.condition} width={24} height={24} />
                ) : (
                  <Sun className="h-5 w-5 text-yellow-400" />
                )}
              </div>
              <div className="flex w-24 justify-between">
                <span className="font-bold">
                  {formatTemperature(day.highTemp).replace("°C", "").replace("°F", "")}°
                </span>
                <span className="text-white/60">
                  {formatTemperature(day.lowTemp).replace("°C", "").replace("°F", "")}°
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

