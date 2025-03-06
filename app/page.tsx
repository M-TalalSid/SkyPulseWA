import { Suspense } from "react"
import { WeatherDashboard } from "@/components/weather-dashboard"
import { WeatherDashboardSkeleton } from "@/components/weather-dashboard-skeleton"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "SkyPulse - Real-time Weather Forecast",
  description:
    "Get accurate real-time weather forecasts, hourly and daily predictions, air quality data, and personalized weather insights with SkyPulse.",
}

export default function Home() {
  return (
    <Suspense fallback={<WeatherDashboardSkeleton />}>
      <WeatherDashboard />
    </Suspense>
  )
}

