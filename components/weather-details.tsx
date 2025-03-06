"use client"

import { Info } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { CurrentWeatherData } from "@/types/weather"
import { useTemperature } from "@/hooks/use-temperature"
import { motion } from "framer-motion"

interface WeatherDetailsProps {
  data: CurrentWeatherData
}

export function WeatherDetails({ data }: WeatherDetailsProps) {
  const { formatTemperature } = useTemperature()

  const details = [
    { label: "Air quality", value: data.airQuality, info: true },
    { label: "Wind", value: `${data.wind} km/h`, info: true },
    { label: "Humidity", value: `${data.humidity}%`, info: true },
    { label: "Visibility", value: `${data.visibility} km`, info: true },
    { label: "Pressure", value: `${data.pressure} mb`, info: true },
    { label: "Dew point", value: formatTemperature(data.dewPoint), info: true },
  ]

  return (
    <Card className="mt-6 border-none bg-white/5 backdrop-blur-sm text-white shadow-md" id="details">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {details.map((detail, index) => (
            <motion.div
              key={detail.label}
              className="flex flex-col rounded-md bg-white/5 p-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs text-white/60">{detail.label}</span>
                {detail.info && <Info className="h-3 w-3 text-white/60" />}
              </div>
              <div className="text-sm font-medium">{detail.value}</div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

