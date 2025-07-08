"use client"

import { useUser } from "@/hooks/useUser"
import { RequireBetaAccount } from "@/components/auth/RequireBetaAccount"
import { useEffect } from "react"

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, fetchUser } = useUser()

  useEffect(() => {
    if (!user) {
        fetchUser();
    }
  }, [user, fetchUser])

  return (
    <RequireBetaAccount hasBetaAccount={user?.hasBetaAccount}>
      {children}
    </RequireBetaAccount>
  )
}
