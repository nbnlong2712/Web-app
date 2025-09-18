'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="glass max-w-md w-full rounded-2xl p-8 space-y-6 text-center">
        <h1 className="text-6xl font-bold text-white">500</h1>
        <h2 className="text-2xl font-semibold text-white">Internal Server Error</h2>
        <p className="text-gray-300">
          Something went wrong on our end. Please try again later.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            className="w-full bg-white text-black hover:bg-gray-200"
            onClick={() => reset()}
          >
            Try Again
          </Button>
          <Link href="/">
            <Button className="w-full bg-transparent border border-white text-white hover:bg-white/10">
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}