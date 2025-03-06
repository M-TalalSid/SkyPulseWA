"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, MapPin, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface LocationSearchProps {
  onLocationSelect: (location: string) => void
  currentLocation: string
}

// Mock location suggestions - in a real app, these would come from an API
const getSuggestions = (query: string) => {
  const cities = [
    "New York, USA",
    "London, UK",
    "Tokyo, Japan",
    "Paris, France",
    "Sydney, Australia",
    "Berlin, Germany",
    "Toronto, Canada",
    "Mumbai, India",
    "Dubai, UAE",
    "Singapore",
    "Hong Kong",
    "Los Angeles, USA",
    "Chicago, USA",
    "Madrid, Spain",
    "Rome, Italy",
  ]

  if (!query) return []

  return cities.filter((city) => city.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
}

export function LocationSearch({ onLocationSelect, currentLocation }: LocationSearchProps) {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (query) {
      setSuggestions(getSuggestions(query))
    } else {
      setSuggestions([])
    }
  }, [query])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onLocationSelect(query.trim())
      setQuery("")
      setSuggestions([])
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    onLocationSelect(suggestion)
    setQuery("")
    setSuggestions([])
    setIsFocused(false)
  }

  const handleClearInput = () => {
    setQuery("")
    setSuggestions([])
    inputRef.current?.focus()
  }

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          placeholder="Search for location"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="w-full rounded-full bg-background/10 pl-10 pr-10 text-white placeholder:text-white/60"
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-white/60"
            onClick={handleClearInput}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </form>

      <AnimatePresence>
        {isFocused && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 top-full z-10 mt-1 rounded-md bg-blue-900/90 shadow-lg backdrop-blur-sm"
          >
            <ul className="py-1">
              {suggestions.map((suggestion, index) => (
                <motion.li
                  key={suggestion}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <button
                    type="button"
                    className="flex w-full items-center px-3 py-2 text-left text-sm text-white hover:bg-white/10"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <MapPin className="mr-2 h-4 w-4 text-white/60" />
                    {suggestion}
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

