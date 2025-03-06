"use client"

import { useState } from "react"
import { Menu, RefreshCw, Star, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LocationSearch } from "@/components/location-search"
import { SettingsPanel } from "@/components/settings-panel"
import { useSettings } from "@/context/settings-context"
import { motion } from "framer-motion"
import { AppLogo } from "./app-logo"

interface HeaderProps {
  onMenuClick: () => void
  onLocationChange: (location: string) => void
  currentLocation: string
  onRefresh: () => void
}

export function Header({ onMenuClick, onLocationChange, currentLocation, onRefresh }: HeaderProps) {
  const { isLocationSaved, addSavedLocation, removeSavedLocation, settings } = useSettings()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const isSaved = isLocationSaved(currentLocation)

  const handleToggleSave = () => {
    if (isSaved) {
      // Find the location ID to remove
      const locationToRemove = settings.savedLocations.find(
        (loc) => loc.name.toLowerCase() === currentLocation.toLowerCase(),
      )
      if (locationToRemove) {
        removeSavedLocation(locationToRemove.id)
      }
    } else {
      addSavedLocation({
        id: Date.now().toString(),
        name: currentLocation,
        isFavorite: false,
      })
    }
  }

  return (
    <motion.header
      className="flex h-16 items-center justify-between border-b border-white/10 bg-black/20 backdrop-blur-md px-4 z-20"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="mr-2 md:hidden text-white">
          <Menu className="h-5 w-5" />
        </Button>
        <AppLogo />
      </div>

      <motion.div
        className="relative ml-auto mr-4 hidden md:block w-64"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <LocationSearch onLocationSelect={onLocationChange} currentLocation={currentLocation} />
      </motion.div>

      <div className="flex items-center gap-2">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={onRefresh}
            className="text-white hover:bg-white/10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <RefreshCw className="h-5 w-5" />
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleSave}
            className="text-white hover:bg-white/10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={isSaved ? "Remove from saved locations" : "Save location"}
          >
            <Star className={`h-5 w-5 ${isSaved ? "fill-yellow-400 text-yellow-400" : ""}`} />
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSettingsOpen(true)}
            className="text-white hover:bg-white/10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </motion.div>
      </div>

      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </motion.header>
  )
}

