"use client"

import { Card, CardContent } from "@/components/ui/card"
import { PrecipitationRadar } from "@/components/precipitation-radar"
import { UVIndex } from "@/components/uv-index"
import { WindDirection } from "@/components/wind-direction"
import { AirQuality } from "@/components/air-quality"
import { SavedLocations } from "@/components/saved-locations"
import { DailyForecast } from "@/components/daily-forecast"
import type { WeatherData } from "@/types/weather"

interface DetailsTabContentProps {
  weatherData: WeatherData
  location: string
  onLocationSelect: (location: string) => void
}

export function DetailsTabContent({ weatherData, location, onLocationSelect }: DetailsTabContentProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <PrecipitationRadar location={location} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4 lg:mt-6">
          <Card className="border-none bg-white/5 backdrop-blur-sm text-white shadow-none">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4">Wind</h3>
              <div className="flex justify-center">
                <WindDirection direction={weatherData.current.windDir || "N"} speed={weatherData.current.wind} />
              </div>
            </CardContent>
          </Card>
          <Card className="border-none bg-white/5 backdrop-blur-sm text-white shadow-none">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4">UV Index</h3>
              <UVIndex uvIndex={weatherData.current.uvIndex || 0} />
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex flex-col gap-4 lg:gap-6">
        <AirQuality
          data={
            weatherData.current.airQualityData || {
              index: 1,
              co: 0,
              no2: 0,
              o3: 0,
              so2: 0,
              pm2_5: 0,
              pm10: 0,
              description: "Good",
            }
          }
        />
        <SavedLocations onLocationSelect={onLocationSelect} currentLocation={location} />
        <DailyForecast data={weatherData.daily} />
      </div>
    </div>
  )
}

