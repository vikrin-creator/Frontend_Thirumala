'use client'

import React from 'react'

interface Seller {
  id: number
  name: string
  address: string
  mobile: string
  buyerName: string
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

interface Buyer {
  id: number
  name: string
  address: string
  mobile: string
  sellerName: string
}

interface DataTableProps {
  sellers?: Seller[]
  buyers?: Buyer[]
  lorries: Lorry[]
  activeTab: string
  setActiveTab: (tab: string) => void
  onDeleteSeller?: (id: number) => void
  onDeleteBuyer?: (id: number) => void
  onDeleteLorry: (id: number) => void
  mode: 'seller' | 'buyer'
}

export default function DataTable({ 
  sellers = [], 
  buyers = [], 
  lorries, 
  activeTab, 
  setActiveTab, 
  onDeleteSeller, 
  onDeleteBuyer,
  onDeleteLorry,
  mode 
}: DataTableProps) {
  return (
    <div className="form-container">
      <h2 className="text-gray-800 dark:text-gray-100 text-[22px] font-bold leading-tight tracking-[-0.015em] px-0 pb-4">
        View & Edit Details
      </h2>
      
      <div className="flex flex-col gap-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-4">
            <button 
              onClick={() => setActiveTab(mode === 'seller' ? 'sellers' : 'buyers')}
              className={`px-4 py-3 text-base font-semibold ${
                activeTab === (mode === 'seller' ? 'sellers' : 'buyers') 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              {mode === 'seller' ? 'View Seller Details' : 'View Buyer Details'}
            </button>
            <button 
              onClick={() => setActiveTab('lorries')}
              className={`px-4 py-3 text-base font-semibold ${
                activeTab === 'lorries' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              View Lorry Details
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {(activeTab === 'sellers' || activeTab === 'buyers') ? (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Name</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Address</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Mobile Number</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
                    {mode === 'seller' ? 'Buyer Name' : 'Seller Name'}
                  </th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {mode === 'seller' ? (
                  sellers.map((seller) => (
                    <tr key={seller.id}>
                      <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{seller.name}</td>
                      <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{seller.address}</td>
                      <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{seller.mobile}</td>
                      <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{seller.buyerName}</td>
                      <td className="p-3">
                        <div className="flex justify-end gap-2">
                          <button className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            ✏️ Edit
                          </button>
                          <button 
                            onClick={() => onDeleteSeller?.(seller.id)}
                            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  buyers.map((buyer) => (
                    <tr key={buyer.id}>
                      <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{buyer.name}</td>
                      <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{buyer.address}</td>
                      <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{buyer.mobile}</td>
                      <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{buyer.sellerName}</td>
                      <td className="p-3">
                        <div className="flex justify-end gap-2">
                          <button className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            ✏️ Edit
                          </button>
                          <button 
                            onClick={() => onDeleteBuyer?.(buyer.id)}
                            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Seller</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Lorry No.</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Unload Date</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Buying Date</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Bargain Date</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Bill Name</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Item</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Amount</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Total Commission</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {lorries.map((lorry) => (
                  <tr key={lorry.id}>
                    <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{lorry.sellerName}</td>
                    <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{lorry.lorryNumber}</td>
                    <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{lorry.unloadDate}</td>
                    <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{lorry.buyingDate}</td>
                    <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{lorry.bargainDate}</td>
                    <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{lorry.billName}</td>
                    <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{lorry.itemName}</td>
                    <td className="p-3 text-sm text-gray-800 dark:text-gray-100">₹{lorry.amount.toLocaleString()}</td>
                    <td className="p-3 text-sm text-gray-800 dark:text-gray-100">₹{lorry.totalCommission.toLocaleString()}</td>
                    <td className="p-3">
                      <div className="flex justify-end gap-2">
                        <button className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                          Edit
                        </button>
                        <button 
                          onClick={() => onDeleteLorry(lorry.id)}
                          className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}