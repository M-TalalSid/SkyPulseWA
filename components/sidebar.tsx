"use client"

import { Home, Clock, Info, Map, BarChart2, TrendingUp, X } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Clock, label: "Hourly", href: "#hourly" },
    { icon: Info, label: "Details", href: "#details" },
    { icon: Map, label: "Maps", href: "#maps" },
    { icon: BarChart2, label: "Monthly", href: "#monthly" },
    { icon: TrendingUp, label: "Trends", href: "#trends" },
  ]

  return (
    <motion.div
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-16 flex-shrink-0 flex-col bg-blue-950/80 transition-transform duration-200 md:relative md:flex md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
      )}
      initial={{ x: -64 }}
      animate={{ x: isOpen ? 0 : -64 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex h-16 items-center justify-end p-2 md:hidden">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <nav className="flex flex-1 flex-col items-center gap-4 p-2">
        {navItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Link
              href={item.href}
              className="flex flex-col items-center justify-center rounded-md p-2 text-xs text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <item.icon className="mb-1 h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          </motion.div>
        ))}
      </nav>
    </motion.div>
  )
}

