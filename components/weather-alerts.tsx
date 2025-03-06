"use client"

import { useState } from "react"
import { AlertTriangle, X, ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { WeatherAlert } from "@/types/weather"
import { motion, AnimatePresence } from "framer-motion"

interface WeatherAlertsProps {
  alerts: WeatherAlert[]
}

export function WeatherAlerts({ alerts }: WeatherAlertsProps) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [dismissed, setDismissed] = useState<string[]>([])

  if (!alerts || alerts.length === 0 || dismissed.length === alerts.length) {
    return null
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "extreme":
        return "bg-red-600"
      case "severe":
        return "bg-orange-600"
      case "moderate":
        return "bg-yellow-600"
      default:
        return "bg-blue-600"
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleString()
    } catch (e) {
      return dateString
    }
  }

  const handleDismiss = (title: string) => {
    setDismissed((prev) => [...prev, title])
  }

  const visibleAlerts = alerts.filter((alert) => !dismissed.includes(alert.title))

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <Card className="border-none bg-transparent text-white shadow-none overflow-hidden">
        <CardContent className="p-0">
          <AnimatePresence initial={false}>
            {visibleAlerts.map((alert, index) => (
              <motion.div
                key={alert.title}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-2 overflow-hidden"
              >
                <div className={`rounded-md ${getSeverityColor(alert.severity)} p-4`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <AlertTriangle className="mr-2 h-5 w-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold">{alert.title}</h3>
                        <p className="text-xs opacity-80">
                          {alert.type} • Valid until {formatDate(alert.expires)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-white"
                        onClick={() => setExpanded(expanded === alert.title ? null : alert.title)}
                      >
                        {expanded === alert.title ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-white"
                        onClick={() => handleDismiss(alert.title)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expanded === alert.title && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-2"
                      >
                        <p className="text-sm">{alert.description}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}

