'use client'

import React, { useState } from 'react'

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

interface LedgerEntry {
  id: number | string
  sellerName: string
  buyerName: string
  loaded: 'Yes' | 'No'
  importLocal?: string
  conditionFromDate: string
  conditionToDate: string
  mode?: 'seller' | 'buyer'
}

interface DailyLedgerPageProps {
  sellers: Seller[]
  buyers: Buyer[]
  ledgerEntries: LedgerEntry[]
  onAddLedger: (entry: Omit<LedgerEntry, 'id'>) => void
  onEditLedger: (id: number | string, data: Partial<LedgerEntry>) => void
  onDeleteLedger: (id: number | string, mode?: 'seller' | 'buyer') => void
  mode?: 'seller' | 'buyer'
}

export default function DailyLedgerPage({ 
  sellers, 
  buyers,
  ledgerEntries,
  onAddLedger,
  onEditLedger,
  onDeleteLedger,
  mode = 'seller'
}: DailyLedgerPageProps) {
  const [showDetails, setShowDetails] = useState(true)
  const [editingId, setEditingId] = useState<number | string | null>(null)
  const [editFormData, setEditFormData] = useState<Partial<LedgerEntry>>({})
  const [formData, setFormData] = useState({
    sellerName: '',
    buyerName: '',
    loaded: 'No' as 'Yes' | 'No',
    importLocal: '',
    conditionFromDate: '',
    conditionToDate: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.sellerName && formData.buyerName && formData.conditionFromDate && formData.conditionToDate) {
      onAddLedger(formData)
      
      // Reset form
      setFormData({
        sellerName: '',
        buyerName: '',
        loaded: 'No',
        importLocal: '',
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

  const handleEditClick = (entry: LedgerEntry) => {
    setEditingId(entry.id)
    setEditFormData({
      sellerName: entry.sellerName,
      buyerName: entry.buyerName,
      loaded: entry.loaded,
      conditionFromDate: entry.conditionFromDate,
      conditionToDate: entry.conditionToDate
    })
  }

  const handleSaveEdit = (id: number | string) => {
    onEditLedger(id, editFormData)
    setEditingId(null)
    setEditFormData({})
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditFormData({})
  }

  const handleDelete = (id: number | string) => {
    onDeleteLedger(id, mode)
  }

  const handleDownloadLedger = () => {
    const pendingEntries = ledgerEntries.filter(entry => entry.loaded === 'No')
    
    if (pendingEntries.length === 0) {
      alert('No pending (unloaded) entries to download!')
      return
    }

    const now = new Date()
    const dateStr = now.toLocaleDateString('en-IN')
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Pending Lorry Report - ${dateStr}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background: #fff;
            color: #000;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
          }
          .header h1 {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .header p {
            font-size: 12px;
            color: #555;
          }
          .meta-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            font-size: 12px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th {
            background: #333;
            color: white;
            padding: 12px 8px;
            text-align: left;
            font-size: 13px;
            font-weight: bold;
            border: 1px solid #000;
          }
          td {
            padding: 10px 8px;
            border: 1px solid #ddd;
            font-size: 12px;
          }
          tr:nth-child(even) {
            background: #f9f9f9;
          }
          .status-no {
            color: #dc3545;
            font-weight: bold;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 11px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 10px;
          }
          @media print {
            body {
              padding: 10px;
            }
            table {
              page-break-inside: auto;
            }
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>PENDING LORRY REPORT</h1>
          <p>Thirumala Broker System</p>
        </div>

        <div class="meta-info">
          <div>Generated On: <strong>${dateStr} at ${timeStr}</strong></div>
          <div>Total Pending: <strong>${pendingEntries.length} ${pendingEntries.length === 1 ? 'Entry' : 'Entries'}</strong></div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 7%;">S.No</th>
              <th style="width: 20%;">Seller Name</th>
              <th style="width: 20%;">Buyer Name</th>
              <th style="width: 14%;">Condition From</th>
              <th style="width: 14%;">Condition To</th>
              <th style="width: 12%;">Import/Local</th>
              <th style="width: 13%;">Loaded Status</th>
            </tr>
          </thead>
          <tbody>
            ${pendingEntries.map((entry, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${entry.sellerName}</td>
                <td>${entry.buyerName}</td>
                <td>${new Date(entry.conditionFromDate).toLocaleDateString('en-IN')}</td>
                <td>${new Date(entry.conditionToDate).toLocaleDateString('en-IN')}</td>
                <td>${entry.importLocal || '-'}</td>
                <td class="status-no">NOT LOADED</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>Thirumala Broker System - This is a system-generated report</p>
        </div>
      </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
    }, 250)
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Daily Ledger Form */}
      <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6 lg:p-8 rounded-2xl form-container soft-shadow-lg">
        <h2 className="text-gray-900 dark:text-gray-100 text-lg sm:text-xl lg:text-[22px] font-bold leading-tight tracking-[-0.015em] px-0 pb-2">
          Add Daily Ledger Entry
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Seller Dropdown */}
            <label className="flex flex-col w-full">
              <p className="text-gray-900 dark:text-gray-200 text-base font-medium leading-normal pb-2">
                Seller <span className="text-red-500">*</span>
              </p>
              <select
                name="sellerName"
                value={formData.sellerName}
                onChange={handleChange}
                className="form-input soft-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-gray-900 dark:text-gray-100 focus:outline-0 h-12 p-3 text-base font-normal leading-normal"
                required
              >
                <option value="">Select Seller</option>
                {sellers.map((seller) => (
                  <option key={seller.id} value={seller.name}>
                    {seller.name}
                  </option>
                ))}
              </select>
            </label>

            {/* Buyer Dropdown */}
            <label className="flex flex-col w-full">
              <p className="text-gray-900 dark:text-gray-200 text-base font-medium leading-normal pb-2">
                Buyer <span className="text-red-500">*</span>
              </p>
              <select
                name="buyerName"
                value={formData.buyerName}
                onChange={handleChange}
                className="form-input soft-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-gray-900 dark:text-gray-100 focus:outline-0 h-12 p-3 text-base font-normal leading-normal"
                required
              >
                <option value="">Select Buyer</option>
                {buyers.map((buyer) => (
                  <option key={buyer.id} value={buyer.name}>
                    {buyer.name}
                  </option>
                ))}
              </select>
            </label>

            {/* Loaded Status Dropdown */}
            <label className="flex flex-col w-full">
              <p className="text-gray-900 dark:text-gray-200 text-base font-medium leading-normal pb-2">
                Loaded Status <span className="text-red-500">*</span>
              </p>
              <select
                name="loaded"
                value={formData.loaded}
                onChange={handleChange}
                className="form-input soft-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-gray-900 dark:text-gray-100 focus:outline-0 h-12 p-3 text-base font-normal leading-normal"
                required
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </label>

            {/* Import/Local Input */}
            <label className="flex flex-col w-full">
              <p className="text-gray-900 dark:text-gray-200 text-base font-medium leading-normal pb-2">
                Import/Local
              </p>
              <input
                type="text"
                name="importLocal"
                value={formData.importLocal}
                onChange={handleChange}
                placeholder="Enter Import/Local type"
                className="form-input soft-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-gray-900 dark:text-gray-100 focus:outline-0 h-12 p-3 text-base font-normal leading-normal"
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
          
          <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-3 pt-6">
            <button 
              type="submit"
              className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm sm:text-base font-bold leading-normal transition-all duration-300 hover:from-purple-600 hover:to-purple-700 hover:shadow-lg hover:shadow-purple-500/25 active:scale-95 w-full sm:w-auto"
            >
              Add Ledger Entry
            </button>
            <button 
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm sm:text-base font-bold leading-normal transition-all duration-300 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95 w-full sm:w-auto"
            >
              {showDetails ? 'Hide Details' : 'View All Ledgers'}
            </button>
            <button 
              type="button"
              onClick={handleDownloadLedger}
              className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white text-sm sm:text-base font-bold leading-normal transition-all duration-300 hover:from-green-600 hover:to-green-700 hover:shadow-lg hover:shadow-green-500/25 active:scale-95 w-full sm:w-auto"
            >
              Download Ledger
            </button>
          </div>
        </form>
      </div>

      {/* All Ledgers Details Section */}
      {showDetails && ledgerEntries.length > 0 && (
        <div className="flex flex-col gap-4 p-6 rounded-2xl form-container soft-shadow-lg">
          <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3">
            <h3 className="text-gray-900 dark:text-gray-100 text-base sm:text-lg lg:text-xl font-bold leading-tight">
              All Daily Ledger Entries
            </h3>
          </div>

          {/* Table View */}
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                  <th className="text-left p-2 sm:p-3 text-gray-900 dark:text-gray-100 font-semibold text-xs sm:text-sm">Seller</th>
                  <th className="text-left p-2 sm:p-3 text-gray-900 dark:text-gray-100 font-semibold text-xs sm:text-sm">Buyer</th>
                  <th className="text-left p-2 sm:p-3 text-gray-900 dark:text-gray-100 font-semibold text-xs sm:text-sm">Loaded</th>
                  <th className="text-left p-2 sm:p-3 text-gray-900 dark:text-gray-100 font-semibold text-xs sm:text-sm">Import/Local</th>
                  <th className="text-left p-2 sm:p-3 text-gray-900 dark:text-gray-100 font-semibold text-xs sm:text-sm">Condition From</th>
                  <th className="text-left p-2 sm:p-3 text-gray-900 dark:text-gray-100 font-semibold text-xs sm:text-sm">Condition To</th>
                  <th className="text-center p-2 sm:p-3 text-gray-900 dark:text-gray-100 font-semibold text-xs sm:text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ledgerEntries.map((entry) => (
                  <tr key={entry.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-2 sm:p-3 text-gray-800 dark:text-gray-200 text-xs sm:text-sm font-medium">
                      {entry.sellerName}
                    </td>
                    <td className="p-2 sm:p-3 text-gray-800 dark:text-gray-200 text-xs sm:text-sm font-medium">
                      {entry.buyerName}
                    </td>
                    <td className="p-2 sm:p-3">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                        entry.loaded === 'Yes' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {entry.loaded}
                      </span>
                    </td>
                    <td className="p-2 sm:p-3 text-gray-800 dark:text-gray-200 text-xs sm:text-sm">
                      {entry.importLocal || '-'}
                    </td>
                    <td className="p-2 sm:p-3 text-gray-800 dark:text-gray-200 text-xs sm:text-sm whitespace-nowrap">
                      {entry.conditionFromDate}
                    </td>
                    <td className="p-2 sm:p-3 text-gray-800 dark:text-gray-200 text-xs sm:text-sm whitespace-nowrap">
                      {entry.conditionToDate}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex flex-col sm:flex-row justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(entry)}
                          className="px-3 py-1.5 sm:py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="px-3 py-1.5 sm:py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
                        >
                          Delete
                        </button>
                      </div>
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
