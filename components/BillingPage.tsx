'use client'

import React, { useState } from 'react'

interface Seller {
  id: number
  name: string
  address: string
  mobile: string
  buyerName: string
}

interface Buyer {
  id: number
  name: string
  address: string
  mobile: string
  sellerName: string
}

interface Lorry {
  id: number
  sellerId: number
  sellerName: string
  lorryNumber: string
  unloadDate: string
  buyingDate: string
  bargainDate: string
  billName: string
  billNumber: string
  itemName: string
  quantity: number
  amount: number
  commission: number
  totalCommission: number
}

interface BillingPageProps {
  sellers: Seller[]
  buyers: Buyer[]
  lorries: Lorry[]
}

export default function BillingPage({ sellers, buyers, lorries }: BillingPageProps) {
  const [activeBillTab, setActiveBillTab] = useState<'seller' | 'buyer'>('seller')
  const [selectedSeller, setSelectedSeller] = useState('')
  const [selectedBuyer, setSelectedBuyer] = useState('')
  const [sellerSearch, setSellerSearch] = useState('')
  const [buyerSearch, setBuyerSearch] = useState('')
  const [showSellerDropdown, setShowSellerDropdown] = useState(false)
  const [showBuyerDropdown, setShowBuyerDropdown] = useState(false)
  const [generatedBills, setGeneratedBills] = useState<any[]>([])
  const totalCommission = lorries.reduce((sum, lorry) => sum + lorry.totalCommission, 0)
  const totalAmount = lorries.reduce((sum, lorry) => sum + lorry.amount, 0)

  // Filter sellers based on search
  const filteredSellers = sellers.filter(seller =>
    seller.name.toLowerCase().includes(sellerSearch.toLowerCase())
  )

  // Filter buyers based on search
  const filteredBuyers = buyers.filter(buyer =>
    buyer.name.toLowerCase().includes(buyerSearch.toLowerCase())
  )

  // Handle seller selection
  const handleSellerSelect = (seller: Seller) => {
    setSelectedSeller(seller.id.toString())
    setSellerSearch(seller.name)
    setShowSellerDropdown(false)
  }

  // Handle buyer selection
  const handleBuyerSelect = (buyer: Buyer) => {
    setSelectedBuyer(buyer.id.toString())
    setBuyerSearch(buyer.name)
    setShowBuyerDropdown(false)
  }

  const generateSellerBill = (sellerId: string, billType: string) => {
    const seller = sellers.find(s => s.id.toString() === sellerId)
    if (!seller) return

    const sellerLorries = lorries.filter(lorry => lorry.sellerId.toString() === sellerId)
    const totalCommissionForSeller = sellerLorries.reduce((sum, lorry) => sum + lorry.totalCommission, 0)
    
    const newBill = {
      id: Date.now(),
      type: billType,
      party: seller.name,
      partyType: 'seller',
      amount: totalCommissionForSeller,
      date: new Date().toLocaleDateString(),
      items: sellerLorries,
      billNumber: `SB${Date.now()}`,
    }

    setGeneratedBills(prev => [newBill, ...prev])
    alert(`${billType} generated for ${seller.name} - Amount: ₹${totalCommissionForSeller.toLocaleString()}`)
  }

  const generateBuyerBill = (buyerId: string, billType: string) => {
    const buyer = buyers.find(b => b.id.toString() === buyerId)
    if (!buyer) return

    const buyerLorries = lorries.filter(lorry => 
      sellers.find(s => s.id === lorry.sellerId)?.buyerName === buyer.name
    )
    const totalAmountForBuyer = buyerLorries.reduce((sum, lorry) => sum + lorry.amount, 0)
    
    const newBill = {
      id: Date.now(),
      type: billType,
      party: buyer.name,
      partyType: 'buyer',
      amount: totalAmountForBuyer,
      date: new Date().toLocaleDateString(),
      items: buyerLorries,
      billNumber: `BB${Date.now()}`,
    }

    setGeneratedBills(prev => [newBill, ...prev])
    alert(`${billType} generated for ${buyer.name} - Amount: ₹${totalAmountForBuyer.toLocaleString()}`)
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Billing Tabs */}
        <div className="form-container">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveBillTab('seller')}
                className={`px-4 py-3 text-base font-semibold ${
                  activeBillTab === 'seller'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                Seller Bills
              </button>
              <button
                onClick={() => setActiveBillTab('buyer')}
                className={`px-4 py-3 text-base font-semibold ${
                  activeBillTab === 'buyer'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                Buyer Bills
              </button>
            </div>
          </div>

          {/* Bill Content */}
          <div className="pt-6">
            {activeBillTab === 'seller' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  Generate Seller Bills
                </h2>
                
                {/* Seller Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <label className="block text-gray-800 dark:text-gray-200 text-base font-medium mb-2">
                      Select Seller
                    </label>
                    <div className="relative">
                      <input
                        id="seller-search"
                        name="sellerSearch"
                        type="text"
                        value={sellerSearch}
                        onChange={(e) => {
                          setSellerSearch(e.target.value)
                          setShowSellerDropdown(true)
                          if (e.target.value === '') {
                            setSelectedSeller('')
                          }
                        }}
                        onFocus={() => setShowSellerDropdown(true)}
                        className="soft-input"
                        placeholder="Search and select seller..."
                        autoComplete="off"
                      />
                      
                      {showSellerDropdown && (
                        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {filteredSellers.length > 0 ? (
                            filteredSellers.map((seller) => (
                              <button
                                key={seller.id}
                                onClick={() => handleSellerSelect(seller)}
                                className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                              >
                                <div className="font-medium">{seller.name}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{seller.address}</div>
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-gray-500 dark:text-gray-400">
                              No sellers found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Click outside to close dropdown */}
                {showSellerDropdown && (
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowSellerDropdown(false)}
                  />
                )}

                {/* Bill Generation Buttons */}
                {selectedSeller && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => generateSellerBill(selectedSeller, 'Seller Bill')}
                      className="bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                    >
                      Generate Bill
                    </button>
                    <button
                      onClick={() => {
                        const seller = sellers.find(s => s.id.toString() === selectedSeller)
                        if (seller) {
                          alert(`Printing bill for ${seller.name}...`)
                        }
                      }}
                      className="bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                    >
                      Print Bill
                    </button>
                  </div>
                )}

                {!selectedSeller && (
                  <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                    Please select a seller to generate bills
                  </p>
                )}
              </div>
            )}

            {activeBillTab === 'buyer' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  Generate Buyer Bills
                </h2>
                
                {/* Buyer Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <label className="block text-gray-800 dark:text-gray-200 text-base font-medium mb-2">
                      Select Buyer
                    </label>
                    <div className="relative">
                      <input
                        id="buyer-search"
                        name="buyerSearch"
                        type="text"
                        value={buyerSearch}
                        onChange={(e) => {
                          setBuyerSearch(e.target.value)
                          setShowBuyerDropdown(true)
                          if (e.target.value === '') {
                            setSelectedBuyer('')
                          }
                        }}
                        onFocus={() => setShowBuyerDropdown(true)}
                        className="soft-input"
                        placeholder="Search and select buyer..."
                        autoComplete="off"
                      />
                      
                      {showBuyerDropdown && (
                        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {filteredBuyers.length > 0 ? (
                            filteredBuyers.map((buyer) => (
                              <button
                                key={buyer.id}
                                onClick={() => handleBuyerSelect(buyer)}
                                className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                              >
                                <div className="font-medium">{buyer.name}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{buyer.address}</div>
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-gray-500 dark:text-gray-400">
                              No buyers found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Click outside to close dropdown */}
                {showBuyerDropdown && (
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowBuyerDropdown(false)}
                  />
                )}

                {/* Bill Generation Buttons */}
                {selectedBuyer && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => generateBuyerBill(selectedBuyer, 'Buyer Bill')}
                      className="bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                    >
                      Generate Bill
                    </button>
                    <button
                      onClick={() => {
                        const buyer = buyers.find(b => b.id.toString() === selectedBuyer)
                        if (buyer) {
                          alert(`Printing bill for ${buyer.name}...`)
                        }
                      }}
                      className="bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                    >
                      Print Bill
                    </button>
                  </div>
                )}

                {!selectedBuyer && (
                  <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                    Please select a buyer to generate bills
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Generated Bills Section */}
        <div className="form-container">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
            Generated Bills & Lorry Details
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/70 dark:bg-gray-800/50">
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Bill Number</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Party</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Lorry Number</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Unload Date</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Buying Date</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Bargain Date</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
                    {activeBillTab === 'seller' ? 'Buyer Name' : 'Seller Name'}
                  </th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Bill Type</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Bill Name</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Bill Number (Lorry)</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Item Name</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Quantity</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Amount</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Commission</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Total Commission</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Generated Date</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                {generatedBills.length > 0 ? generatedBills.flatMap((bill) => 
                  bill.items.map((lorry: any, index: number) => (
                    <tr key={`${bill.id}-${lorry.id || index}`}>
                      <td className="p-3 text-sm text-gray-800 dark:text-gray-100 font-medium">{bill.billNumber}</td>
                      <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{bill.party}</td>
                      <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{lorry.lorryNumber}</td>
                      <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{lorry.unloadDate}</td>
                      <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{lorry.buyingDate}</td>
                      <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{lorry.bargainDate}</td>
                      <td className="p-3 text-sm text-gray-800 dark:text-gray-100">
                        {bill.partyType === 'seller' 
                          ? sellers.find(s => s.id === lorry.sellerId)?.buyerName || '-'
                          : buyers.find(b => b.name === sellers.find(s => s.id === lorry.sellerId)?.buyerName)?.sellerName || '-'
                        }
                      </td>
                      <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{lorry.billType || 'local'}</td>
                      <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{lorry.billName || '-'}</td>
                      <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{lorry.billNumber || '-'}</td>
                      <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{lorry.itemName}</td>
                      <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{lorry.quantity}</td>
                      <td className="p-3 text-sm text-gray-800 dark:text-gray-100 font-medium">₹{lorry.amount.toLocaleString()}</td>
                      <td className="p-3 text-sm text-gray-800 dark:text-gray-100">₹{lorry.commission.toLocaleString()}</td>
                      <td className="p-3 text-sm text-gray-800 dark:text-gray-100 font-medium">₹{lorry.totalCommission.toLocaleString()}</td>
                      <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{bill.date}</td>
                      <td className="p-3">
                        <button className="text-primary hover:text-primary/80 text-sm font-medium">
                          View/Print
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-3 text-sm text-gray-600 dark:text-gray-300 text-center" colSpan={17}>
                      No bills generated yet. Select a seller or buyer and generate bills.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  )
}