"use client"

import { Bell, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function AppHeader() {
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) {
      setUserData(JSON.parse(user))
    }
  }, [])

  return (
    <header className="header-height backdrop-blur-md bg-white/90 border-b border-black/10 flex items-center justify-between px-8 shadow-sm">
      <div>
        <h1 className="text-2xl font-semibold primary-text">
          {userData?.profileCompleted ? `Hello, ${userData.name || "Crypto Trader"}!` : "Complete Your Profile"}
        </h1>
        <p className="text-sm text-main">
          {userData?.profileCompleted ? "Crypto Trader - Verified" : "Please complete your KYC information"}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="backdrop-blur-sm bg-black/5 hover:bg-black/10 w-10 h-10 p-0 rounded-full border border-black/10 shadow-sm smooth-transition"
        >
          <Bell className="w-4 h-4 text-main" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="backdrop-blur-sm bg-black/5 hover:bg-black/10 w-10 h-10 p-0 rounded-full border border-black/10 shadow-sm smooth-transition"
        >
          <Settings className="w-4 h-4 text-main" />
        </Button>
        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-sm">
          <User className="w-4 h-4" />
        </div>
      </div>
    </header>
  )
}
