export interface WeatherLocation {
  name: string
  region: string
  country: string
  lat?: number
  lon?: number
  localtime?: string
  timezone?: string
}

export interface WeatherAlert {
  title: string
  severity: "minor" | "moderate" | "severe" | "extreme"
  description: string
  effective: string
  expires: string
  type: string
}

export interface AirQualityData {
  index: number
  co: number
  no2: number
  o3: number
  so2: number
  pm2_5: number
  pm10: number
  description: string
}

export interface CurrentWeatherData {
  temp: number
  feelsLike: number
  condition: string
  time: string
  highTemp: number
  lowTemp?: number
  wind: number
  windDir?: string
  windGust?: number
  humidity: number
  visibility: number
  pressure: number
  dewPoint: number
  airQuality: number
  airQualityData?: AirQualityData
  uvIndex?: number
  sunrise: string
  sunset: string
  moonPhase?: string
  chanceOfRain?: number
  precipMm?: number
  icon?: string
}

export interface HourlyWeatherData {
  time: string
  temp: number
  condition: string
  icon?: string
  chanceOfRain?: number
  precipMm?: number
  windSpeed?: number
  windDir?: string
  humidity?: number
  feelsLike?: number
  uvIndex?: number
}

export interface DailyWeatherData {
  date: string | Date
  highTemp: number
  lowTemp: number
  condition: string
  icon?: string
  chanceOfRain?: number
  precipMm?: number
  sunrise?: string
  sunset?: string
  moonPhase?: string
  uvIndex?: number
  humidity?: number
  windSpeed?: number
}

export interface WeatherData {
  location: WeatherLocation
  current: CurrentWeatherData
  hourly: HourlyWeatherData[]
  daily: DailyWeatherData[]
  alerts?: WeatherAlert[]
}

export interface SavedLocation {
  id: string
  name: string
  region?: string
  country?: string
  isFavorite?: boolean
}

export interface UserSettings {
  temperatureUnit: "celsius" | "fahrenheit"
  theme: "light" | "dark" | "system"
  defaultLocation: string
  savedLocations: SavedLocation[]
}

