"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sun, CloudSun, Cloud, Moon } from "lucide-react"
import Image from "next/image"
import type { HourlyWeatherData } from "@/types/weather"
import { useTemperature } from "@/hooks/use-temperature"
import { motion, AnimatePresence } from "framer-motion"

interface HourlyForecastProps {
  data: HourlyWeatherData[]
}

export function HourlyForecast({ data }: HourlyForecastProps) {
  const [view, setView] = useState("chart")
  const { formatTemperature } = useTemperature()

  const getWeatherIcon = (condition: string, hour: number) => {
    const isNight = hour < 6 || hour > 18

    switch (condition.toLowerCase()) {
      case "clear":
      case "sunny":
        return isNight ? <Moon className="h-8 w-8 text-white" /> : <Sun className="h-8 w-8 text-yellow-400" />
      case "partly cloudy":
        return isNight ? <CloudSun className="h-8 w-8 text-white" /> : <CloudSun className="h-8 w-8 text-yellow-400" />
      default:
        return <Cloud className="h-8 w-8 text-white" />
    }
  }

  // Get the next 24 hours of data
  const hourlyData = data.slice(0, 24)

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  // Chart view component
  const ChartView = () => (
    <motion.div className="flex gap-4 overflow-x-auto pb-2" variants={container} initial="hidden" animate="show">
      {hourlyData.map((hour, index) => {
        const hourNum = Number.parseInt(hour.time.split(":")[0])
        return (
          <motion.div
            key={index}
            className="flex min-w-[120px] flex-col items-center rounded-md bg-white/5 p-4"
            variants={item}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
          >
            <div className="text-sm">{hour.time}</div>
            <div className="my-2 flex flex-col items-center gap-1">
              {hour.icon ? (
                <Image src={`https:${hour.icon}`} alt={hour.condition} width={32} height={32} />
              ) : (
                getWeatherIcon(hour.condition, hourNum)
              )}
            </div>
            <div className="text-xl font-bold">{formatTemperature(hour.temp).replace("°C", "").replace("°F", "")}°</div>
            {hour.chanceOfRain !== undefined && (
              <div className="mt-1 text-xs text-blue-300">
                {hour.chanceOfRain}% <span className="text-white/60">rain</span>
              </div>
            )}
          </motion.div>
        )
      })}
    </motion.div>
  )

  // List view component
  const ListView = () => (
    <motion.div className="flex flex-col gap-2" variants={container} initial="hidden" animate="show">
      {hourlyData.slice(0, 12).map((hour, index) => {
        const hourNum = Number.parseInt(hour.time.split(":")[0])
        return (
          <motion.div
            key={index}
            className="flex items-center justify-between rounded-md bg-white/5 p-3"
            variants={item}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
          >
            <div className="w-16 text-sm">{hour.time}</div>
            <div className="flex items-center">
              {hour.icon ? (
                <Image src={`https:${hour.icon}`} alt={hour.condition} width={24} height={24} />
              ) : (
                getWeatherIcon(hour.condition, hourNum)
              )}
            </div>
            <div className="text-lg font-bold">{formatTemperature(hour.temp).replace("°C", "").replace("°F", "")}°</div>
            <div className="text-sm">{hour.windSpeed} km/h</div>
            {hour.chanceOfRain !== undefined && (
              <div className="text-xs text-blue-300">
                {hour.chanceOfRain}% <span className="text-white/60">rain</span>
              </div>
            )}
          </motion.div>
        )
      })}
    </motion.div>
  )

  return (
    <Card className="mt-6 border-none bg-transparent text-white shadow-none" id="hourly">
      <CardHeader className="flex flex-row items-center justify-between p-0 pb-4">
        <h2 className="text-lg font-semibold">Hourly</h2>
        <Tabs defaultValue="chart" value={view} onValueChange={setView}>
          <TabsList className="bg-white/10">
            <TabsTrigger value="chart">Chart</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <AnimatePresence mode="wait">
          {view === "chart" ? (
            <motion.div
              key="chart"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChartView />
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ListView />
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

