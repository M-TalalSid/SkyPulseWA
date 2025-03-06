"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface WeatherMapProps {
  location: string
}

export function WeatherMap({ location }: WeatherMapProps) {
  // Create a Google Maps static image URL with the location
  const encodedLocation = encodeURIComponent(location)
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${encodedLocation}&zoom=10&size=600x400&maptype=roadmap&markers=color:red%7C${encodedLocation}&key=`

  return (
    <Card className="border-none bg-blue-900/50 text-white shadow-none" id="maps">
      <CardContent className="relative p-0">
        <motion.div
          className="relative h-48 w-full overflow-hidden rounded-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Since we don't have a Google Maps API key, we'll use a placeholder */}
          <div className="absolute inset-0 flex items-center justify-center bg-blue-800/50 text-center text-sm">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p>Weather Map for {location}</p>
              <p className="mt-2 text-xs text-white/60">
                (A real implementation would use Google Maps or a weather map service)
              </p>
            </motion.div>
          </div>

          {/* Map markers would be placed here in a real implementation */}
        </motion.div>

        <motion.div
          className="absolute bottom-2 left-2 rounded-md bg-black/50 p-2 text-xs"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          No precipitation for at least 2 hours.
        </motion.div>

        <motion.div
          className="absolute bottom-2 right-2"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button variant="outline" size="sm" className="bg-black/50 text-xs text-white hover:bg-black/70">
            Open Map
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  )
}

