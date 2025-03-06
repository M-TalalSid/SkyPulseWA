"use client"

import { useSettings } from "@/context/settings-context"

export function useTemperature() {
  const { settings } = useSettings()

  const formatTemperature = (celsius: number) => {
    if (settings.temperatureUnit === "fahrenheit") {
      const fahrenheit = (celsius * 9) / 5 + 32
      return `${Math.round(fahrenheit)}°F`
    }
    return `${Math.round(celsius)}°C`
  }

  const convertToPreferredUnit = (celsius: number) => {
    if (settings.temperatureUnit === "fahrenheit") {
      return (celsius * 9) / 5 + 32
    }
    return celsius
  }

  return {
    formatTemperature,
    convertToPreferredUnit,
    unit: settings.temperatureUnit,
  }
}

