"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import type { WeatherData } from "@/types/weather"

// Cache for weather data
const weatherCache = new Map<string, { data: WeatherData; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export function useWeather(location: string, refreshTrigger = 0) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 3
  const isMountedRef = useRef(true)

  const fetchWeatherData = useCallback(async () => {
    // Cancel any in-flight requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create a new abort controller for this request
    abortControllerRef.current = new AbortController()

    setIsLoading(true)
    setError(null)

    try {
      // Check cache first
      const cacheKey = location.toLowerCase()
      const cachedData = weatherCache.get(cacheKey)
      const now = Date.now()

      // Use cached data if it's fresh
      if (cachedData && now - cachedData.timestamp < CACHE_DURATION && refreshTrigger === 0) {
        setWeatherData(cachedData.data)
        setIsLoading(false)
        return
      }

      // Determine if we should use mock data after multiple failures
      const useMock = retryCount >= maxRetries

      // Fetch from our API route which uses the WeatherAPI.com service
      const url = `/api/weather?location=${encodeURIComponent(location)}${useMock ? "&mock=true" : ""}`

      const response = await fetch(url, {
        signal: abortControllerRef.current.signal,
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      })

      if (!response.ok && !useMock) {
        throw new Error(`Error fetching weather data: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.error && !useMock) {
        throw new Error(data.error)
      }

      // Update cache
      weatherCache.set(cacheKey, { data, timestamp: now })

      if (isMountedRef.current) {
        setWeatherData(data)

        // Reset retry count on success
        if (retryCount > 0) {
          setRetryCount(0)
        }
      }
    } catch (err) {
      // Don't set error if it was an abort error
      if (err instanceof Error && err.name === "AbortError") {
        console.log("Fetch aborted")
        return
      }

      if (isMountedRef.current) {
        setError(err instanceof Error ? err : new Error("Failed to fetch weather data"))

        // Increment retry count for next attempt
        if (retryCount < maxRetries) {
          setRetryCount((prev) => prev + 1)
        }
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false)
      }
    }
  }, [location, refreshTrigger, retryCount])

  // Effect for fetching data
  useEffect(() => {
    isMountedRef.current = true
    fetchWeatherData()

    // Cleanup function to abort any pending requests when the component unmounts
    return () => {
      isMountedRef.current = false
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [fetchWeatherData])

  // Auto-retry with exponential backoff if there's an error
  useEffect(() => {
    if (error && retryCount < maxRetries) {
      const timeoutId = setTimeout(
        () => {
          fetchWeatherData()
        },
        Math.min(1000 * 2 ** retryCount, 10000),
      ) // Exponential backoff with max of 10 seconds

      return () => clearTimeout(timeoutId)
    }
  }, [error, retryCount, fetchWeatherData])

  return { weatherData, isLoading, error }
}

