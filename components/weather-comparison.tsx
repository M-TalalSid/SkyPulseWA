"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ArrowRight, Thermometer, Droplets, Wind, Sun } from "lucide-react"
import { motion } from "framer-motion"
import type { WeatherData } from "@/types/weather"
import { useTemperature } from "@/hooks/use-temperature"
import { useWeather } from "@/hooks/use-weather"

interface WeatherComparisonProps {
  primaryLocation: string
  secondaryLocation: string | null
  onSecondaryLocationChange: (location: string) => void
  weatherData: WeatherData
}

export function WeatherComparison({
  primaryLocation,
  secondaryLocation,
  onSecondaryLocationChange,
  weatherData,
}: WeatherComparisonProps) {
  const [compareLocation, setCompareLocation] = useState("")
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const { formatTemperature } = useTemperature()

  const {
    weatherData: secondaryWeatherData,
    isLoading: isLoadingSecondary,
    error: secondaryError,
  } = useWeather(secondaryLocation || "", refreshTrigger)

  const handleCompare = () => {
    if (compareLocation) {
      onSecondaryLocationChange(compareLocation)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCompare()
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-none bg-white/5 backdrop-blur-sm text-white shadow-md">
        <CardHeader className="p-4">
          <h2 className="text-xl font-semibold">Compare Weather</h2>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
              <Input
                placeholder="Enter location to compare"
                value={compareLocation}
                onChange={(e) => setCompareLocation(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
            </div>
            <Button onClick={handleCompare} className="bg-blue-600 hover:bg-blue-700">
              Compare
            </Button>
          </div>
        </CardContent>
      </Card>

      {secondaryLocation && secondaryWeatherData ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="border-none bg-white/5 backdrop-blur-sm text-white shadow-md overflow-hidden">
            <CardHeader className="p-4">
              <h2 className="text-lg font-semibold">Weather Comparison</h2>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-4 border-b md:border-b-0 md:border-r border-white/10">
                  <h3 className="text-center font-medium mb-4">{primaryLocation}</h3>
                  <div className="flex justify-center mb-4">
                    {weatherData.current.icon ? (
                      <img
                        src={`https:${weatherData.current.icon}`}
                        alt={weatherData.current.condition}
                        className="w-16 h-16"
                      />
                    ) : (
                      <div className="w-16 h-16 flex items-center justify-center">
                        <Sun className="h-12 w-12 text-yellow-400" />
                      </div>
                    )}
                  </div>
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold">{formatTemperature(weatherData.current.temp)}</div>
                    <div className="text-white/80">{weatherData.current.condition}</div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Thermometer className="h-4 w-4 text-orange-300" />
                        <span className="text-sm">Feels Like</span>
                      </div>
                      <span className="font-medium">{formatTemperature(weatherData.current.feelsLike)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-blue-300" />
                        <span className="text-sm">Humidity</span>
                      </div>
                      <span className="font-medium">{weatherData.current.humidity}%</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wind className="h-4 w-4 text-blue-300" />
                        <span className="text-sm">Wind</span>
                      </div>
                      <span className="font-medium">{weatherData.current.wind} km/h</span>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-center font-medium mb-4">{secondaryLocation}</h3>
                  <div className="flex justify-center mb-4">
                    {secondaryWeatherData.current.icon ? (
                      <img
                        src={`https:${secondaryWeatherData.current.icon}`}
                        alt={secondaryWeatherData.current.condition}
                        className="w-16 h-16"
                      />
                    ) : (
                      <div className="w-16 h-16 flex items-center justify-center">
                        <Sun className="h-12 w-12 text-yellow-400" />
                      </div>
                    )}
                  </div>
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold">{formatTemperature(secondaryWeatherData.current.temp)}</div>
                    <div className="text-white/80">{secondaryWeatherData.current.condition}</div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Thermometer className="h-4 w-4 text-orange-300" />
                        <span className="text-sm">Feels Like</span>
                      </div>
                      <span className="font-medium">{formatTemperature(secondaryWeatherData.current.feelsLike)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-blue-300" />
                        <span className="text-sm">Humidity</span>
                      </div>
                      <span className="font-medium">{secondaryWeatherData.current.humidity}%</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wind className="h-4 w-4 text-blue-300" />
                        <span className="text-sm">Wind</span>
                      </div>
                      <span className="font-medium">{secondaryWeatherData.current.wind} km/h</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-white/10">
                <h3 className="font-medium mb-3">Temperature Difference</h3>
                <div className="flex items-center gap-2">
                  <div className="text-lg font-bold">{formatTemperature(weatherData.current.temp)}</div>
                  <ArrowRight className="h-4 w-4 text-white/60" />
                  <div className="text-lg font-bold">{formatTemperature(secondaryWeatherData.current.temp)}</div>
                  <div className="ml-auto text-lg font-bold">
                    {weatherData.current.temp > secondaryWeatherData.current.temp ? (
                      <span className="text-blue-300">
                        {formatTemperature(weatherData.current.temp - secondaryWeatherData.current.temp)
                          .replace("°C", "")
                          .replace("°F", "")}
                        ° warmer
                      </span>
                    ) : weatherData.current.temp < secondaryWeatherData.current.temp ? (
                      <span className="text-red-300">
                        {formatTemperature(secondaryWeatherData.current.temp - weatherData.current.temp)
                          .replace("°C", "")
                          .replace("°F", "")}
                        ° cooler
                      </span>
                    ) : (
                      <span>Same temperature</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6 border-none bg-white/5 backdrop-blur-sm text-white shadow-md">
            <CardHeader className="p-4">
              <h2 className="text-lg font-semibold">5-Day Forecast Comparison</h2>
            </CardHeader>
            <CardContent className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="pb-2 text-left">Day</th>
                      <th className="pb-2 text-center">{primaryLocation}</th>
                      <th className="pb-2 text-center">{secondaryLocation}</th>
                      <th className="pb-2 text-right">Difference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weatherData.daily.slice(0, 5).map((day, index) => {
                      const secondaryDay = secondaryWeatherData.daily[index]
                      const tempDiff = Math.abs(day.highTemp - secondaryDay.highTemp)
                      const isWarmer = day.highTemp > secondaryDay.highTemp

                      return (
                        <tr key={index} className="border-b border-white/10">
                          <td className="py-3 text-left">
                            {index === 0
                              ? "Today"
                              : new Date(day.date).toLocaleDateString(undefined, { weekday: "short" })}
                          </td>
                          <td className="py-3 text-center">
                            <div className="flex flex-col items-center">
                              <div className="text-sm">{formatTemperature(day.highTemp)}</div>
                              <div className="text-xs text-white/60">{day.condition}</div>
                            </div>
                          </td>
                          <td className="py-3 text-center">
                            <div className="flex flex-col items-center">
                              <div className="text-sm">{formatTemperature(secondaryDay.highTemp)}</div>
                              <div className="text-xs text-white/60">{secondaryDay.condition}</div>
                            </div>
                          </td>
                          <td className="py-3 text-right">
                            <span className={isWarmer ? "text-red-300" : "text-blue-300"}>
                              {formatTemperature(tempDiff).replace("°C", "").replace("°F", "")}°{" "}
                              {isWarmer ? "warmer" : "cooler"}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : secondaryLocation && isLoadingSecondary ? (
        <Card className="border-none bg-white/5 backdrop-blur-sm text-white shadow-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading comparison data...</p>
          </CardContent>
        </Card>
      ) : secondaryLocation && secondaryError ? (
        <Card className="border-none bg-white/5 backdrop-blur-sm text-white shadow-md">
          <CardContent className="p-6 text-center">
            <p className="text-red-400">Error loading data for {secondaryLocation}</p>
            <Button
              onClick={() => setRefreshTrigger((prev) => prev + 1)}
              className="mt-4 bg-blue-600 hover:bg-blue-700"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-none bg-white/5 backdrop-blur-sm text-white shadow-md">
          <CardContent className="p-6 text-center">
            <p className="text-white/60">Enter a location above to compare weather conditions</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

