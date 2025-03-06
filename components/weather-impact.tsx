"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { Umbrella, Wind, Sun, Thermometer, Droplets, Shirt, Car, BikeIcon as Bicycle, Leaf } from "lucide-react"
import type { WeatherData } from "@/types/weather"
import { useTemperature } from "@/hooks/use-temperature"

interface WeatherImpactProps {
  weatherData: WeatherData
  location: string
}

export function WeatherImpact({ weatherData, location }: WeatherImpactProps) {
  const [activeTab, setActiveTab] = useState("activities")
  const { formatTemperature } = useTemperature()

  const getUVAdvice = (uvIndex: number) => {
    if (uvIndex <= 2) return "Low risk. No protection needed for most people."
    if (uvIndex <= 5) return "Moderate risk. Wear sunscreen and sunglasses on bright days."
    if (uvIndex <= 7) return "High risk. Cover up, wear sunscreen and seek shade during midday hours."
    if (uvIndex <= 10) return "Very high risk. Minimize sun exposure between 10 AM and 4 PM. Use SPF 30+ sunscreen."
    return "Extreme risk. Avoid being outside during midday hours. SPF 30+ sunscreen essential."
  }

  const getClothingAdvice = (temp: number, condition: string) => {
    const tempC = weatherData.current.temp
    const isRainy = condition.toLowerCase().includes("rain") || condition.toLowerCase().includes("drizzle")
    const isWindy = weatherData.current.wind > 20

    if (isRainy) {
      return "Bring a waterproof jacket and umbrella. Water-resistant footwear recommended."
    }

    if (tempC < 5) {
      return "Very cold. Wear a heavy winter coat, gloves, scarf, and hat."
    } else if (tempC < 10) {
      return "Cold. Wear a winter coat, hat, and consider gloves."
    } else if (tempC < 15) {
      return "Cool. A light jacket or sweater is recommended."
    } else if (tempC < 20) {
      return "Mild. Long sleeves or a light sweater should be comfortable."
    } else if (tempC < 25) {
      return "Warm. Short sleeves and light pants or shorts are suitable."
    } else if (tempC < 30) {
      return "Hot. Light, breathable clothing recommended."
    } else {
      return "Very hot. Wear lightweight, loose-fitting clothing and a hat for sun protection."
    }
  }

  const getOutdoorActivityAdvice = () => {
    const temp = weatherData.current.temp
    const condition = weatherData.current.condition.toLowerCase()
    const wind = weatherData.current.wind
    const uvIndex = weatherData.current.uvIndex || 0
    const chanceOfRain = weatherData.current.chanceOfRain || 0

    if (condition.includes("rain") || condition.includes("storm") || chanceOfRain > 50) {
      return "Not ideal for outdoor activities. Consider indoor alternatives."
    }

    if (wind > 30) {
      return "High winds may affect outdoor activities. Use caution."
    }

    if (uvIndex > 7) {
      return "High UV levels. Limit direct sun exposure and wear sun protection."
    }

    if (temp > 30) {
      return "Very hot conditions. Stay hydrated and avoid strenuous activities during peak heat."
    }

    if (temp < 5) {
      return "Very cold conditions. Dress warmly and limit time outdoors."
    }

    return "Good conditions for outdoor activities. Enjoy!"
  }

  const getAirQualityImpact = () => {
    const aqIndex = weatherData.current.airQuality

    if (aqIndex <= 1) {
      return "Good air quality. Ideal for outdoor activities."
    } else if (aqIndex <= 2) {
      return "Moderate air quality. Unusually sensitive people should consider reducing prolonged outdoor exertion."
    } else if (aqIndex <= 3) {
      return "Unhealthy for sensitive groups. People with respiratory or heart conditions should limit outdoor exertion."
    } else if (aqIndex <= 4) {
      return "Unhealthy air quality. Everyone may begin to experience health effects. Sensitive groups should reduce outdoor activities."
    } else {
      return "Very unhealthy air quality. Everyone should avoid outdoor exertion. Consider staying indoors."
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card className="border-none bg-white/5 backdrop-blur-sm text-white shadow-md">
          <CardHeader className="p-4">
            <h2 className="text-xl font-semibold">Weather Impact for {location}</h2>
            <Tabs defaultValue="activities" value={activeTab} onValueChange={setActiveTab} className="mt-2">
              <TabsList className="bg-white/10">
                <TabsTrigger value="activities">Activities</TabsTrigger>
                <TabsTrigger value="health">Health</TabsTrigger>
                <TabsTrigger value="travel">Travel</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="p-4">
            <TabsContent value="activities" className="mt-0">
              <div className="space-y-4">
                <motion.div
                  className="rounded-lg bg-white/5 p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-blue-500/20 p-2">
                      <Bicycle className="h-5 w-5 text-blue-300" />
                    </div>
                    <div>
                      <h3 className="font-medium">Outdoor Activities</h3>
                      <p className="mt-1 text-sm text-white/80">{getOutdoorActivityAdvice()}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="rounded-lg bg-white/5 p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-green-500/20 p-2">
                      <Leaf className="h-5 w-5 text-green-300" />
                    </div>
                    <div>
                      <h3 className="font-medium">Gardening & Plants</h3>
                      <p className="mt-1 text-sm text-white/80">
                        {weatherData.current.condition.toLowerCase().includes("rain")
                          ? "Good day for plants. No need to water outdoor plants."
                          : "Consider watering outdoor plants, especially if it's been dry."}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="rounded-lg bg-white/5 p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-yellow-500/20 p-2">
                      <Shirt className="h-5 w-5 text-yellow-300" />
                    </div>
                    <div>
                      <h3 className="font-medium">Clothing Recommendation</h3>
                      <p className="mt-1 text-sm text-white/80">
                        {getClothingAdvice(weatherData.current.temp, weatherData.current.condition)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="health" className="mt-0">
              <div className="space-y-4">
                <motion.div
                  className="rounded-lg bg-white/5 p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-orange-500/20 p-2">
                      <Sun className="h-5 w-5 text-orange-300" />
                    </div>
                    <div>
                      <h3 className="font-medium">UV Protection</h3>
                      <p className="mt-1 text-sm text-white/80">{getUVAdvice(weatherData.current.uvIndex || 0)}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="rounded-lg bg-white/5 p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-blue-500/20 p-2">
                      <Droplets className="h-5 w-5 text-blue-300" />
                    </div>
                    <div>
                      <h3 className="font-medium">Hydration</h3>
                      <p className="mt-1 text-sm text-white/80">
                        {weatherData.current.temp > 25
                          ? "High temperatures. Remember to drink plenty of water throughout the day."
                          : "Stay hydrated even in cooler weather."}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="rounded-lg bg-white/5 p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-purple-500/20 p-2">
                      <Wind className="h-5 w-5 text-purple-300" />
                    </div>
                    <div>
                      <h3 className="font-medium">Air Quality</h3>
                      <p className="mt-1 text-sm text-white/80">{getAirQualityImpact()}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="travel" className="mt-0">
              <div className="space-y-4">
                <motion.div
                  className="rounded-lg bg-white/5 p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-red-500/20 p-2">
                      <Car className="h-5 w-5 text-red-300" />
                    </div>
                    <div>
                      <h3 className="font-medium">Driving Conditions</h3>
                      <p className="mt-1 text-sm text-white/80">
                        {weatherData.current.condition.toLowerCase().includes("rain") ||
                        weatherData.current.condition.toLowerCase().includes("snow")
                          ? "Reduced visibility and slippery roads possible. Drive with caution."
                          : weatherData.current.wind > 30
                            ? "Strong winds may affect high-sided vehicles. Take care on exposed routes."
                            : "Good driving conditions expected."}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="rounded-lg bg-white/5 p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-blue-500/20 p-2">
                      <Umbrella className="h-5 w-5 text-blue-300" />
                    </div>
                    <div>
                      <h3 className="font-medium">What to Pack</h3>
                      <p className="mt-1 text-sm text-white/80">
                        {weatherData.current.condition.toLowerCase().includes("rain")
                          ? "Bring an umbrella and waterproof clothing."
                          : weatherData.current.temp < 10
                            ? "Pack warm layers and a jacket."
                            : weatherData.current.temp > 25
                              ? "Pack light clothing, sunscreen, and a hat."
                              : "Standard clothing should be comfortable."}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="rounded-lg bg-white/5 p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-yellow-500/20 p-2">
                      <Thermometer className="h-5 w-5 text-yellow-300" />
                    </div>
                    <div>
                      <h3 className="font-medium">Comfort Level</h3>
                      <p className="mt-1 text-sm text-white/80">
                        {`Current feels like temperature is ${formatTemperature(weatherData.current.feelsLike)}. `}
                        {weatherData.current.feelsLike > 30
                          ? "Very hot and potentially uncomfortable for extended outdoor activities."
                          : weatherData.current.feelsLike > 20
                            ? "Comfortable for most outdoor activities."
                            : weatherData.current.feelsLike > 10
                              ? "Cool but comfortable with appropriate clothing."
                              : "Cold conditions. Dress warmly."}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-6">
        <Card className="border-none bg-white/5 backdrop-blur-sm text-white shadow-md">
          <CardHeader className="p-4">
            <h3 className="text-lg font-semibold">Today's Recommendation</h3>
          </CardHeader>
          <CardContent className="p-4">
            <div className="text-center">
              {weatherData.current.condition.toLowerCase().includes("rain") ? (
                <Umbrella className="mx-auto h-12 w-12 text-blue-300 mb-3" />
              ) : weatherData.current.temp > 25 ? (
                <Sun className="mx-auto h-12 w-12 text-yellow-400 mb-3" />
              ) : weatherData.current.wind > 20 ? (
                <Wind className="mx-auto h-12 w-12 text-blue-300 mb-3" />
              ) : (
                <Bicycle className="mx-auto h-12 w-12 text-green-300 mb-3" />
              )}

              <p className="text-lg font-medium">
                {weatherData.current.condition.toLowerCase().includes("rain")
                  ? "Indoor day! Perfect for museums, movies, or staying cozy at home."
                  : weatherData.current.temp > 25
                    ? "Great beach or pool day! Stay hydrated and use sun protection."
                    : weatherData.current.wind > 20
                      ? "Windy conditions. Good day for kite flying but secure loose items."
                      : "Perfect day for outdoor activities and exploring!"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-white/5 backdrop-blur-sm text-white shadow-md">
          <CardHeader className="p-4">
            <h3 className="text-lg font-semibold">Weather Alerts</h3>
          </CardHeader>
          <CardContent className="p-4">
            {weatherData.alerts && weatherData.alerts.length > 0 ? (
              <div className="space-y-2">
                {weatherData.alerts.map((alert, index) => (
                  <div key={index} className="rounded-md bg-red-900/30 p-3">
                    <h4 className="font-medium">{alert.title}</h4>
                    <p className="mt-1 text-xs text-white/80">{alert.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-white/60">No active weather alerts for this location.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

