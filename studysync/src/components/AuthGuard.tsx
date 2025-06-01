'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Noch am laden

    if (!session) {
      router.push('/api/auth/signin') // Nicht eingeloggt → Login
    }
  }, [session, status, router])

  // Loading-Screen während der Prüfung
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Lade StudySync...</p>
        </div>
      </div>
    )
  }

  // Nicht eingeloggt → zeige nichts (Umleitung läuft)
  if (!session) {
    return null
  }

  // Eingeloggt → zeige App
  return <>{children}</>
}