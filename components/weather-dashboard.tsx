"use client"

import { useState, useEffect, useCallback, useMemo, Suspense, lazy } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { CurrentWeather } from "@/components/current-weather"
import { WeatherDetails } from "@/components/weather-details"
import { TemperatureGraph } from "@/components/temperature-graph"
import { WeatherAlerts } from "@/components/weather-alerts"
import { SavedLocations } from "@/components/saved-locations"
import { GradientBackground } from "@/components/gradient-background"
import { StructuredData } from "@/components/structured-data"
import { ErrorBoundary } from "@/components/error-boundary"
import { useWeather } from "@/hooks/use-weather"
import { useSettings } from "@/context/settings-context"
import { Loader } from "@/components/ui/loader"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { WeatherFallback } from "@/components/weather-fallback"
import dynamic from "next/dynamic"

// Dynamically import components with lower priority
const AnimatedBackground = dynamic(
  () => import("@/components/animated-background").then((mod) => ({ default: mod.AnimatedBackground })),
  {
    ssr: false,
    loading: () => null,
  },
)

const HourlyForecast = dynamic(() =>
  import("@/components/hourly-forecast").then((mod) => ({ default: mod.HourlyForecast })),
)
const DailyForecast = dynamic(() =>
  import("@/components/daily-forecast").then((mod) => ({ default: mod.DailyForecast })),
)
const SunriseSunset = dynamic(() =>
  import("@/components/sunrise-sunset").then((mod) => ({ default: mod.SunriseSunset })),
)

// Lazy load tabs content for better initial load performance
const DetailsTabContent = lazy(() =>
  import("@/components/tabs/details-tab").then((mod) => ({ default: mod.DetailsTabContent })),
)
const WeatherImpactLazy = lazy(() =>
  import("@/components/weather-impact").then((mod) => ({ default: mod.WeatherImpact })),
)
const WeatherComparisonLazy = lazy(() =>
  import("@/components/weather-comparison").then((mod) => ({ default: mod.WeatherComparison })),
)

// Loading fallback for lazy components
const TabLoadingFallback = () => (
  <Card className="border-none bg-white/5 backdrop-blur-sm text-white shadow-md">
    <CardContent className="p-6 text-center">
      <Loader className="h-8 w-8 mx-auto mb-4" />
      <p>Loading content...</p>
    </CardContent>
  </Card>
)

export function WeatherDashboard() {
  const { settings } = useSettings()
  const [location, setLocation] = useState<string>(settings.defaultLocation || "Karachi")
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const { weatherData, isLoading, error } = useWeather(location, refreshTrigger)
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("forecast")
  const [isNight, setIsNight] = useState(false)
  const [compareLocation, setCompareLocation] = useState<string | null>(null)
  const [isAnimationsEnabled, setIsAnimationsEnabled] = useState(true)

  // Check device capabilities for performance optimizations
  useEffect(() => {
    const checkDeviceCapabilities = () => {
      setIsMobile(window.innerWidth < 768)

      // Disable animations on low-end devices or when on slow connections
      if ("connection" in navigator && (navigator as any).connection) {
        const connection = (navigator as any).connection
        if (connection.saveData || connection.effectiveType === "slow-2g" || connection.effectiveType === "2g") {
          setIsAnimationsEnabled(false)
        }
      }

      // Check if device is low-powered based on screen size and pixel ratio
      const isLowPoweredDevice = window.innerWidth * window.innerHeight * (window.devicePixelRatio || 1) < 1000000
      if (isLowPoweredDevice) {
        setIsAnimationsEnabled(false)
      }
    }

    checkDeviceCapabilities()
    window.addEventListener("resize", checkDeviceCapabilities)

    return () => {
      window.removeEventListener("resize", checkDeviceCapabilities)
    }
  }, [])

  // Update location when default location changes in settings
  useEffect(() => {
    if (settings.defaultLocation && settings.defaultLocation !== location) {
      setLocation(settings.defaultLocation)
    }
  }, [settings.defaultLocation, location])

  // Determine if it's night based on current time
  useEffect(() => {
    if (weatherData) {
      const currentHour = new Date().getHours()
      setIsNight(currentHour < 6 || currentHour > 18)
    }
  }, [weatherData])

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev)
  }, [])

  const handleRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1)
  }, [])

  const handleLocationChange = useCallback((newLocation: string) => {
    console.log("Location changed to:", newLocation) // Add logging
    setLocation(newLocation)
    setSidebarOpen(false) // Close sidebar on mobile after location change

    // Force a refresh of weather data when location changes
    setRefreshTrigger((prev) => prev + 1)
  }, [])

  // Forecast tab content - memoized to prevent unnecessary re-renders
  const ForecastTabContent = useMemo(() => {
    if (!weatherData) return null

    return (
      <div className="grid grid-cols-1 gap-4 lg:gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4 lg:space-y-6">
          <CurrentWeather data={weatherData.current} location={weatherData.location} />
          <WeatherDetails data={weatherData.current} />
          <Suspense fallback={<TabLoadingFallback />}>
            <HourlyForecast data={weatherData.hourly} />
            <TemperatureGraph data={weatherData.hourly} />
          </Suspense>
        </div>
        <div className="flex flex-col gap-4 lg:gap-6">
          <SavedLocations onLocationSelect={handleLocationChange} currentLocation={location} />
          <Suspense fallback={<TabLoadingFallback />}>
            <SunriseSunset data={weatherData.current} />
            <DailyForecast data={weatherData.daily} />
          </Suspense>
        </div>
      </div>
    )
  }, [weatherData, location, handleLocationChange])

  // Tabs content - memoized to prevent unnecessary re-renders
  const tabsContent = useMemo(() => {
    if (!weatherData) return null

    return (
      <Tabs defaultValue="forecast" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white/10 w-full justify-start overflow-x-auto">
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="impact">Impact</TabsTrigger>
          <TabsTrigger value="compare">Compare</TabsTrigger>
        </TabsList>

        <TabsContent value="forecast" className="mt-4">
          {ForecastTabContent}
        </TabsContent>

        <TabsContent value="details" className="mt-4">
          <Suspense fallback={<TabLoadingFallback />}>
            <DetailsTabContent weatherData={weatherData} location={location} onLocationSelect={handleLocationChange} />
          </Suspense>
        </TabsContent>

        <TabsContent value="impact" className="mt-4">
          <ErrorBoundary fallback={<p>Error loading weather impact data. Please try again later.</p>}>
            <Suspense fallback={<TabLoadingFallback />}>
              <WeatherImpactLazy weatherData={weatherData} location={location} />
            </Suspense>
          </ErrorBoundary>
        </TabsContent>

        <TabsContent value="compare" className="mt-4">
          <ErrorBoundary fallback={<p>Error loading comparison tools. Please try again later.</p>}>
            <Suspense fallback={<TabLoadingFallback />}>
              <WeatherComparisonLazy
                primaryLocation={location}
                secondaryLocation={compareLocation}
                onSecondaryLocationChange={setCompareLocation}
                weatherData={weatherData}
              />
            </Suspense>
          </ErrorBoundary>
        </TabsContent>
      </Tabs>
    )
  }, [activeTab, weatherData, location, compareLocation, handleLocationChange, ForecastTabContent])

  // Simplified animation variants based on device capabilities
  const contentAnimationVariants = isAnimationsEnabled
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.5 },
      }
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.3 },
      }

  return (
    <>
      {weatherData && (
        <StructuredData
          location={weatherData.location.name}
          temperature={weatherData.current.temp}
          condition={weatherData.current.condition}
          forecast={weatherData.daily}
        />
      )}

      <div className="flex h-screen overflow-hidden">
        {/* Dynamic background based on weather and time */}
        <GradientBackground weatherCondition={weatherData?.current.condition || "clear"} isNight={isNight} />

        {/* Only render animated background if animations are enabled */}
        {isAnimationsEnabled && (
          <AnimatedBackground weatherCondition={weatherData?.current.condition || "clear"} isNight={isNight} />
        )}

        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex flex-1 flex-col overflow-hidden relative z-10">
          <Header
            onMenuClick={toggleSidebar}
            onLocationChange={handleLocationChange}
            currentLocation={location}
            onRefresh={handleRefresh}
          />

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loader"
                className="flex h-full items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Loader className="h-8 w-8 text-primary" />
              </motion.div>
            ) : weatherData ? (
              <motion.main
                key="content"
                className="flex flex-1 flex-col overflow-y-auto p-3 md:p-4 lg:p-6"
                {...contentAnimationVariants}
              >
                {error && <WeatherFallback error={error} onRetry={handleRefresh} />}
                {weatherData.alerts && weatherData.alerts.length > 0 && <WeatherAlerts alerts={weatherData.alerts} />}

                <div className="mb-6">{tabsContent}</div>
              </motion.main>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}

