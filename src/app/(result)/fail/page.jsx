"use client"

import { motion } from "framer-motion"
import { XCircle, RefreshCw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function FailurePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 transition-colors duration-300">
      <Card className="w-full max-w-md shadow-lg dark:bg-slate-800 dark:border-slate-700 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-red-500" />

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
            className="mx-auto bg-red-100 dark:bg-red-900/30 w-24 h-24 rounded-full flex items-center justify-center mb-6"
          >
            <XCircle className="h-12 w-12 text-red-500 dark:text-red-400" />
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
            <CardTitle className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Payment Failed</CardTitle>
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
              <p className="text-lg">Your donation was not processed.</p>
              <p>We encountered an issue while processing your payment. No charges were made to your account.</p>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900 rounded-lg p-4 mt-6">
              <div className="text-sm text-slate-600 dark:text-slate-400">
                <p className="font-medium mb-1">Possible reasons:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <motion.li
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    Insufficient funds
                  </motion.li>
                  <motion.li
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    Payment gateway error
                  </motion.li>
                  <motion.li
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.0 }}
                  >
                    Connection timeout
                  </motion.li>
                </ul>
              </div>
            </div>
          </motion.div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="w-full"
          >
            <Link href="/" className="w-full">
              <Button className="w-full bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="w-full"
          >
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full">
                <Home className="mr-2 h-4 w-4" />
                Return Home
              </Button>
            </Link>
          </motion.div>
        </CardFooter>
      </Card>
    </div>
  )
}
