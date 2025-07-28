"use client"

import { useUser } from "@/hooks/useUser"
import { RequireBetaAccount } from "@/components/auth/RequireBetaAccount"
import { useEffect } from "react"
import Wav3Loading from "@/components/loading-wav3";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, fetchUser } = useUser()

  useEffect(() => {
    if (!user) {
        fetchUser();
    }
  }, [user, fetchUser])

  if (user === undefined || user === null) {
    return <Wav3Loading />
  }

  return (
    <RequireBetaAccount hasBetaAccount={user?.hasBetaAccount}>
      {children}
    </RequireBetaAccount>
  )
}
