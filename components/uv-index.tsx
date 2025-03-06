"use client"

import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

interface UVIndexProps {
  uvIndex: number
}

export function UVIndex({ uvIndex }: UVIndexProps) {
  const getUVDescription = (uv: number): string => {
    if (uv <= 2) return "Low"
    if (uv <= 5) return "Moderate"
    if (uv <= 7) return "High"
    if (uv <= 10) return "Very High"
    return "Extreme"
  }

  const getUVColor = (uv: number): string => {
    if (uv <= 2) return "bg-green-500"
    if (uv <= 5) return "bg-yellow-500"
    if (uv <= 7) return "bg-orange-500"
    if (uv <= 10) return "bg-red-500"
    return "bg-purple-500"
  }

  const getUVRecommendation = (uv: number): string => {
    if (uv <= 2) return "No protection needed for most people."
    if (uv <= 5) return "Wear sunscreen and sunglasses on bright days."
    if (uv <= 7) return "Cover up, wear sunscreen and seek shade during midday hours."
    if (uv <= 10) return "Minimize sun exposure between 10 AM and 4 PM. Use SPF 30+ sunscreen."
    return "Avoid being outside during midday hours. SPF 30+ sunscreen essential."
  }

  const percentage = Math.min(100, (uvIndex / 11) * 100)

  return (
    <Card className="border-none bg-white/5 text-white shadow-none p-3">
      <CardContent className="p-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm">UV Index</span>
          <span className="text-sm font-medium">{getUVDescription(uvIndex)}</span>
        </div>

        <div className="relative h-3 w-full bg-white/10 rounded-full overflow-hidden mb-2">
          <motion.div
            className={`h-full ${getUVColor(uvIndex)}`}
            style={{ width: `${percentage}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>

        <div className="flex justify-between text-xs text-white/60 mb-2">
          <span>0</span>
          <span>3</span>
          <span>6</span>
          <span>9</span>
          <span>11+</span>
        </div>

        <div className="text-xs text-white/80">{getUVRecommendation(uvIndex)}</div>
      </CardContent>
    </Card>
  )
}

