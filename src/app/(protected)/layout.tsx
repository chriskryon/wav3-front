"use client"

import { useEffect } from "react"
import { useUser } from "@/hooks/useUser"
import { RequireBetaAccount } from "@/components/auth/RequireBetaAccount"

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, fetchUser } = useUser()

  useEffect(() => {
    console.log("ProtectedLayout mounted")
    if (!user) {
        fetchUser();
    }
  }, [user, fetchUser])

  useEffect(() => {
    // Debug: veja o que está vindo do Zustand/localStorage
    console.log('user:', user)
    console.log('hasBetaAccount:', user?.hasBetaAccount)
  }, [user])

  return (
    <RequireBetaAccount hasBetaAccount={user?.hasBetaAccount}>
      {children}
    </RequireBetaAccount>
  )
}
