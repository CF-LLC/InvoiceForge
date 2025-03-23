"use client"
import { motion } from "framer-motion"
import { Check } from "lucide-react"

export function SuccessAnimation() {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.1,
        }}
        className="rounded-full bg-green-100 p-2 mb-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.3,
          }}
          className="rounded-full bg-green-500 p-3"
        >
          <Check className="h-8 w-8 text-white" />
        </motion.div>
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-xl font-bold text-green-700 dark:text-green-500 mb-2"
      >
        PDF Generated Successfully!
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-gray-600 dark:text-gray-400 text-center max-w-xs"
      >
        Your invoice has been converted to PDF and is ready to download.
      </motion.p>
    </div>
  )
}

