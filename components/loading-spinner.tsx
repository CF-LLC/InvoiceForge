"use client"
import { motion } from "framer-motion"

type SpinnerSize = "sm" | "md" | "lg"

export function LoadingSpinner({
  size = "md",
  message = "Processing...",
}: {
  size?: SpinnerSize
  message?: string
}) {
  const sizeClasses = {
    sm: "h-5 w-5",
    md: "h-10 w-10",
    lg: "h-16 w-16",
  }

  const dotSize = {
    sm: "h-1.5 w-1.5",
    md: "h-3 w-3",
    lg: "h-4 w-4",
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`relative ${sizeClasses[size]}`}>
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute ${dotSize[size]} rounded-full bg-green-500`}
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
            style={{
              top: `${50 - 40 * Math.sin((i * Math.PI) / 4)}%`,
              left: `${50 - 40 * Math.cos((i * Math.PI) / 4)}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </div>
      <motion.p
        className="mt-4 text-green-500 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {message}
      </motion.p>
    </div>
  )
}

