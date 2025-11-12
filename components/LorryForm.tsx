'use client'

import React, { useState, useEffect } from 'react'

interface Seller {
  id: number | string
  name: string
  address: string
  mobile: string
}

interface Buyer {
  id: number | string
  name: string
  address: string
  mobile: string
}

interface LorryFormProps {
  sellers?: Seller[]
  buyers?: Buyer[]
  onAddLorry: (lorry: any) => void
  mode: 'seller' | 'buyer'
}

export default function LorryForm({ sellers = [], buyers = [], onAddLorry, mode }: LorryFormProps) {
  const [selectedSeller, setSelectedSeller] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [formData, setFormData] = useState({
    sellerId: '',
    lorryNumber: '',
    unloadDate: '',
    buyingDate: '',
    bargainDate: '',
    counterpartyName: '', // This will be buyerName in seller mode, sellerName in buyer mode
    billType: 'local',
    billName: '',
    billNumber: '',
    itemName: '',
    quantity: 0,
    amount: 0,
    commission: 0
  })

  const [totalCommission, setTotalCommission] = useState(0)

  useEffect(() => {
    if (formData.billType === 'local') {
      setTotalCommission(formData.quantity * formData.commission)
    } else {
      setTotalCommission(0)
    }
  }, [formData.quantity, formData.commission, formData.billType])

  // Filter sellers/buyers based on search term
  const filteredItems = mode === 'seller' 
    ? sellers.filter(seller => seller.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : buyers.filter(buyer => buyer.name.toLowerCase().includes(searchTerm.toLowerCase()))

  // Handle selection from dropdown
  const handleSelection = (item: Seller | Buyer) => {
    if (mode === 'seller') {
      const seller = item as Seller
      setSelectedSeller(seller.id.toString())
      setSearchTerm(seller.name)
      setFormData(prev => ({ ...prev, sellerId: seller.id.toString() }))
    } else {
      const buyer = item as Buyer
      setSelectedSeller(buyer.id.toString())
      setSearchTerm(buyer.name)
      setFormData(prev => ({ ...prev, sellerId: buyer.id.toString() }))
    }
    setShowDropdown(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedSeller && formData.lorryNumber && formData.itemName) {
      onAddLorry({
        ...formData,
        sellerId: selectedSeller,
        counterpartyName: formData.counterpartyName,
        totalCommission
      })
      setFormData({
        sellerId: '',
        lorryNumber: '',
        unloadDate: '',
        buyingDate: '',
        bargainDate: '',
        counterpartyName: '',
        billType: 'local',
        billName: '',
        billNumber: '',
        itemName: '',
        quantity: 0,
        amount: 0,
        commission: 0
      })
      setSelectedSeller('')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    })
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    const updatedFormData = {
      ...formData,
      [name]: value
    }
    
    // Reset commission when bill type changes to imported
    if (name === 'billType' && value === 'imported') {
      updatedFormData.commission = 0
    }
    
    setFormData(updatedFormData)
  }

  return (
    <div className="form-container">
      <div className="flex flex-col w-full max-w-sm">
        <label className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2" htmlFor="select-party">
          {mode === 'seller' ? 'Search & Select Seller' : 'Search & Select Buyer'}
        </label>
        <div className="relative">
          <input
            type="text"
            className="soft-input"
            id="select-party"
            name="partySearch"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setShowDropdown(true)
              if (e.target.value === '') {
                setSelectedSeller('')
                setFormData(prev => ({ ...prev, sellerId: '' }))
              }
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder={mode === 'seller' ? 'Search for a seller...' : 'Search for a buyer...'}
            autoComplete="off"
            required
          />
          
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelection(item)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                  >
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{item.address}</div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-gray-500 dark:text-gray-400">
                  No {mode === 'seller' ? 'sellers' : 'buyers'} found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Click outside to close dropdown */}
        {showDropdown && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowDropdown(false)}
          />
        )}
      </div>

      <div className="pt-6">
        <h2 className="text-gray-800 dark:text-gray-100 text-[22px] font-bold leading-tight tracking-[-0.015em] px-0 pb-4">
          {mode === 'seller' ? 'Add Lorry Details (as Seller)' : 'Add Lorry Details (as Buyer)'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <label className="flex flex-col">
              <p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2">
                Lorry Number
              </p>
              <input 
                id="lorryNumber"
                name="lorryNumber"
                value={formData.lorryNumber}
                onChange={handleChange}
                className="soft-input" 
                placeholder="e.g., MH12AB1234" 
                type="text"
                autoComplete="off"
                required
              />
            </label>

            <label className="flex flex-col">
              <p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2">
                {mode === 'seller' ? 'Buyer Name' : 'Seller Name'}
              </p>
              <select 
                id="counterpartyName"
                name="counterpartyName"
                value={formData.counterpartyName}
                onChange={handleSelectChange}
                className="soft-select" 
                autoComplete="off"
                required
              >
                <option value="">
                  {mode === 'seller' ? 'Select Buyer' : 'Select Seller'}
                </option>
                {mode === 'seller' 
                  ? buyers.map((buyer) => (
                      <option key={buyer.id} value={buyer.name}>
                        {buyer.name}
                      </option>
                    ))
                  : sellers.map((seller) => (
                      <option key={seller.id} value={seller.name}>
                        {seller.name}
                      </option>
                    ))
                }
              </select>
            </label>

            <label className="flex flex-col">
              <p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2">
                Bill Type
              </p>
              <select 
                id="billType"
                name="billType"
                value={formData.billType}
                onChange={handleSelectChange}
                className="soft-select"
                autoComplete="off"
                required
              >
                <option value="local">Local</option>
                <option value="imported">Imported</option>
              </select>
            </label>

            <label className="flex flex-col">
              <p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2">
                Unload Date
              </p>
              <input 
                id="unloadDate"
                name="unloadDate"
                value={formData.unloadDate}
                onChange={handleChange}
                className="soft-input" 
                type="date"
                autoComplete="off"
              />
            </label>

            <label className="flex flex-col">
              <p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2">
                Buying Date
              </p>
              <input 
                id="buyingDate"
                name="buyingDate"
                value={formData.buyingDate}
                onChange={handleChange}
                className="soft-input" 
                type="date"
                autoComplete="off"
              />
            </label>

            <label className="flex flex-col">
              <p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2">
                Bargain Date
              </p>
              <input 
                id="bargainDate"
                name="bargainDate"
                value={formData.bargainDate}
                onChange={handleChange}
                className="soft-input" 
                type="date"
                autoComplete="off"
              />
            </label>

            <label className="flex flex-col">
              <p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2">
                Bill Name
              </p>
              <input 
                id="billName"
                name="billName"
                value={formData.billName}
                onChange={handleChange}
                className="soft-input" 
                placeholder="Enter bill name" 
                type="text"
                autoComplete="off"
              />
            </label>

            <label className="flex flex-col">
              <p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2">
                Bill Number
              </p>
              <input 
                id="billNumber"
                name="billNumber"
                value={formData.billNumber}
                onChange={handleChange}
                className="soft-input" 
                placeholder="Enter bill number" 
                type="text"
                autoComplete="off"
              />
            </label>

            <label className="flex flex-col">
              <p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2">
                Item Name
              </p>
              <input 
                id="itemName"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                className="soft-input" 
                placeholder="e.g., Steel Bars" 
                type="text"
                autoComplete="off"
                required
              />
            </label>

            <label className="flex flex-col">
              <p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2">
                Quantity
              </p>
              <input 
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="soft-input" 
                placeholder="e.g., 100" 
                type="number"
                autoComplete="off"
              />
            </label>

            <label className="flex flex-col">
              <p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2">
                Amount
              </p>
              <input 
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="soft-input" 
                placeholder="e.g., 50000" 
                type="number"
                autoComplete="off"
              />
            </label>

            {formData.billType === 'local' && (
              <>
                <label className="flex flex-col">
                  <p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2">
                    Commission
                  </p>
                  <input 
                    name="commission"
                    value={formData.commission}
                    onChange={handleChange}
                    className="soft-input" 
                    placeholder="e.g., 50" 
                    type="number"
                  />
                </label>

                <label className="flex flex-col md:col-span-2 lg:col-span-1">
                  <p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2">
                    Total Commission
                  </p>
                  <input 
                    value={totalCommission}
                    className="soft-input opacity-70 cursor-not-allowed" 
                    placeholder="Quantity * Commission" 
                    readOnly 
                    type="number"
                  />
                </label>
              </>
            )}
          </div>

          <div className="flex justify-end pt-8">
            <button 
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-white text-base font-bold leading-normal transition-colors hover:bg-primary/90 w-full sm:w-auto"
            >
              {mode === 'seller' ? 'Add Lorry Details' : 'Add Lorry Details'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}