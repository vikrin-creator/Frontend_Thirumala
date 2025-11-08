'use client'

import React, { useState } from 'react'

interface Seller {
  id: number
  name: string
  address: string
  mobile: string
}

interface Buyer {
  id: number
  name: string
  address: string
  mobile: string
}

interface LedgerEntry {
  id: number
  date: string
  sellerId: number
  sellerName: string
  buyerId: number
  buyerName: string
  loaded: string
  conditionFromDate: string
  conditionToDate: string
}

interface DailyLedgerPageProps {
  sellers: Seller[]
  buyers: Buyer[]
}

export default function DailyLedgerPage({ sellers, buyers }: DailyLedgerPageProps) {
  // Initialize with sample data to demonstrate the feature
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([
    {
      id: 1,
      date: '2025-11-07',
      sellerId: sellers[0]?.id || 1,
      sellerName: sellers[0]?.name || 'Sample Seller',
      buyerId: buyers[0]?.id || 1,
      buyerName: buyers[0]?.name || 'Sample Buyer',
      loaded: 'Sample Load - 100 units',
      conditionFromDate: '2025-11-01',
      conditionToDate: '2025-11-15'
    }
  ])
  const [showDetails, setShowDetails] = useState(false)
  const [formData, setFormData] = useState({
    date: '',
    sellerName: '',
    buyerName: '',
    loaded: '',
    conditionFromDate: '',
    conditionToDate: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.date && formData.sellerName && formData.buyerName && formData.loaded && formData.conditionFromDate && formData.conditionToDate) {
      const newEntry: LedgerEntry = {
        id: Date.now(),
        date: formData.date,
        sellerId: Date.now(), // Generate a unique ID
        sellerName: formData.sellerName,
        buyerId: Date.now() + 1, // Generate a unique ID
        buyerName: formData.buyerName,
        loaded: formData.loaded,
        conditionFromDate: formData.conditionFromDate,
        conditionToDate: formData.conditionToDate
      }
      
      setLedgerEntries([...ledgerEntries, newEntry])
      
      // Reset form
      setFormData({
        date: '',
        sellerName: '',
        buyerName: '',
        loaded: '',
        conditionFromDate: '',
        conditionToDate: ''
      })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleDelete = (id: number) => {
    setLedgerEntries(ledgerEntries.filter(entry => entry.id !== id))
  }

  // Get seller and buyer details
  const getSellerDetails = (sellerId: number) => {
    return sellers.find(s => s.id === sellerId)
  }

  const getBuyerDetails = (buyerId: number) => {
    return buyers.find(b => b.id === buyerId)
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Daily Ledger Form */}
      <div className="flex flex-col gap-6 p-8 rounded-2xl form-container soft-shadow-lg">
        <h2 className="text-gray-900 dark:text-gray-100 text-[22px] font-bold leading-tight tracking-[-0.015em] px-0 pb-2">
          Add Daily Ledger Entry
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Date Field */}
            <label className="flex flex-col w-full">
              <p className="text-gray-900 dark:text-gray-200 text-base font-medium leading-normal pb-2">
                Date <span className="text-red-500">*</span>
              </p>
              <input 
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="form-input soft-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-gray-900 dark:text-gray-100 focus:outline-0 h-12 placeholder:text-gray-500 dark:placeholder-gray-400 p-3 text-base font-normal leading-normal" 
                type="date"
                required
              />
            </label>

            {/* Seller Input */}
            <label className="flex flex-col w-full">
              <p className="text-gray-900 dark:text-gray-200 text-base font-medium leading-normal pb-2">
                Seller <span className="text-red-500">*</span>
              </p>
              <input
                name="sellerName"
                value={formData.sellerName}
                onChange={handleChange}
                className="form-input soft-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-gray-900 dark:text-gray-100 focus:outline-0 h-12 placeholder:text-gray-500 dark:placeholder-gray-400 p-3 text-base font-normal leading-normal"
                placeholder="Enter seller name"
                type="text"
                required
              />
            </label>

            {/* Buyer Input */}
            <label className="flex flex-col w-full">
              <p className="text-gray-900 dark:text-gray-200 text-base font-medium leading-normal pb-2">
                Buyer <span className="text-red-500">*</span>
              </p>
              <input
                name="buyerName"
                value={formData.buyerName}
                onChange={handleChange}
                className="form-input soft-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-gray-900 dark:text-gray-100 focus:outline-0 h-12 placeholder:text-gray-500 dark:placeholder-gray-400 p-3 text-base font-normal leading-normal"
                placeholder="Enter buyer name"
                type="text"
                required
              />
            </label>

            {/* Loaded Field */}
            <label className="flex flex-col w-full">
              <p className="text-gray-900 dark:text-gray-200 text-base font-medium leading-normal pb-2">
                Loaded <span className="text-red-500">*</span>
              </p>
              <input 
                name="loaded"
                value={formData.loaded}
                onChange={handleChange}
                className="form-input soft-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-gray-900 dark:text-gray-100 focus:outline-0 h-12 placeholder:text-gray-500 dark:placeholder-gray-400 p-3 text-base font-normal leading-normal" 
                placeholder="Enter loaded details"
                type="text"
                required
              />
            </label>

            {/* Condition From Date */}
            <label className="flex flex-col w-full">
              <p className="text-gray-900 dark:text-gray-200 text-base font-medium leading-normal pb-2">
                Condition From Date <span className="text-red-500">*</span>
              </p>
              <input 
                name="conditionFromDate"
                value={formData.conditionFromDate}
                onChange={handleChange}
                className="form-input soft-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-gray-900 dark:text-gray-100 focus:outline-0 h-12 placeholder:text-gray-500 dark:placeholder-gray-400 p-3 text-base font-normal leading-normal" 
                type="date"
                required
              />
            </label>

            {/* Condition To Date */}
            <label className="flex flex-col w-full">
              <p className="text-gray-900 dark:text-gray-200 text-base font-medium leading-normal pb-2">
                Condition To Date <span className="text-red-500">*</span>
              </p>
              <input 
                name="conditionToDate"
                value={formData.conditionToDate}
                onChange={handleChange}
                className="form-input soft-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-gray-900 dark:text-gray-100 focus:outline-0 h-12 placeholder:text-gray-500 dark:placeholder-gray-400 p-3 text-base font-normal leading-normal" 
                type="date"
                required
              />
            </label>
          </div>
          
          <div className="flex justify-end gap-3 pt-6">
            <button 
              type="submit"
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white text-base font-bold leading-normal transition-all duration-300 hover:from-purple-600 hover:to-purple-700 hover:shadow-lg hover:shadow-purple-500/25 active:scale-95"
            >
              Add Ledger Entry
            </button>
            {ledgerEntries.length > 0 && (
              <button 
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-base font-bold leading-normal transition-all duration-300 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95"
              >
                {showDetails ? 'Hide Details' : 'View All Ledgers'}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* All Ledgers Details Section */}
      {showDetails && ledgerEntries.length > 0 && (
        <div className="flex flex-col gap-4 p-6 rounded-2xl form-container soft-shadow-lg">
          <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3">
            <h3 className="text-gray-900 dark:text-gray-100 text-xl font-bold leading-tight">
              All Daily Ledger Entries
            </h3>
          </div>

          {/* Table View */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                  <th className="text-left p-3 text-gray-900 dark:text-gray-100 font-semibold text-sm">Date</th>
                  <th className="text-left p-3 text-gray-900 dark:text-gray-100 font-semibold text-sm">Seller</th>
                  <th className="text-left p-3 text-gray-900 dark:text-gray-100 font-semibold text-sm">Buyer</th>
                  <th className="text-left p-3 text-gray-900 dark:text-gray-100 font-semibold text-sm">Loaded</th>
                  <th className="text-left p-3 text-gray-900 dark:text-gray-100 font-semibold text-sm">Condition From</th>
                  <th className="text-left p-3 text-gray-900 dark:text-gray-100 font-semibold text-sm">Condition To</th>
                  <th className="text-center p-3 text-gray-900 dark:text-gray-100 font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ledgerEntries.map((entry) => (
                  <tr key={entry.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-3 text-gray-800 dark:text-gray-200 text-sm">
                      {new Date(entry.date).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-gray-800 dark:text-gray-200 text-sm font-medium">
                      {entry.sellerName}
                    </td>
                    <td className="p-3 text-gray-800 dark:text-gray-200 text-sm font-medium">
                      {entry.buyerName}
                    </td>
                    <td className="p-3 text-gray-800 dark:text-gray-200 text-sm">
                      {entry.loaded}
                    </td>
                    <td className="p-3 text-gray-800 dark:text-gray-200 text-sm">
                      {new Date(entry.conditionFromDate).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-gray-800 dark:text-gray-200 text-sm">
                      {new Date(entry.conditionToDate).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
