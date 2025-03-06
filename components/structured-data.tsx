import Script from "next/script"

interface StructuredDataProps {
  location: string
  temperature: number
  condition: string
  forecast: Array<{
    date: string
    highTemp: number
    lowTemp: number
    condition: string
  }>
}

export function StructuredData({ location, temperature, condition, forecast }: StructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "SkyPulse Weather",
    applicationCategory: "WeatherApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1024",
    },
    mainEntity: {
      "@type": "LocalBusiness",
      name: location,
      address: {
        "@type": "PostalAddress",
        addressLocality: location,
      },
    },
    potentialAction: {
      "@type": "ViewAction",
      target: `https://skypulse-weather.vercel.app/forecast/${encodeURIComponent(location)}`,
    },
    additionalProperty: {
      "@type": "PropertyValue",
      name: "Weather Data",
      value: {
        "@type": "WeatherForecast",
        temperature: {
          "@type": "QuantitativeValue",
          value: temperature,
          unitCode: "CEL",
        },
        description: condition,
        forecast: forecast.map((day) => ({
          "@type": "DayOfWeek",
          name: new Date(day.date).toLocaleDateString("en-US", { weekday: "long" }),
          temperature: {
            "@type": "QuantitativeValue",
            minValue: day.lowTemp,
            maxValue: day.highTemp,
            unitCode: "CEL",
          },
          description: day.condition,
        })),
      },
    },
  }

  return (
    <Script id="structured-data" type="application/ld+json" strategy="afterInteractive">
      {JSON.stringify(structuredData)}
    </Script>
  )
}

