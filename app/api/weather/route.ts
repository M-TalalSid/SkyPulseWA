import { NextResponse } from "next/server"
import type { WeatherData, AirQualityData, WeatherAlert } from "@/types/weather"

// In-memory cache
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
const cache = new Map<string, { data: WeatherData; timestamp: number }>()

// Mock data for fallback when API fails
const getMockWeatherData = (location: string): WeatherData => {
  const now = new Date()
  const currentHour = now.getHours()
  const isNight = currentHour < 6 || currentHour > 18

  return {
    location: {
      name: location,
      region: "Mock Region",
      country: "Mock Country",
      lat: 0,
      lon: 0,
      localtime: now.toISOString(),
      timezone: "UTC",
    },
    current: {
      temp: 22,
      feelsLike: 23,
      condition: isNight ? "Clear" : "Sunny",
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      highTemp: 25,
      lowTemp: 18,
      wind: 10,
      windDir: "N",
      windGust: 15,
      humidity: 65,
      visibility: 10,
      pressure: 1012,
      dewPoint: 15,
      airQuality: 1,
      airQualityData: {
        index: 1,
        co: 250,
        no2: 10,
        o3: 40,
        so2: 5,
        pm2_5: 8,
        pm10: 12,
        description: "Good",
      },
      uvIndex: 5,
      sunrise: "06:30 AM",
      sunset: "06:30 PM",
      moonPhase: "Waxing Gibbous",
      chanceOfRain: 0,
      precipMm: 0,
      icon: isNight
        ? "//cdn.weatherapi.com/weather/64x64/night/113.png"
        : "//cdn.weatherapi.com/weather/64x64/day/113.png",
    },
    hourly: Array.from({ length: 24 }, (_, i) => {
      const hour = (currentHour + i) % 24
      const isHourNight = hour < 6 || hour > 18
      return {
        time: `${hour}:00`,
        temp: 22 + Math.sin(i / 3) * 5,
        condition: isHourNight ? "Clear" : "Sunny",
        icon: isHourNight
          ? "//cdn.weatherapi.com/weather/64x64/night/113.png"
          : "//cdn.weatherapi.com/weather/64x64/day/113.png",
        chanceOfRain: 0,
        precipMm: 0,
        windSpeed: 10 + Math.sin(i / 2) * 5,
        windDir: "N",
        humidity: 65,
        feelsLike: 23 + Math.sin(i / 3) * 5,
        uvIndex: isHourNight ? 0 : 5,
      }
    }),
    daily: Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() + i)
      return {
        date: date.toISOString().split("T")[0],
        highTemp: 25 + Math.sin(i / 2) * 3,
        lowTemp: 18 + Math.sin(i / 2) * 3,
        condition: "Sunny",
        icon: "//cdn.weatherapi.com/weather/64x64/day/113.png",
        chanceOfRain: 0,
        precipMm: 0,
        sunrise: "06:30 AM",
        sunset: "06:30 PM",
        moonPhase: "Waxing Gibbous",
        uvIndex: 5,
        humidity: 65,
        windSpeed: 10,
      }
    }),
    alerts: [],
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const location = searchParams.get("location") || "Karachi"
  const apiKey = "e472886c3fa44b3598b210057250403" // Consider moving this to environment variables
  const useMockData = searchParams.get("mock") === "true"

  // Check cache first
  const cacheKey = location.toLowerCase()
  const cachedData = cache.get(cacheKey)
  const now = Date.now()

  if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
    // Set cache control headers
    return NextResponse.json(cachedData.data, {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=300",
        "CDN-Cache-Control": "public, max-age=300, s-maxage=300",
        "Vercel-CDN-Cache-Control": "public, max-age=300, s-maxage=300",
      },
    })
  }

  // If mock data is requested, return it immediately
  if (useMockData) {
    const mockData = getMockWeatherData(location)
    cache.set(cacheKey, { data: mockData, timestamp: now })
    return NextResponse.json(mockData)
  }

  try {
    // Fetch real data from WeatherAPI.com with retry logic
    let response = null
    let retries = 3
    let lastError = null

    while (retries > 0) {
      try {
        response = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(location)}&days=7&aqi=yes&alerts=yes`,
          {
            next: { revalidate: 300 }, // Revalidate every 5 minutes
            headers: {
              Accept: "application/json",
              "User-Agent": "Weather App/1.0",
            },
          },
        )

        if (response.ok) {
          break
        } else {
          lastError = new Error(`Weather API responded with status: ${response.status}`)
          console.error(`API request failed (${retries} retries left):`, lastError.message)
        }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))
        console.error(`API request error (${retries} retries left):`, lastError.message)
      }

      retries--
      if (retries > 0) {
        // Wait before retrying (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, (3 - retries) * 1000))
      }
    }

    // If all retries failed, use mock data
    if (!response || !response.ok) {
      console.error("All API requests failed, using mock data")
      const mockData = getMockWeatherData(location)
      cache.set(cacheKey, { data: mockData, timestamp: now })

      return NextResponse.json(mockData, {
        headers: {
          "X-Data-Source": "mock",
          "Cache-Control": "public, max-age=300, s-maxage=300",
        },
      })
    }

    const apiData = await response.json()

    // Process air quality data
    const airQualityData: AirQualityData = {
      index: apiData.current.air_quality?.["us-epa-index"] || 1,
      co: apiData.current.air_quality?.co || 0,
      no2: apiData.current.air_quality?.no2 || 0,
      o3: apiData.current.air_quality?.o3 || 0,
      so2: apiData.current.air_quality?.so2 || 0,
      pm2_5: apiData.current.air_quality?.pm2_5 || 0,
      pm10: apiData.current.air_quality?.pm10 || 0,
      description: getAirQualityDescription(apiData.current.air_quality?.["us-epa-index"] || 1),
    }

    // Process alerts
    const alerts: WeatherAlert[] =
      apiData.alerts?.alert?.map((alert: any) => ({
        title: alert.headline || "Weather Alert",
        severity: getSeverityLevel(alert.severity),
        description: alert.desc || alert.headline || "Weather alert issued for your area",
        effective: alert.effective || new Date().toISOString(),
        expires: alert.expires || new Date(Date.now() + 86400000).toISOString(),
        type: alert.event || "General Alert",
      })) || []

    // Transform API data to our application format
    const weatherData: WeatherData = {
      location: {
        name: apiData.location.name,
        region: apiData.location.region,
        country: apiData.location.country,
        lat: apiData.location.lat,
        lon: apiData.location.lon,
        localtime: apiData.location.localtime,
        timezone: apiData.location.tz_id,
      },
      current: {
        temp: apiData.current.temp_c,
        feelsLike: apiData.current.feelslike_c,
        condition: apiData.current.condition.text,
        time: new Date(apiData.location.localtime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        highTemp: apiData.forecast.forecastday[0].day.maxtemp_c,
        lowTemp: apiData.forecast.forecastday[0].day.mintemp_c,
        wind: apiData.current.wind_kph,
        windDir: apiData.current.wind_dir,
        windGust: apiData.current.gust_kph,
        humidity: apiData.current.humidity,
        visibility: apiData.current.vis_km,
        pressure: apiData.current.pressure_mb,
        dewPoint: apiData.forecast.forecastday[0].hour[0].dewpoint_c,
        airQuality: apiData.current.air_quality?.["us-epa-index"] || 0,
        airQualityData: airQualityData,
        uvIndex: apiData.current.uv,
        sunrise: apiData.forecast.forecastday[0].astro.sunrise,
        sunset: apiData.forecast.forecastday[0].astro.sunset,
        moonPhase: apiData.forecast.forecastday[0].astro.moon_phase,
        chanceOfRain: apiData.forecast.forecastday[0].day.daily_chance_of_rain,
        precipMm: apiData.current.precip_mm,
        icon: apiData.current.condition.icon,
      },
      hourly: apiData.forecast.forecastday[0].hour.map((hour: any) => ({
        time: new Date(hour.time).getHours() + ":00",
        temp: hour.temp_c,
        condition: hour.condition.text,
        icon: hour.condition.icon,
        chanceOfRain: hour.chance_of_rain,
        precipMm: hour.precip_mm,
        windSpeed: hour.wind_kph,
        windDir: hour.wind_dir,
        humidity: hour.humidity,
        feelsLike: hour.feelslike_c,
        uvIndex: hour.uv,
      })),
      daily: apiData.forecast.forecastday.map((day: any) => ({
        date: day.date,
        highTemp: day.day.maxtemp_c,
        lowTemp: day.day.mintemp_c,
        condition: day.day.condition.text,
        icon: day.day.condition.icon,
        chanceOfRain: day.day.daily_chance_of_rain,
        precipMm: day.day.totalprecip_mm,
        sunrise: day.astro.sunrise,
        sunset: day.astro.sunset,
        moonPhase: day.astro.moon_phase,
        uvIndex: day.day.uv,
        humidity: day.day.avghumidity,
        windSpeed: day.day.maxwind_kph,
      })),
      alerts: alerts,
    }

    // Update cache
    cache.set(cacheKey, { data: weatherData, timestamp: now })

    // Return with cache control headers
    return NextResponse.json(weatherData, {
      headers: {
        "X-Data-Source": "api",
        "Cache-Control": "public, max-age=300, s-maxage=300",
        "CDN-Cache-Control": "public, max-age=300, s-maxage=300",
        "Vercel-CDN-Cache-Control": "public, max-age=300, s-maxage=300",
      },
    })
  } catch (error) {
    console.error("Error fetching weather data:", error)

    // Use mock data as fallback
    const mockData = getMockWeatherData(location)
    cache.set(cacheKey, { data: mockData, timestamp: now })

    return NextResponse.json(mockData, {
      headers: {
        "X-Data-Source": "mock-fallback",
        "X-Error": error instanceof Error ? error.message : String(error),
      },
    })
  }
}

function getAirQualityDescription(index: number): string {
  switch (index) {
    case 1:
      return "Good"
    case 2:
      return "Moderate"
    case 3:
      return "Unhealthy for sensitive groups"
    case 4:
      return "Unhealthy"
    case 5:
      return "Very Unhealthy"
    case 6:
      return "Hazardous"
    default:
      return "Unknown"
  }
}

function getSeverityLevel(severity: string): "minor" | "moderate" | "severe" | "extreme" {
  if (!severity) return "moderate"

  const severityLower = severity.toLowerCase()
  if (severityLower.includes("extreme") || severityLower.includes("emergency")) {
    return "extreme"
  } else if (severityLower.includes("severe") || severityLower.includes("warning")) {
    return "severe"
  } else if (severityLower.includes("moderate") || severityLower.includes("watch")) {
    return "moderate"
  } else {
    return "minor"
  }
}

