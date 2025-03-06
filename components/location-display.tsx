"use client"

import { MapPin } from "lucide-react"
// import { motion, AnimatePresence } from "framer-motion" //Removed as per update

interface LocationDisplayProps {
  location: string
}

export function LocationDisplay({ location }: LocationDisplayProps) {
  return (
    <>
      <MapPin className="h-4 w-4 text-blue-300" />
      <span className="text-sm font-medium">{location}</span>
    </>
  )
}

