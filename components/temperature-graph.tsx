"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { HourlyWeatherData } from "@/types/weather"
import { Sun, CloudSun, Cloud, Moon } from "lucide-react"
import Image from "next/image"
import { useTemperature } from "@/hooks/use-temperature"
import { motion } from "framer-motion"

interface TemperatureGraphProps {
  data: HourlyWeatherData[]
}

export function TemperatureGraph({ data }: TemperatureGraphProps) {
  const { formatTemperature, convertToPreferredUnit } = useTemperature()

  // Get the next 12 hours of data
  const hours = data.slice(0, 12)

  const getWeatherIcon = (condition: string, hour: number) => {
    const isNight = hour < 6 || hour > 18

    switch (condition.toLowerCase()) {
      case "clear":
      case "sunny":
        return isNight ? <Moon className="h-5 w-5 text-white" /> : <Sun className="h-5 w-5 text-yellow-400" />
      case "partly cloudy":
        return isNight ? <CloudSun className="h-5 w-5 text-white" /> : <CloudSun className="h-5 w-5 text-yellow-400" />
      default:
        return <Cloud className="h-5 w-5 text-white" />
    }
  }

  const convertedTemps = hours.map((h) => convertToPreferredUnit(h.temp))
  const maxTemp = Math.max(...convertedTemps)
  const minTemp = Math.min(...convertedTemps)
  const range = maxTemp - minTemp > 0 ? maxTemp - minTemp : 10

  return (
    <Card className="mt-6 border-none bg-transparent text-white shadow-none">
      <CardHeader className="p-0 pb-4">
        <h2 className="text-lg font-semibold">Overview</h2>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative h-64">
          <div className="absolute bottom-0 left-0 right-0 top-0">
            <div className="flex h-full flex-col justify-between">
              <div className="border-b border-white/10 text-xs text-white/60">{Math.ceil(maxTemp)}°</div>
              <div className="border-b border-white/10 text-xs text-white/60">30°</div>
              <div className="border-b border-white/10 text-xs text-white/60">20°</div>
              <div className="border-b border-white/10 text-xs text-white/60">10°</div>
              <div className="text-xs text-white/60">0°</div>
            </div>
          </div>

          <div className="absolute bottom-6 left-0 right-0 flex h-40 items-end justify-between">
            {hours.map((hour, index) => {
              const temp = convertToPreferredUnit(hour.temp)
              const height = ((temp - minTemp) / range) * 100
              return (
                <motion.div
                  key={index}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <motion.div
                    className="w-1 rounded-t bg-gradient-to-t from-orange-500 to-yellow-400"
                    style={{ height: `${height}%` }}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
                  ></motion.div>
                </motion.div>
              )
            })}
          </div>

          <div className="absolute bottom-0 left-0 right-0 flex justify-between">
            {hours.map((hour, index) => {
              const hourNum = Number.parseInt(hour.time.split(":")[0])
              return (
                <motion.div
                  key={index}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                >
                  {hour.icon ? (
                    <Image src={`https:${hour.icon}`} alt={hour.condition} width={20} height={20} />
                  ) : (
                    getWeatherIcon(hour.condition, hourNum)
                  )}
                  <div className="mt-1 text-xs">
                    {formatTemperature(hour.temp).replace("°C", "").replace("°F", "")}°
                  </div>
                  <div className="mt-1 text-xs text-white/60">{hour.time}</div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

