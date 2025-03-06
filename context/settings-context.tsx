"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useTheme } from "next-themes"
import type { UserSettings, SavedLocation } from "@/types/weather"

const defaultSettings: UserSettings = {
  temperatureUnit: "celsius",
  theme: "dark",
  defaultLocation: "Karachi",
  savedLocations: [],
}

interface SettingsContextType {
  settings: UserSettings
  updateSettings: (settings: Partial<UserSettings>) => void
  addSavedLocation: (location: SavedLocation) => void
  removeSavedLocation: (id: string) => void
  updateSavedLocation: (location: SavedLocation) => void
  isLocationSaved: (name: string) => boolean
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings)
  const [isInitialized, setIsInitialized] = useState(false)
  const { theme: currentTheme, setTheme } = useTheme()

  // Load settings from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem("weatherAppSettings")
      if (savedSettings) {
        try {
          const parsedSettings = JSON.parse(savedSettings)
          setSettings(parsedSettings)
        } catch (e) {
          console.error("Failed to parse settings:", e)
        }
      }
      setIsInitialized(true)
    }
  }, [])

  // Sync theme with settings when initialized
  useEffect(() => {
    if (isInitialized && settings.theme !== currentTheme) {
      setTheme(settings.theme)
    }
  }, [isInitialized, settings.theme, currentTheme, setTheme])

  // Save settings to localStorage when they change
  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      localStorage.setItem("weatherAppSettings", JSON.stringify(settings))
    }
  }, [settings, isInitialized])

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings }
      return updated
    })
  }

  const addSavedLocation = (location: SavedLocation) => {
    setSettings((prev) => ({
      ...prev,
      savedLocations: [...prev.savedLocations.filter((loc) => loc.id !== location.id), location],
    }))
  }

  const removeSavedLocation = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      savedLocations: prev.savedLocations.filter((loc) => loc.id !== id),
    }))
  }

  const updateSavedLocation = (location: SavedLocation) => {
    setSettings((prev) => ({
      ...prev,
      savedLocations: prev.savedLocations.map((loc) => (loc.id === location.id ? location : loc)),
    }))
  }

  const isLocationSaved = (name: string) => {
    return settings.savedLocations.some((loc) => loc.name.toLowerCase() === name.toLowerCase())
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        addSavedLocation,
        removeSavedLocation,
        updateSavedLocation,
        isLocationSaved,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}

