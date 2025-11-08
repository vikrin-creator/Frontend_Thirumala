'use client'

import React, { useState } from 'react'

interface BuyerFormProps {
  onAddBuyer: (buyer: { name: string; address: string; mobile: string }) => void
}

export default function BuyerForm({ onAddBuyer }: BuyerFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    mobile: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.address && formData.mobile) {
      onAddBuyer(formData)
      setFormData({ name: '', address: '', mobile: '' })
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
        
        <div className="flex justify-end pt-6">
          <button 
            type="submit"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-white text-base font-bold leading-normal transition-colors hover:bg-primary/90"
          >
            Save Buyer
          </button>
        </div>
      </form>
    </div>
  )
}