export const appConfig = {
  appName: "Universal Invoice Generator",
  appTagline: "Create professional invoices in seconds",
  description: "Create and export invoices quickly with customizable business and currency settings.",
  defaults: {
    senderName: "Your Business Name",
    senderEmail: "you@example.com",
    senderAddress: "Business address",
    currencyCode: "USD",
    locale: "en-US",
    taxRate: 10,
  },
}

export const APP_SETTINGS_STORAGE_KEY = "invoice-app-settings:v1"
export const INVOICE_TEMPLATE_STORAGE_KEY = "invoice-template:v1"

export type AppSettings = {
  appName: string
  appTagline: string
  locale: string
  footerMessage: string
}

export const defaultAppSettings: AppSettings = {
  appName: appConfig.appName,
  appTagline: appConfig.appTagline,
  locale: appConfig.defaults.locale,
  footerMessage: "Thank you for your business!",
}

export type InvoiceItem = {
  description: string
  quantity: number
  price: number
}

export type InvoiceData = {
  invoiceNumber: string
  date: string
  dueDate: string
  senderName: string
  senderEmail: string
  senderAddress: string
  clientName: string
  clientEmail: string
  clientAddress: string
  currencyCode: string
  items: InvoiceItem[]
  taxEnabled: boolean
  taxRate: number
  notes?: string
}

export function formatCurrency(value: number, currencyCode: string, locale = appConfig.defaults.locale): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 2,
    }).format(value)
  } catch {
    return `${value.toFixed(2)} ${currencyCode}`
  }
}
