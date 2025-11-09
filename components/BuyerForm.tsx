'use client'

import React, { useState } from 'react'
import { apiClient } from '../lib/api'

interface BuyerFormProps {
  onAddBuyer: (buyer: { id?: number; name: string; address: string; mobile: string }) => void
  onViewDetails?: () => void
}

export default function BuyerForm({ onAddBuyer, onViewDetails }: BuyerFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    mobile: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.address && formData.mobile) {
      setLoading(true)
      setError(null)
      
      try {
        // Send data to backend API with 'contact' field instead of 'mobile'
        // Convert name to uppercase for consistency
        const response = await apiClient.post('/buyers', {
          name: formData.name.toUpperCase(),
          address: formData.address,
          contact: formData.mobile
        })
        
        // Call the parent callback with the response data
        onAddBuyer(response.data || { ...formData, name: formData.name.toUpperCase(), id: Date.now() })
        
        // Reset form
        setFormData({ name: '', address: '', mobile: '' })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to add buyer')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="flex flex-col gap-6 p-8 rounded-2xl form-container soft-shadow-lg">
      <h2 className="text-gray-900 dark:text-gray-100 text-[22px] font-bold leading-tight tracking-[-0.015em] px-0 pb-2">
        Add New Buyer
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <label className="flex flex-col w-full">
            <p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2">
              Buyer Name
            </p>
            <input 
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="soft-input" 
              placeholder="Enter buyer's name" 
              type="text"
              required
            />
          </label>
          
          <label className="flex flex-col w-full md:col-span-2">
            <p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2">
              Address
            </p>
            <input 
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="soft-input" 
              placeholder="Enter buyer's address" 
              type="text"
              required
            />
          </label>
          
          <label className="flex flex-col w-full">
            <p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2">
              Mobile Number
            </p>
            <input 
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="soft-input" 
              placeholder="Enter 10-digit mobile number" 
              type="tel"
              pattern="[0-9]{10}"
              required
            />
          </label>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        <div className="flex justify-end gap-4 pt-6">
          {onViewDetails && (
            <button 
              type="button"
              onClick={onViewDetails}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-500 text-white text-base font-bold leading-normal transition-colors hover:bg-blue-600"
            >
              View Lorry Details
            </button>
          )}
          <button 
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-white text-base font-bold leading-normal transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Buyer'}
          </button>
        </div>
      </form>
    </div>
  )
}