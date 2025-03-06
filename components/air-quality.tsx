"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { AirQualityData } from "@/types/weather"
import { motion } from "framer-motion"

interface AirQualityProps {
  data: AirQualityData
}

export function AirQuality({ data }: AirQualityProps) {
  const getAirQualityColor = (index: number) => {
    switch (index) {
      case 1:
        return "bg-green-500"
      case 2:
        return "bg-yellow-500"
      case 3:
        return "bg-orange-500"
      case 4:
        return "bg-red-500"
      case 5:
        return "bg-purple-500"
      case 6:
        return "bg-purple-800"
      default:
        return "bg-gray-500"
    }
  }

  const pollutants = [
    { name: "PM2.5", value: data.pm2_5, unit: "μg/m³", threshold: 12 },
    { name: "PM10", value: data.pm10, unit: "μg/m³", threshold: 54 },
    { name: "O₃", value: data.o3, unit: "μg/m³", threshold: 100 },
    { name: "NO₂", value: data.no2, unit: "μg/m³", threshold: 100 },
    { name: "SO₂", value: data.so2, unit: "μg/m³", threshold: 100 },
    { name: "CO", value: data.co, unit: "μg/m³", threshold: 10000 },
  ]

  return (
    <Card className="border-none bg-blue-900/50 text-white shadow-none">
      <CardHeader className="p-4 pb-0">
        <motion.h2
          className="text-lg font-semibold"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Air Quality
        </motion.h2>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/80">Air Quality Index</span>
            <span className="text-sm font-medium">{data.description}</span>
          </div>
          <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${getAirQualityColor(data.index)}`}
              style={{ width: `${Math.min(100, (data.index / 6) * 100)}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (data.index / 6) * 100)}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {pollutants.map((pollutant, index) => {
            const percentage = Math.min(100, (pollutant.value / pollutant.threshold) * 100)
            return (
              <motion.div
                key={pollutant.name}
                className="bg-white/5 rounded-md p-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
              >
                <div className="flex justify-between text-xs mb-1">
                  <span>{pollutant.name}</span>
                  <span>
                    {pollutant.value.toFixed(1)} {pollutant.unit}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className={percentage > 80 ? "bg-red-500" : percentage > 50 ? "bg-yellow-500" : "bg-green-500"}
                    style={{ width: `${percentage}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

