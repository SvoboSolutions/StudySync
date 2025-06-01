'use client'

import { useState, useEffect } from 'react'

interface Course {
  id?: string
  title: string
  description: string | null
  startDate: string
  endDate: string
  color: string
}

interface CourseFormProps {
  onSubmit: (formData: any) => void
  onCancel: () => void
  editCourse?: Course | null
}

export function CourseForm({ onSubmit, onCancel, editCourse }: CourseFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    color: '#3B82F6',
    userId: 'temp-user-id'
  })

  // Formular mit Edit-Daten füllen
  useEffect(() => {
    if (editCourse) {
      setFormData({
        title: editCourse.title,
        description: editCourse.description || '',
        startDate: editCourse.startDate.split('T')[0], // ISO String zu Date
        endDate: editCourse.endDate.split('T')[0],
        color: editCourse.color,
        userId: 'temp-user-id'
      })
    }
  }, [editCourse])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ ...formData, id: editCourse?.id })
    
    // Formular zurücksetzen
    setFormData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      color: '#3B82F6',
      userId: 'temp-user-id'
    })
  }

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']

  return (
    <div className="mb-8 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
        <h3 className="text-xl font-semibold text-white">
          {editCourse ? '✏️ Kurs bearbeiten' : '✨ Neuen Kurs erstellen'}
        </h3>
        <p className="text-blue-100 mt-1">
          {editCourse ? 'Aktualisiere deine Lernziele' : 'Definiere deine Lernziele und plane deinen Erfolg'}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📖 Kurs-Titel
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="z.B. Mathematik Prüfung, React Entwicklung..."
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📝 Beschreibung
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Beschreibe deine Lernziele..."
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🗓️ Startdatum
            </label>
            <input
              type="date"
              required
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🎯 Zieldatum
            </label>
            <input
              type="date"
              required
              value={formData.endDate}
              onChange={(e) => setFormData({...formData, endDate: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🎨 Kurs-Farbe
            </label>
            <div className="flex space-x-3">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({...formData, color})}
                  className={`w-10 h-10 rounded-full border-4 transition-all duration-200 ${
                    formData.color === color 
                      ? 'border-gray-800 scale-110' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 mt-8">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Abbrechen
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            {editCourse ? '💾 Kurs aktualisieren' : '🚀 Kurs erstellen'}
          </button>
        </div>
      </form>
    </div>
  )
}