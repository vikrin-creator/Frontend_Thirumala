'use client'

import React, { useState } from 'react'

interface Seller {
  id: number | string
  name: string
  address: string
  mobile: string
  city?: string
  gst_number?: string
}

interface Lorry {
  id: number
  sellerId: number | string
  sellerName: string
  lorryNumber: string
  counterpartyName: string
  unloadDate: string
  buyingDate: string
  bargainDate: string
  billType: string
  billName: string
  billNumber: string
  itemName: string
  quantity: number
  rate: number
  commission: number
  totalCommission: number
}

interface Buyer {
  id: number | string
  name: string
  address: string
  mobile: string
  city?: string
  gst_number?: string
}

interface DataTableProps {
  sellers?: Seller[]
  buyers?: Buyer[]
  lorries: Lorry[]
  activeTab: string
  setActiveTab: (tab: string) => void
  onDeleteSeller?: (id: number | string) => void
  onDeleteBuyer?: (id: number | string) => void
  onEditSeller?: (id: number | string, data: Partial<Seller>) => void
  onEditBuyer?: (id: number | string, data: Partial<Buyer>) => void
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
  onEditSeller,
  onEditBuyer,
  onDeleteLorry,
  mode 
}: DataTableProps) {
  const [editingId, setEditingId] = useState<number | string | null>(null)
  const [editFormData, setEditFormData] = useState<Partial<Seller | Buyer>>({})

  const handleEditClick = (item: Seller | Buyer) => {
    setEditingId(item.id)
    setEditFormData({
      name: item.name,
      address: item.address,
      mobile: item.mobile,
      city: item.city,
      gst_number: item.gst_number
    })
  }

  const handleSaveEdit = (id: number | string) => {
    if (mode === 'seller' && onEditSeller) {
      onEditSeller(id, editFormData)
    } else if (mode === 'buyer' && onEditBuyer) {
      onEditBuyer(id, editFormData)
    }
    setEditingId(null)
    setEditFormData({})
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditFormData({})
  }

  return (
    <div className="form-container">
      <h2 className="text-gray-800 dark:text-gray-100 text-[22px] font-bold leading-tight tracking-[-0.015em] px-0 pb-4">
        View & Edit Details
      </h2>
      
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={() => setActiveTab(activeTab === (mode === 'seller' ? 'sellers' : 'buyers') ? '' : (mode === 'seller' ? 'sellers' : 'buyers'))}
            className="px-6 py-3 rounded-xl text-base font-bold transition-all duration-300 bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25 hover:from-purple-600 hover:to-purple-700 active:scale-95 w-full sm:w-auto"
          >
            {mode === 'seller' ? 'View Seller Details' : 'View Buyer Details'}
          </button>
          <button 
            onClick={() => setActiveTab(activeTab === 'lorries' ? '' : 'lorries')}
            className="px-6 py-3 rounded-xl text-base font-bold transition-all duration-300 bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 hover:from-blue-600 hover:to-blue-700 active:scale-95 w-full sm:w-auto"
          >
            View Lorry Details
          </button>
        </div>

        {activeTab && (
          <div className="overflow-x-auto">
            {(activeTab === 'sellers' || activeTab === 'buyers') ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50">
                    <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Name</th>
                    <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Address</th>
                    <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Mobile Number</th>
                    <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {mode === 'seller' ? (
                  sellers.map((seller) => (
                    <tr key={seller.id}>
                      {editingId === seller.id ? (
                        <>
                          <td className="p-3">
                            <input
                              type="text"
                              value={editFormData.name || ''}
                              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="text"
                              value={editFormData.address || ''}
                              onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="text"
                              value={editFormData.mobile || ''}
                              onChange={(e) => setEditFormData({ ...editFormData, mobile: e.target.value })}
                              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            />
                          </td>
                          <td className="p-3">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => handleSaveEdit(seller.id)}
                                className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-semibold hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                              >
                                ✓ Save
                              </button>
                              <button 
                                onClick={handleCancelEdit}
                                className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                              >
                                ✕ Cancel
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{seller.name}</td>
                          <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{seller.address}</td>
                          <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{seller.mobile}</td>
                          <td className="p-3">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => handleEditClick(seller)}
                                className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                              >
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
                        </>
                      )}
                    </tr>
                  ))
                ) : (
                  buyers.map((buyer) => (
                    <tr key={buyer.id}>
                      {editingId === buyer.id ? (
                        <>
                          <td className="p-3">
                            <input
                              type="text"
                              value={editFormData.name || ''}
                              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="text"
                              value={editFormData.address || ''}
                              onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="text"
                              value={editFormData.mobile || ''}
                              onChange={(e) => setEditFormData({ ...editFormData, mobile: e.target.value })}
                              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            />
                          </td>
                          <td className="p-3">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => handleSaveEdit(buyer.id)}
                                className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-semibold hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                              >
                                ✓ Save
                              </button>
                              <button 
                                onClick={handleCancelEdit}
                                className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                              >
                                ✕ Cancel
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{buyer.name}</td>
                          <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{buyer.address}</td>
                          <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{buyer.mobile}</td>
                          <td className="p-3">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => handleEditClick(buyer)}
                                className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                              >
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
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : activeTab === 'lorries' ? (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
                    {mode === 'seller' ? 'Seller' : 'Buyer'}
                  </th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Lorry No.</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
                    {mode === 'seller' ? 'Buyer Name' : 'Seller Name'}
                  </th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Unload Date</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Buying Date</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Bargain Date</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Bill Type</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Bill Name</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Bill Number</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Item</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Quantity</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Rate</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Commission</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Total Commission</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {lorries.map((lorry) => (
                  <tr key={lorry.id}>
                    <td className="p-3 text-sm text-gray-800 dark:text-gray-100">
                      {mode === 'seller' ? lorry.sellerName : lorry.counterpartyName}
                    </td>
                    <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{lorry.lorryNumber}</td>
                    <td className="p-3 text-sm text-gray-800 dark:text-gray-100">
                      {mode === 'seller' ? lorry.counterpartyName : lorry.sellerName}
                    </td>
                    <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{lorry.unloadDate}</td>
                    <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{lorry.buyingDate}</td>
                    <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{lorry.bargainDate}</td>
                    <td className="p-3 text-sm text-gray-800 dark:text-gray-100">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        lorry.billType === 'local' 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      }`}>
                        {lorry.billType === 'local' ? 'Local' : 'Imported'}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{lorry.billName}</td>
                    <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{lorry.billNumber}</td>
                    <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{lorry.itemName}</td>
                    <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{lorry.quantity}</td>
                    <td className="p-3 text-sm text-gray-800 dark:text-gray-100">₹{lorry.rate.toLocaleString()}</td>
                    <td className="p-3 text-sm text-gray-800 dark:text-gray-100">₹{lorry.commission.toLocaleString()}</td>
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
          ) : null}
          </div>
        )}
      </div>
    </div>
  )
}