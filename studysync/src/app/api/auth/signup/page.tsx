'use client'

import { useState } from 'react'

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwörter stimmen nicht überein!')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      })

      if (response.ok) {
        alert('Registrierung erfolgreich! Du kannst dich jetzt anmelden.')
        window.location.href = 'signin'
      } else {
        const error = await response.json()
        alert(error.message || 'Registrierung fehlgeschlagen.')
      }
    } catch (error) {
      alert('Ein Fehler ist aufgetreten.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 md:bg-green-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-4">
        <h1 className="text-2xl font-bold mb-6 text-center">StudySync Registrierung</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name:</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-2 border rounded"
              placeholder="Dein Name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Email:</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-2 border rounded"
              placeholder="deine@email.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Passwort:</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full p-2 border rounded"
              placeholder="Mindestens 6 Zeichen"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Passwort bestätigen:</label>
            <input
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              className="w-full p-2 border rounded"
              placeholder="Passwort wiederholen"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? 'Registrieren...' : 'Account erstellen'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Bereits registriert?{' '}
            <a href="signin" className="text-green-600 hover:text-green-800 font-medium">
              Hier anmelden
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}