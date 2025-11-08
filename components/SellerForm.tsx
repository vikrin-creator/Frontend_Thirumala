'use client'

import React, { useState } from 'react'
import { apiClient } from '../lib/api'

interface SellerFormProps {
  onAddSeller: (seller: { id?: number; name: string; address: string; mobile: string }) => void
  onViewDetails?: () => void
}

export default function SellerForm({ onAddSeller, onViewDetails }: SellerFormProps) {
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
        // Send data to backend API
        const response = await apiClient.post('/sellers', formData)
        
        // Call the parent callback with the response data
        onAddSeller(response.data || { ...formData, id: Date.now() })
        
        // Reset form
        setFormData({ name: '', address: '', mobile: '' })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to add seller')
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
        Add New Seller
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <label className="flex flex-col w-full">
            <p className="text-gray-900 dark:text-gray-200 text-base font-medium leading-normal pb-2">
              Name
            </p>
            <input 
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input soft-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-gray-900 dark:text-gray-100 focus:outline-0 h-12 placeholder:text-gray-500 dark:placeholder-gray-400 p-3 text-base font-normal leading-normal" 
              placeholder="Enter seller's name" 
              type="text"
              required
            />
          </label>
          
          <label className="flex flex-col w-full md:col-span-2">
            <p className="text-gray-900 dark:text-gray-200 text-base font-medium leading-normal pb-2">
              Address
            </p>
            <input 
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="form-input soft-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-gray-900 dark:text-gray-100 focus:outline-0 h-12 placeholder:text-gray-500 dark:placeholder-gray-400 p-3 text-base font-normal leading-normal" 
              placeholder="Enter seller's address" 
              type="text"
              required
            />
          </label>
          
          <label className="flex flex-col w-full">
            <p className="text-gray-900 dark:text-gray-200 text-base font-medium leading-normal pb-2">
              Mobile Number
            </p>
            <input 
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="form-input soft-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-gray-900 dark:text-gray-100 focus:outline-0 h-12 placeholder:text-gray-500 dark:placeholder-gray-400 p-3 text-base font-normal leading-normal" 
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
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-base font-bold leading-normal transition-all duration-300 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95"
            >
              View Seller Details
            </button>
          )}
          <button 
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white text-base font-bold leading-normal transition-all duration-300 hover:from-purple-600 hover:to-purple-700 hover:shadow-lg hover:shadow-purple-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Seller'}
          </button>
        </div>
      </form>
    </div>
  )
}