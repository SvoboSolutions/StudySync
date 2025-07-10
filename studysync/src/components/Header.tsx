'use client'

import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <Image
                src="/StudySync.svg"
                alt="StudySync Logo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <h1 className="text-2xl font-bold text-gray-900">
                StudySync
              </h1>
            </div>
            <span className="ml-3 text-sm text-gray-500">
              Lernplan Manager
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Hallo, {session?.user?.name}!
            </span>
            <button
              onClick={() => signOut()}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Abmelden
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}