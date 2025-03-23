"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { motion } from "framer-motion"
import { Trash2, Plus, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

const invoiceItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  price: z.coerce.number().min(0, "Price must be at least 0"),
})

const formSchema = z.object({
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  date: z.string().min(1, "Date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  clientName: z.string().min(1, "Client name is required"),
  clientEmail: z.string().email("Invalid email address"),
  clientAddress: z.string().min(1, "Client address is required"),
  items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
  taxEnabled: z.boolean().default(false),
  taxRate: z.coerce.number().min(0, "Tax rate must be at least 0").max(100, "Tax rate cannot exceed 100").default(10),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function InvoiceForm({ onSubmit, initialData }: { onSubmit: (data: FormValues) => void; initialData: any }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  })

  const items = watch("items") || []

  const addItem = () => {
    setValue("items", [...items, { description: "", quantity: 1, price: 0 }])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setValue(
        "items",
        items.filter((_, i) => i !== index),
      )
    } else {
      toast({
        title: "Cannot remove item",
        description: "You need at least one item in the invoice",
        variant: "destructive",
      })
    }
  }

  const calculateTotal = () => {
    const subtotal = items.reduce((total, item) => total + (item.quantity || 0) * (item.price || 0), 0)
    const taxEnabled = watch("taxEnabled")
    const taxRate = watch("taxRate") || 0

    if (taxEnabled) {
      return subtotal + subtotal * (taxRate / 100)
    }

    return subtotal
  }

  const onFormSubmit = (data: FormValues) => {
    onSubmit(data)
  }

  return (
    <Card className="w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Create New Invoice</CardTitle>
        <CardDescription>Fill in the details to generate your invoice</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                placeholder="INV-001"
                {...register("invoiceNumber")}
                className={errors.invoiceNumber ? "border-red-500" : ""}
              />
              {errors.invoiceNumber && <p className="text-red-500 text-sm">{errors.invoiceNumber.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" {...register("date")} className={errors.date ? "border-red-500" : ""} />
              {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                {...register("dueDate")}
                className={errors.dueDate ? "border-red-500" : ""}
              />
              {errors.dueDate && <p className="text-red-500 text-sm">{errors.dueDate.message}</p>}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Client Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Client Name</Label>
                <Input
                  id="clientName"
                  placeholder="John Doe"
                  {...register("clientName")}
                  className={errors.clientName ? "border-red-500" : ""}
                />
                {errors.clientName && <p className="text-red-500 text-sm">{errors.clientName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientEmail">Client Email</Label>
                <Input
                  id="clientEmail"
                  placeholder="john@example.com"
                  {...register("clientEmail")}
                  className={errors.clientEmail ? "border-red-500" : ""}
                />
                {errors.clientEmail && <p className="text-red-500 text-sm">{errors.clientEmail.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientAddress">Client Address</Label>
              <Textarea
                id="clientAddress"
                placeholder="123 Main St, City, Country"
                {...register("clientAddress")}
                className={errors.clientAddress ? "border-red-500" : ""}
              />
              {errors.clientAddress && <p className="text-red-500 text-sm">{errors.clientAddress.message}</p>}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Invoice Items</h3>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="h-4 w-4 mr-2" /> Add Item
              </Button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-12 gap-2 items-end"
                >
                  <div className="col-span-6 space-y-2">
                    <Label htmlFor={`items.${index}.description`}>Description</Label>
                    <Input
                      id={`items.${index}.description`}
                      placeholder="Item description"
                      {...register(`items.${index}.description`)}
                      className={errors.items?.[index]?.description ? "border-red-500" : ""}
                    />
                    {errors.items?.[index]?.description && (
                      <p className="text-red-500 text-sm">{errors.items[index]?.description?.message}</p>
                    )}
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor={`items.${index}.quantity`}>Qty</Label>
                    <Input
                      id={`items.${index}.quantity`}
                      type="number"
                      min="1"
                      {...register(`items.${index}.quantity`)}
                      className={errors.items?.[index]?.quantity ? "border-red-500" : ""}
                    />
                    {errors.items?.[index]?.quantity && (
                      <p className="text-red-500 text-sm">{errors.items[index]?.quantity?.message}</p>
                    )}
                  </div>
                  <div className="col-span-3 space-y-2">
                    <Label htmlFor={`items.${index}.price`}>Price</Label>
                    <Input
                      id={`items.${index}.price`}
                      type="number"
                      min="0"
                      step="0.01"
                      {...register(`items.${index}.price`)}
                      className={errors.items?.[index]?.price ? "border-red-500" : ""}
                    />
                    {errors.items?.[index]?.price && (
                      <p className="text-red-500 text-sm">{errors.items[index]?.price?.message}</p>
                    )}
                  </div>
                  <div className="col-span-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-end">
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                <p className="text-right font-medium">
                  Total: <span className="text-lg">${calculateTotal().toFixed(2)}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Tax Settings</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="taxEnabled"
                  className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  {...register("taxEnabled")}
                />
                <Label htmlFor="taxEnabled">Apply Tax</Label>
              </div>

              {watch("taxEnabled") && (
                <div className="flex items-center space-x-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    className="w-20"
                    {...register("taxRate")}
                  />
                  {errors.taxRate && <p className="text-red-500 text-sm">{errors.taxRate.message}</p>}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" placeholder="Additional notes or payment instructions" {...register("notes")} />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" className="bg-green-700 hover:bg-green-600">
            <Save className="h-4 w-4 mr-2" /> Generate Invoice
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

