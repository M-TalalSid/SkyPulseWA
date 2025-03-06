"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"

interface WeatherFallbackProps {
  error: Error | null
  onRetry: () => void
}

export function WeatherFallback({ error, onRetry }: WeatherFallbackProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto mt-8"
    >
      <Card className="border-none bg-white/5 backdrop-blur-sm text-white shadow-md">
        <CardHeader className="flex flex-row items-center gap-2 pb-2">
          <AlertTriangle className="h-5 w-5 text-yellow-400" />
          <h2 className="text-lg font-semibold">Weather Data Unavailable</h2>
        </CardHeader>
        <CardContent className="pt-2">
          <p className="mb-4">{error?.message || "We're having trouble connecting to the weather service."}</p>
          <p className="mb-4 text-sm text-white/70">
            Don't worry! We're showing you estimated weather data while we try to reconnect.
          </p>
          <div className="flex justify-between items-center">
            <p className="text-xs text-white/60">This is simulated data and may not reflect actual conditions.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="bg-white/10 border-white/20 hover:bg-white/20"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

