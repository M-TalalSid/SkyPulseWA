"use client"

import { useEffect, useState } from "react"
import { X, Sun, Moon, Computer, Check, Bell, Droplets, Wind, MapPin, Heart, Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSettings } from "@/context/settings-context"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { settings, updateSettings, addSavedLocation, removeSavedLocation, updateSavedLocation } = useSettings()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("general")
  const [isAddLocationDialogOpen, setIsAddLocationDialogOpen] = useState(false)
  const [isEditLocationDialogOpen, setIsEditLocationDialogOpen] = useState(false)
  const [newLocationName, setNewLocationName] = useState("")
  const [editingLocation, setEditingLocation] = useState<{ id: string; name: string; isFavorite?: boolean } | null>(
    null,
  )

  // Wait for client-side hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleTemperatureUnitChange = (unit: "celsius" | "fahrenheit") => {
    updateSettings({ temperatureUnit: unit })
  }

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    updateSettings({ theme: newTheme })
    setTheme(newTheme)
  }

  const handleAddLocation = () => {
    if (newLocationName.trim()) {
      addSavedLocation({
        id: Date.now().toString(),
        name: newLocationName.trim(),
        isFavorite: false,
      })
      setNewLocationName("")
      setIsAddLocationDialogOpen(false)
    }
  }

  const handleUpdateLocation = () => {
    if (editingLocation && editingLocation.name.trim()) {
      updateSavedLocation({
        ...editingLocation,
        name: editingLocation.name.trim(),
      })
      setIsEditLocationDialogOpen(false)
      setEditingLocation(null)
    }
  }

  const handleEditLocation = (location: { id: string; name: string; isFavorite?: boolean }) => {
    setEditingLocation(location)
    setIsEditLocationDialogOpen(true)
  }

  const handleToggleFavorite = (location: { id: string; name: string; isFavorite?: boolean }) => {
    updateSavedLocation({
      ...location,
      isFavorite: !location.isFavorite,
    })
  }

  // Close panel when clicking outside or pressing escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  if (!mounted) {
    return null
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, type: "spring", damping: 20, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-gradient-to-b from-blue-900 to-blue-950 p-6 shadow-lg overflow-y-auto max-h-[90vh]"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Settings</h2>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-white/10 w-full mb-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="locations">Locations</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-white/80 mb-3">Temperature Unit</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="default"
                      onClick={() => handleTemperatureUnitChange("celsius")}
                      className={`flex justify-between items-center ${
                        settings.temperatureUnit === "celsius"
                          ? "bg-blue-700 border-blue-500 text-white"
                          : "bg-white/5 border-white/10 text-white"
                      }`}
                    >
                      <span>Celsius (°C)</span>
                      {settings.temperatureUnit === "celsius" && <Check className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="default"
                      onClick={() => handleTemperatureUnitChange("fahrenheit")}
                      className={`flex justify-between items-center ${
                        settings.temperatureUnit === "fahrenheit"
                          ? "bg-blue-700 border-blue-500 text-white"
                          : "bg-white/5 border-white/10 text-white"
                      }`}
                    >
                      <span>Fahrenheit (°F)</span>
                      {settings.temperatureUnit === "fahrenheit" && <Check className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-white/80 mb-3">Theme</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => handleThemeChange("light")}
                      className={`flex flex-col items-center py-3 h-auto ${
                        theme === "light"
                          ? "bg-blue-700 border-blue-500 text-white"
                          : "bg-white/5 border-white/10 text-white"
                      }`}
                    >
                      <Sun className="h-5 w-5 mb-1" />
                      <span>Light</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => handleThemeChange("dark")}
                      className={`flex flex-col items-center py-3 h-auto ${
                        theme === "dark"
                          ? "bg-blue-700 border-blue-500 text-white"
                          : "bg-white/5 border-white/10 text-white"
                      }`}
                    >
                      <Moon className="h-5 w-5 mb-1" />
                      <span>Dark</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => handleThemeChange("system")}
                      className={`flex flex-col items-center py-3 h-auto ${
                        theme === "system"
                          ? "bg-blue-700 border-blue-500 text-white"
                          : "bg-white/5 border-white/10 text-white"
                      }`}
                    >
                      <Computer className="h-5 w-5 mb-1" />
                      <span>System</span>
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-white/80 mb-3">Default Location</h3>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="default"
                      onClick={() => {
                        const newLocation = prompt("Enter default location:", settings.defaultLocation)
                        if (newLocation) updateSettings({ defaultLocation: newLocation })
                      }}
                      className="bg-white/5 border-white/10 text-white w-full justify-start"
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      {settings.defaultLocation || "Not set"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateSettings({ defaultLocation: "Karachi" })}
                      className="bg-white/5 border-white/10 text-white"
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="locations" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-white/80">Saved Locations</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/5 border-white/10 text-white"
                    onClick={() => setIsAddLocationDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {settings.savedLocations.length === 0 ? (
                    <div className="text-center py-4 text-white/60 text-sm">No saved locations yet</div>
                  ) : (
                    settings.savedLocations.map((location) => (
                      <div key={location.id} className="flex items-center justify-between bg-white/5 p-3 rounded-md">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-blue-300" />
                          <span className="text-sm">{location.name}</span>
                          {location.isFavorite && <Heart className="h-3 w-3 fill-red-400 text-red-400" />}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => handleToggleFavorite(location)}
                            title={location.isFavorite ? "Remove from favorites" : "Add to favorites"}
                          >
                            <Heart
                              className={`h-4 w-4 ${location.isFavorite ? "fill-red-400 text-red-400" : "text-white/60"}`}
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => handleEditLocation(location)}
                          >
                            <Edit className="h-4 w-4 text-white/60" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => removeSavedLocation(location.id)}
                          >
                            <Trash2 className="h-4 w-4 text-white/60" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-medium text-white/80 mb-2">Manage Favorites</h3>
                  <p className="text-xs text-white/60 mb-2">
                    Favorite locations appear at the top of your saved locations list and can be filtered separately.
                  </p>
                  <div className="bg-white/5 p-3 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-400" />
                        <span className="text-sm">Show favorites on startup</span>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-3">
                <h3 className="text-sm font-medium text-white/80 mb-2">Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-white/5 p-3 rounded-md">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-blue-300" />
                      <span className="text-sm">Weather Alerts</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between bg-white/5 p-3 rounded-md">
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-blue-300" />
                      <span className="text-sm">Rain Notifications</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between bg-white/5 p-3 rounded-md">
                    <div className="flex items-center gap-2">
                      <Wind className="h-4 w-4 text-blue-300" />
                      <span className="text-sm">Severe Weather</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="pt-4 border-t border-white/10 mt-6">
              <h3 className="text-sm font-medium text-white/80 mb-1">About</h3>
              <p className="text-xs text-white/60">
                SkyPulse v1.0.0
                <br />
                Data provided by WeatherAPI.com
                <br />
                Made By Talal Shoaib | All Rights Reserved
              </p>
            </div>
          </motion.div>
        </>
      )}

      {/* Add Location Dialog */}
      <Dialog open={isAddLocationDialogOpen} onOpenChange={setIsAddLocationDialogOpen}>
        <DialogContent className="bg-blue-900/90 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Add New Location</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter location name"
              value={newLocationName}
              onChange={(e) => setNewLocationName(e.target.value)}
              className="bg-white/10 border-white/20 text-white"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddLocation()
              }}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddLocationDialogOpen(false)}
              className="border-white/20 text-white"
            >
              Cancel
            </Button>
            <Button onClick={handleAddLocation} className="bg-blue-600 hover:bg-blue-700">
              Add Location
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Location Dialog */}
      <Dialog open={isEditLocationDialogOpen} onOpenChange={setIsEditLocationDialogOpen}>
        <DialogContent className="bg-blue-900/90 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Edit Location</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter location name"
              value={editingLocation?.name || ""}
              onChange={(e) => setEditingLocation((prev) => (prev ? { ...prev, name: e.target.value } : null))}
              className="bg-white/10 border-white/20 text-white"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleUpdateLocation()
              }}
            />
            <div className="flex items-center mt-4">
              <Button
                variant="outline"
                size="sm"
                className={`text-white border-white/20 ${editingLocation?.isFavorite ? "bg-white/20" : ""}`}
                onClick={() => setEditingLocation((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null))}
              >
                <Heart className={`mr-2 h-4 w-4 ${editingLocation?.isFavorite ? "fill-red-400 text-red-400" : ""}`} />
                {editingLocation?.isFavorite ? "Remove from favorites" : "Add to favorites"}
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditLocationDialogOpen(false)}
              className="border-white/20 text-white"
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateLocation} className="bg-blue-600 hover:bg-blue-700">
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AnimatePresence>
  )
}

