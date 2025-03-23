"use client"
import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, FileImage, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/loading-spinner"
import { toast } from "@/components/ui/use-toast"
import html2canvas from "html2canvas"

export function InvoicePreview({ invoiceData, onBack }: { invoiceData: any; onBack: () => void }) {
  const [isExporting, setIsExporting] = useState(false)
  const invoiceRef = useRef<HTMLDivElement>(null)

  const captureInvoice = async () => {
    if (!invoiceRef.current) return null

    try {
      const invoice = invoiceRef.current
      const canvas = await html2canvas(invoice, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: "#ffffff",
      })
      return canvas
    } catch (error) {
      console.error("Error capturing invoice:", error)
      return null
    }
  }

  // Helper function to convert dataURL to Blob
  const dataURLToBlob = (dataURL: string): Blob => {
    const parts = dataURL.split(";base64,")
    const contentType = parts[0].split(":")[1]
    const raw = window.atob(parts[1])
    const rawLength = raw.length
    const uInt8Array = new Uint8Array(rawLength)

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i)
    }

    return new Blob([uInt8Array], { type: contentType })
  }

  const handleExportImage = async () => {
    setIsExporting(true)

    try {
      const canvas = await captureInvoice()
      if (!canvas) {
        throw new Error("Failed to capture invoice")
      }

      // Download as image - improved approach
      const dataUrl = canvas.toDataURL("image/png")
      const url = URL.createObjectURL(dataURLToBlob(dataUrl))

      // Create and trigger download
      const link = document.createElement("a")
      link.href = url
      link.download = `Invoice-${invoiceData.invoiceNumber}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast({
        title: "Success!",
        description: "Invoice image has been downloaded",
        duration: 3000,
      })
    } catch (error) {
      console.error(`Error generating image:`, error)
      toast({
        title: "Error",
        description: `Failed to generate image. Please try again.`,
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsExporting(false)
    }
  }

  const calculateSubtotal = () => {
    return invoiceData.items.reduce((total: number, item: any) => total + item.quantity * item.price, 0)
  }

  const calculateTax = () => {
    if (!invoiceData.taxEnabled) return 0
    return calculateSubtotal() * (invoiceData.taxRate / 100)
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Edit
        </Button>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => window.print()} className="flex items-center gap-2">
            <Printer className="h-4 w-4" /> Print
          </Button>
          <Button
            onClick={handleExportImage}
            disabled={isExporting}
            className="bg-green-700 hover:bg-green-600 flex items-center gap-2"
          >
            {isExporting ? <LoadingSpinner size="sm" /> : <FileImage className="h-4 w-4" />}
            {isExporting ? "Exporting..." : "Save as Image"}
          </Button>
        </div>
      </div>

      <Card className="w-full bg-white dark:bg-gray-900 shadow-lg overflow-hidden" ref={invoiceRef}>
        {/* Header with gradient accent */}
        <div className="h-2 bg-gradient-to-r from-green-500 to-green-700"></div>

        <CardHeader className="border-b pt-6">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div>
              <CardTitle className="text-3xl font-bold text-green-700 dark:text-green-500 mb-1">INVOICE</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-2 py-0.5 rounded">
                  #{invoiceData.invoiceNumber}
                </span>
                <span className="text-sm text-gray-500">Issued: {new Date(invoiceData.date).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="text-right">
              <h3 className="font-bold text-xl">CF LLC</h3>
              <p className="text-sm text-gray-500">cooperfeatherstonellc@gmail.com</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-8 pt-8">
          {/* Client and Invoice Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wider mb-3">
                Bill To:
              </h3>
              <p className="font-medium text-lg">{invoiceData.clientName}</p>
              <p className="text-gray-600 dark:text-gray-400">{invoiceData.clientEmail}</p>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">{invoiceData.clientAddress}</p>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wider mb-3">
                  Payment Details
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-600 dark:text-gray-400">Invoice Number:</div>
                  <div className="font-medium text-right">{invoiceData.invoiceNumber}</div>

                  <div className="text-gray-600 dark:text-gray-400">Issue Date:</div>
                  <div className="font-medium text-right">{invoiceData.date}</div>

                  <div className="text-gray-600 dark:text-gray-400">Due Date:</div>
                  <div className="font-medium text-right">{invoiceData.dueDate}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="mt-8">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-t-lg py-3 px-4">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wider">
                Invoice Items
              </h3>
            </div>
            <div className="border dark:border-gray-700 rounded-b-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-100 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {invoiceData.items.map((item: any, index: number) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">{item.description}</td>
                      <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200 text-right">{item.quantity}</td>
                      <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200 text-right">
                        ${Number(item.price).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200 text-right font-medium">
                        ${(item.quantity * item.price).toFixed(2)}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="mt-6">
            <div className="flex justify-end">
              <div className="w-64 space-y-3 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                  <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                </div>
                {invoiceData.taxEnabled && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Tax ({invoiceData.taxRate}%):</span>
                    <span className="font-medium">${calculateTax().toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t dark:border-gray-700 pt-3 mt-3">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold text-lg text-green-700 dark:text-green-500">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoiceData.notes && (
            <div className="mt-8 border dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wider mb-2">
                Notes:
              </h3>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">{invoiceData.notes}</p>
            </div>
          )}
        </CardContent>

        <CardFooter className="border-t text-center py-6 bg-gray-50 dark:bg-gray-800/30">
          <div className="w-full">
            <p className="text-gray-500 mb-2">Thank you for your business!</p>
            <div className="h-1 w-24 bg-green-500 mx-auto rounded-full"></div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

