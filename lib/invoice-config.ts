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

export const INVOICE_TEMPLATE_STORAGE_KEY = "invoice-template:v1"

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
