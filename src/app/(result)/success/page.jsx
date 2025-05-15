"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { CheckCircle, Home, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import confetti from "canvas-confetti"

export default function SuccessPage() {
  useEffect(() => {
    // Trigger confetti animation on page load
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      // Since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    }, 250)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 transition-colors duration-300">
      <Card className="w-full max-w-md shadow-lg dark:bg-slate-800 dark:border-slate-700 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-green-500" />

        <CardHeader className="text-center pb-2">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2,
            }}
            className="mx-auto bg-green-100 dark:bg-green-900/30 w-24 h-24 rounded-full flex items-center justify-center mb-6"
          >
            <CheckCircle className="h-12 w-12 text-green-500 dark:text-green-400" />
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
            <CardTitle className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Thank You!</CardTitle>
          </motion.div>
        </CardHeader>

        <CardContent>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <div className="text-center text-slate-600 dark:text-slate-300 space-y-2">
              <p className="text-lg">Your donation was successful.</p>
              <p>Your generosity will make a real difference. We've sent a receipt to your email.</p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900 rounded-lg p-4 mt-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Transaction ID</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  #{Math.random().toString(36).substring(2, 10).toUpperCase()}
                </span>
              </div>
            </div>
          </motion.div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="w-full"
          >
            <Link href="/" className="w-full">
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700">
                <Home className="mr-2 h-4 w-4" />
                Return Home
              </Button>
            </Link>
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1 }}>
            <Link
              href="/"
              className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 flex items-center justify-center"
            >
              <ArrowLeft className="mr-1 h-3 w-3" />
              Make another donation
            </Link>
          </motion.div>
        </CardFooter>
      </Card>
    </div>
  )
}
    