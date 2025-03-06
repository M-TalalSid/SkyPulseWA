"use client"

import { Cloud, CloudSun, Sun, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { WeatherLocation, CurrentWeatherData } from "@/types/weather"
import { useTemperature } from "@/hooks/use-temperature"
import { motion } from "framer-motion"
import Image from "next/image"
import { memo } from "react"

interface CurrentWeatherProps {
  data: CurrentWeatherData
  location: WeatherLocation
}

export const CurrentWeather = memo(function CurrentWeather({ data, location }: CurrentWeatherProps) {
  const { formatTemperature } = useTemperature()

  const getWeatherIcon = (condition: string) => {
    if (data.icon) {
      return (
        <Image
          src={`https:${data.icon}`}
          alt={condition}
          width={64}
          height={64}
          loading="eager"
          priority
          className="h-16 w-16"
        />
      )
    }

    switch (condition.toLowerCase()) {
      case "clear":
      case "sunny":
        return <Sun className="h-16 w-16 text-yellow-400" />
      case "partly cloudy":
        return <CloudSun className="h-16 w-16 text-yellow-400" />
      default:
        return <Cloud className="h-16 w-16 text-white" />
    }
  }

  return (
    <Card className="border-none bg-white/5 backdrop-blur-sm text-white shadow-md">
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-0">
        <div>
          <div className="flex items-center gap-1 mb-1">
            <MapPin className="h-4 w-4 text-blue-300" />
            <h2 className="text-lg font-semibold">{location.name}</h2>
            {location.region && (
              <span className="text-xs text-white/60 ml-1">
                {location.region}, {location.country}
              </span>
            )}
          </div>
          <p className="text-xs text-white/60">{data.time}</p>
        </div>
        <Button variant="outline" size="sm" className="border-white/20 bg-white/5 text-white/80 hover:bg-white/10">
          Seeing different weather?
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="flex items-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {getWeatherIcon(data.condition)}
          </motion.div>
          <div className="flex flex-col">
            <motion.div
              className="flex items-end"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <span className="text-7xl font-bold">
                {formatTemperature(data.temp).replace("°C", "").replace("°F", "")}
              </span>
              <span className="text-3xl">{formatTemperature(0).includes("C") ? "°C" : "°F"}</span>
            </motion.div>
            <motion.div
              className="text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {data.condition}
            </motion.div>
            <motion.div
              className="text-sm text-white/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Feels like: {formatTemperature(data.feelsLike)}
            </motion.div>
          </div>
        </motion.div>
        <motion.div
          className="mt-4 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <p>
            Expect {data.condition.toLowerCase()} conditions. The high will be {formatTemperature(data.highTemp)}.
          </p>
        </motion.div>
      </CardContent>
    </Card>
  )
})

