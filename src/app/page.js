"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Heart, Loader2, ArrowRight, Check, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"

// Define donation types with preset amounts
const donationTypes = [
  { id: "basic", name: "Basic Support", amount: 100, description: "Help us maintain our services" },
  { id: "standard", name: "Standard Support", amount: 500, description: "Fund our ongoing projects" },
  { id: "premium", name: "Premium Support", amount: 1000, description: "Make a significant impact" },
  { id: "custom", name: "Custom Amount", amount: "", description: "Choose your own amount" },
]

export default function Home() {
  const [step, setStep] = useState(1)
  const [selectedType, setSelectedType] = useState(null)
  const [data, setData] = useState({ name: "", mobile: "", amount: "" })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({ name: "", mobile: "", amount: "" })
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  // Handle theme mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const validateForm = () => {
    let valid = true
    const newErrors = { name: "", mobile: "", amount: "" }

    if (!data.name.trim()) {
      newErrors.name = "Name is required"
      valid = false
    } else if (data.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters"
      valid = false
    }

    if (!data.mobile.trim()) {
      newErrors.mobile = "Mobile number is required"
      valid = false
    } else if (!/^[0-9]{10}$/.test(data.mobile)) {
      newErrors.mobile = "Enter a valid 10-digit mobile number"
      valid = false
    }

    if (step === 1 && selectedType?.id === "custom" && (!data.amount || Number.parseFloat(data.amount) <= 0)) {
      newErrors.amount = "Please enter a valid amount"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleDonationTypeSelect = (type) => {
    if (type.id === "custom") {
      setSelectedType(type)
      setData({ ...data, amount: "" })
    } else {
      setSelectedType(type)
      setData({ ...data, amount: type.amount.toString() })
    }
  }

  const handleNextStep = () => setStep(2)

  const createCheckoutSession = async (e) => {
    e.preventDefault()
    // console.log("Creating checkout session with data:", data)
    if (!validateForm()) return

    setLoading(true)
    const payload = {
      ...data,
      MUID: "MUID" + Date.now(),
      transactionId: "T" + Date.now(),
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      const { url } = await res.json()

      if (res.status === 500) {
        console.error("Error:", res)
        setLoading(false)
        return
      }
      router.push(url)
    } catch (error) {
      console.error("Error:", error)
      setLoading(false)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 transition-colors duration-300">
      <div className="absolute top-4 right-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-full"
        >
          {theme === "dark" ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-slate-700" />}
        </Button>
      </div>

      <Card className="w-full max-w-md shadow-lg dark:bg-slate-800 dark:border-slate-700 transition-all duration-300">
        <CardHeader className="text-center space-y-1">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto bg-rose-100 dark:bg-rose-900 w-16 h-16 rounded-full flex items-center justify-center mb-2"
          >
            <Heart className="h-8 w-8 text-rose-500 dark:text-rose-400" />
          </motion.div>
          <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white">Donate Now</CardTitle>
          <CardDescription className="dark:text-slate-400">Your generosity makes a difference</CardDescription>

          <div className="flex justify-center mt-4">
            <div className="flex items-center space-x-1 bg-slate-200 dark:bg-slate-700 rounded-full p-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 1 ? "bg-rose-500 text-white" : "text-slate-500 dark:text-slate-400"}`}
              >
                1
              </div>
              <div className="w-8 text-center text-slate-500 dark:text-slate-400">→</div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 2 ? "bg-rose-500 text-white" : "text-slate-500 dark:text-slate-400"}`}
              >
                2
              </div>
            </div>
          </div>
        </CardHeader>

        {loading ? (
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-10 w-10 text-rose-500 animate-spin mb-4" />
            <p className="text-slate-600 dark:text-slate-300">Processing your donation...</p>
          </CardContent>
        ) : (
          <form onSubmit={createCheckoutSession}>
            <CardContent className="space-y-4">
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300">Select Donation Type</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {donationTypes.map((type) => (
                        <motion.div
                          key={type.id}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleDonationTypeSelect(type)}
                          className={`cursor-pointer rounded-lg p-3 border-2 ${
                            selectedType?.id === type.id
                              ? "border-rose-500 bg-rose-50 dark:bg-rose-900/30"
                              : "border-slate-200 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-700"
                          } transition-all duration-200`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="font-medium text-slate-800 dark:text-white">{type.name}</div>
                            {selectedType?.id === type.id && <Check className="h-4 w-4 text-rose-500" />}
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{type.description}</div>
                          {type.id !== "custom" && (
                            <div className="mt-2 text-lg font-bold text-rose-500 dark:text-rose-400">
                              ₹{type.amount}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>

                    {selectedType?.id === "custom" && (
                      <div className="space-y-2 mt-4">
                        <Label htmlFor="custom-amount">Enter Amount</Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <span className="text-slate-500 dark:text-slate-400">₹</span>
                          </div>
                          <Input
                            id="custom-amount"
                            type="number"
                            placeholder="Enter your donation amount"
                            value={data.amount}
                            onChange={(e) => setData({ ...data, amount: e.target.value })}
                            className="pl-8 focus:border-rose-500"
                          />
                        </div>
                        {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
                      </div>
                    )}

                    <Button
                      type="button"
                      onClick={handleNextStep}
                      disabled={!selectedType}
                      className="w-full bg-rose-500 hover:bg-rose-600 text-white dark:bg-rose-600 dark:hover:bg-rose-700 mt-4"
                    >
                      Continue <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300">Your Information</h3>
                      <div className="text-rose-500 dark:text-rose-400 font-bold">₹{data.amount}</div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        value={data.name}
                        onChange={(e) => setData({ ...data, name: e.target.value })}
                        className="focus:border-rose-500"
                      />
                      {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile Number</Label>
                      <Input
                        id="mobile"
                        type="tel"
                        placeholder="Enter your 10-digit mobile number"
                        value={data.mobile}
                        onChange={(e) => setData({ ...data, mobile: e.target.value })}
                        className="focus:border-rose-500"
                      />
                      {errors.mobile && <p className="text-sm text-red-500">{errors.mobile}</p>}
                    </div>

                    <div className="flex space-x-3 pt-2">
                      <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                        Back
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-rose-500 hover:bg-rose-600 text-white dark:bg-rose-600 dark:hover:bg-rose-700"
                        disabled={loading}
                      >
                        {loading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            Proceed to Payment <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </form>
        )}
      </Card>
    </div>
  )
}
