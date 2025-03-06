"use client"

import { Cloud, Zap } from "lucide-react"
import { motion } from "framer-motion"

export function AppLogo() {
  return (
    <motion.div
      className="flex items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <Cloud className="h-6 w-6 text-blue-300" />
        <motion.div
          className="absolute -right-1 -top-1"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          <Zap className="h-3 w-3 text-yellow-400" />
        </motion.div>
      </div>
      <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-400 font-['Montserrat',sans-serif]">
        SkyPulse
      </h1>
    </motion.div>
  )
}

