"use client"
import { useEffect, useState } from "react"
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect"
import { InvoiceForm } from "@/components/invoice-form"
import { InvoicePreview } from "@/components/invoice-preview"
import { LoadingSpinner } from "@/components/loading-spinner"
import { motion, AnimatePresence } from "framer-motion"
import {
  APP_SETTINGS_STORAGE_KEY,
  appConfig,
  defaultAppSettings,
  type AppSettings,
  type InvoiceData,
} from "@/lib/invoice-config"

export default function InvoiceGeneratorApp() {
  const [isLoading, setIsLoading] = useState(false)
  const [currentView, setCurrentView] = useState<"form" | "preview">("form")
  const [loadingMessage, setLoadingMessage] = useState("Processing...")
  const [appSettings, setAppSettings] = useState<AppSettings>(defaultAppSettings)
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: "",
    date: "",
    dueDate: "",
    senderName: appConfig.defaults.senderName,
    senderEmail: appConfig.defaults.senderEmail,
    senderAddress: appConfig.defaults.senderAddress,
    clientName: "",
    clientEmail: "",
    clientAddress: "",
    currencyCode: appConfig.defaults.currencyCode,
    items: [{ description: "", quantity: 1, price: 0 }],
    taxEnabled: false,
    taxRate: appConfig.defaults.taxRate,
    notes: "",
  })

  const handleFormSubmit = (data: InvoiceData) => {
    setIsLoading(true)
    setLoadingMessage("Generating invoice...")
    // Simulate API call
    setTimeout(() => {
      setInvoiceData(data)
      setCurrentView("preview")
      setIsLoading(false)
    }, 1500)
  }

  const handleBack = () => {
    setCurrentView("form")
  }

  useEffect(() => {
    try {
      const saved = localStorage.getItem(APP_SETTINGS_STORAGE_KEY)
      if (!saved) return
      const parsed = JSON.parse(saved) as AppSettings
      setAppSettings({ ...defaultAppSettings, ...parsed })
    } catch (error) {
      console.error("Failed to load app settings:", error)
    }
  }, [])

  const handleSettingsChange = (settings: AppSettings) => {
    setAppSettings(settings)
    localStorage.setItem(APP_SETTINGS_STORAGE_KEY, JSON.stringify(settings))
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Canvas Reveal Effect Background */}
      <div className="absolute inset-0">
        <CanvasRevealEffect
          animationSpeed={2}
          containerClassName="bg-black"
          colors={[
            [0, 180, 0], // Brighter green
            [0, 220, 0], // Even brighter green
            [100, 255, 100], // Light green
          ]}
          dotSize={3}
          opacities={[0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1]}
        />
        {/* Overlay gradient for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
      </div>

      {/* App Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">{appSettings.appName}</h1>
          <p className="mt-3 text-xl text-gray-300 max-w-2xl mx-auto">{appSettings.appTagline}</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center h-[600px]"
            >
              <LoadingSpinner message={loadingMessage} />
            </motion.div>
          ) : currentView === "form" ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <InvoiceForm
                onSubmit={handleFormSubmit}
                initialData={invoiceData}
                appSettings={appSettings}
                onSettingsChange={handleSettingsChange}
              />
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <InvoicePreview invoiceData={invoiceData} appSettings={appSettings} onBack={handleBack} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

