'use client'

import { useState } from 'react'

interface TaskFormProps {
  goalId: string
  onSubmit: (formData: any) => void
  onCancel: () => void
}

export function TaskForm({ goalId, onSubmit, onCancel }: TaskFormProps) {
  console.log('TaskForm rendered with props:', { goalId, onSubmit: typeof onSubmit, onCancel: typeof onCancel })
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    estimatedHours: '',
    goalId
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('TaskForm handleSubmit - START')
    console.log('formData:', formData)
    console.log('onSubmit type:', typeof onSubmit)
    console.log('onSubmit function:', onSubmit)
    
    if (typeof onSubmit !== 'function') {
      console.error('onSubmit is not a function!', onSubmit)
      alert('Fehler: onSubmit ist keine Funktion!')
      return
    }

    try {
      const taskData = {
        ...formData,
        estimatedHours: formData.estimatedHours ? parseInt(formData.estimatedHours) : null
      }
      
      console.log('Calling onSubmit with:', taskData)
      onSubmit(taskData)
      console.log('onSubmit call successful')
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        estimatedHours: '',
        goalId
      })
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      alert('Fehler beim Erstellen der Aufgabe: ' + error)
    }
  }

  return (
    <div className="mt-4 bg-gray-50 rounded-xl p-6 border border-gray-200">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">📋 Neue Aufgabe hinzufügen</h4>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Aufgaben-Titel
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="z.B. Kapitel 3 lesen, Übung 2.1 lösen..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Beschreibung (optional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Weitere Details..."
            rows={2}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fälligkeitsdatum (optional)
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Geschätzte Stunden (optional)
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={formData.estimatedHours}
              onChange={(e) => setFormData({...formData, estimatedHours: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="z.B. 2"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Abbrechen
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Aufgabe hinzufügen
          </button>
        </div>
      </form>
    </div>
  )
}