"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, X, Plus, Heart, Edit, MoreHorizontal } from "lucide-react"
import { useSettings } from "@/context/settings-context"
import { motion, AnimatePresence } from "framer-motion"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface SavedLocationsProps {
  onLocationSelect: (location: string) => void
  currentLocation: string
}

export function SavedLocations({ onLocationSelect, currentLocation }: SavedLocationsProps) {
  const { settings, addSavedLocation, removeSavedLocation, updateSavedLocation, isLocationSaved } = useSettings()
  const [isExpanded, setIsExpanded] = useState(false)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [newLocationName, setNewLocationName] = useState("")
  const [editingLocation, setEditingLocation] = useState<{ id: string; name: string; isFavorite?: boolean } | null>(
    null,
  )

  const handleSaveCurrentLocation = () => {
    if (!isLocationSaved(currentLocation)) {
      addSavedLocation({
        id: Date.now().toString(),
        name: currentLocation,
        isFavorite: false,
      })
    }
  }

  const handleRemoveLocation = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    removeSavedLocation(id)
  }

  const handleToggleFavorite = (e: React.MouseEvent, location: { id: string; name: string; isFavorite?: boolean }) => {
    e.stopPropagation()
    updateSavedLocation({
      ...location,
      isFavorite: !location.isFavorite,
    })
  }

  const handleEditLocation = (location: { id: string; name: string; isFavorite?: boolean }) => {
    setEditingLocation(location)
    setIsEditDialogOpen(true)
  }

  const handleAddLocation = () => {
    if (newLocationName.trim()) {
      addSavedLocation({
        id: Date.now().toString(),
        name: newLocationName.trim(),
        isFavorite: false,
      })
      setNewLocationName("")
      setIsAddDialogOpen(false)
    }
  }

  const handleUpdateLocation = () => {
    if (editingLocation && editingLocation.name.trim()) {
      updateSavedLocation({
        ...editingLocation,
        name: editingLocation.name.trim(),
      })
      setIsEditDialogOpen(false)
      setEditingLocation(null)
    }
  }

  const filteredLocations = showFavoritesOnly
    ? settings.savedLocations.filter((loc) => loc.isFavorite)
    : settings.savedLocations

  return (
    <Card className="border-none bg-blue-900/50 text-white shadow-none">
      <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between">
        <motion.h2
          className="text-lg font-semibold"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Saved Locations
        </motion.h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={`text-white/80 hover:text-white ${showFavoritesOnly ? "bg-white/10" : ""}`}
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            title={showFavoritesOnly ? "Show all locations" : "Show favorites only"}
          >
            <Heart className={`h-4 w-4 ${showFavoritesOnly ? "fill-red-400 text-red-400" : ""}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white/80 hover:text-white"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Less" : "More"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex gap-2">
            <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                className="w-full justify-start bg-white/5 border-white/10 hover:bg-white/10"
                onClick={handleSaveCurrentLocation}
                disabled={isLocationSaved(currentLocation)}
              >
                <Plus className="mr-2 h-4 w-4" />
                {isLocationSaved(currentLocation) ? "Current location saved" : "Save current location"}
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                className="bg-white/5 border-white/10 hover:bg-white/10"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>

          <AnimatePresence>
            {filteredLocations.slice(0, isExpanded ? undefined : 3).map((location, index) => (
              <motion.div
                key={location.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  className={`w-full justify-between bg-white/5 border-white/10 hover:bg-white/10 ${
                    currentLocation === location.name ? "border-blue-400 bg-blue-900/50" : ""
                  }`}
                  onClick={() => onLocationSelect(location.name)}
                >
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span className="truncate">{location.name}</span>
                    {location.isFavorite && <Heart className="ml-2 h-3 w-3 fill-red-400 text-red-400" />}
                  </div>
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-white/80 hover:text-white mr-1"
                      onClick={(e) => handleToggleFavorite(e, location)}
                      title={location.isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Heart className={`h-3 w-3 ${location.isFavorite ? "fill-red-400 text-red-400" : ""}`} />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-white/80 hover:text-white mr-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-blue-900/90 border-white/10 text-white">
                        <DropdownMenuItem
                          className="cursor-pointer hover:bg-white/10"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditLocation(location)
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer hover:bg-white/10 text-red-400"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveLocation(e, location.id)
                          }}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {/*<Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-white/80 hover:text-white"
                      onClick={(e) => handleRemoveLocation(e, location.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>*/}
                  </div>
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>

          {!isExpanded && filteredLocations.length > 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center text-sm text-white/60 mt-2"
            >
              +{filteredLocations.length - 3} more locations
            </motion.div>
          )}

          {filteredLocations.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center text-sm text-white/60 py-4"
            >
              {showFavoritesOnly ? "No favorite locations yet" : "No saved locations yet"}
            </motion.div>
          )}
        </div>
      </CardContent>

      {/* Add Location Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-white/20 text-white">
              Cancel
            </Button>
            <Button onClick={handleAddLocation} className="bg-blue-600 hover:bg-blue-700">
              Add Location
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Location Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
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
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="border-white/20 text-white">
              Cancel
            </Button>
            <Button onClick={handleUpdateLocation} className="bg-blue-600 hover:bg-blue-700">
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

