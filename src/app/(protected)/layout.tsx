"use client"

import { useEffect } from "react"
import { useUser } from "@/hooks/useUser"
import { RequireBetaAccount } from "@/components/auth/RequireBetaAccount"

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, fetchUser } = useUser()

  useEffect(() => {
    if (!user) {
        fetchUser();
    }
  }, [user, fetchUser])

  useEffect(() => {
  }, [user])

  return (
    <RequireBetaAccount hasBetaAccount={user?.hasBetaAccount}>
      {children}
    </RequireBetaAccount>
  )
}
