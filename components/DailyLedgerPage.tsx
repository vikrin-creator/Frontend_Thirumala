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
  conditionFromDate: string
  conditionToDate: string
}

interface DailyLedgerPageProps {
  sellers: Seller[]
  buyers: Buyer[]
  ledgerEntries: LedgerEntry[]
  onAddLedger: (entry: Omit<LedgerEntry, 'id'>) => void
  onEditLedger: (id: number | string, data: Partial<LedgerEntry>) => void
  onDeleteLedger: (id: number | string) => void
}

export default function DailyLedgerPage({ 
  sellers, 
  buyers,
  ledgerEntries,
  onAddLedger,
  onEditLedger,
  onDeleteLedger
}: DailyLedgerPageProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [editingId, setEditingId] = useState<number | string | null>(null)
  const [editFormData, setEditFormData] = useState<Partial<LedgerEntry>>({})
  const [formData, setFormData] = useState({
    sellerName: '',
    buyerName: '',
    loaded: 'No' as 'Yes' | 'No',
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
    onDeleteLedger(id)
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
            @page { 
              size: A4; 
              margin: 15mm; 
            }
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 100%;
              margin: 0;
              padding: 20px;
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #333;
              padding-bottom: 15px;
              margin-bottom: 25px;
            }
            .header h1 {
              margin: 0 0 5px 0;
              font-size: 24px;
              color: #000;
            }
            .header h2 {
              margin: 5px 0;
              font-size: 18px;
              color: #666;
              font-weight: normal;
            }
            .meta-info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 25px;
              padding: 10px;
              background-color: #f5f5f5;
              border-radius: 5px;
            }
            .meta-info div {
              font-size: 14px;
            }
            .meta-info strong {
              color: #000;
            }
            .entry {
              border: 2px solid #ddd;
              border-radius: 8px;
              padding: 15px;
              margin-bottom: 20px;
              page-break-inside: avoid;
              background-color: #fff;
            }
            .entry-header {
              background-color: #f44336;
              color: white;
              padding: 10px 15px;
              margin: -15px -15px 15px -15px;
              border-radius: 6px 6px 0 0;
              font-weight: bold;
              font-size: 16px;
            }
            .entry-content {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 12px;
            }
            .entry-field {
              display: flex;
              padding: 8px 0;
            }
            .entry-field label {
              font-weight: bold;
              min-width: 140px;
              color: #555;
            }
            .entry-field value {
              color: #000;
              flex: 1;
            }
            .status-badge {
              display: inline-block;
              padding: 4px 12px;
              background-color: #f44336;
              color: white;
              border-radius: 12px;
              font-size: 12px;
              font-weight: bold;
            }
            .footer {
              margin-top: 30px;
              padding-top: 15px;
              border-top: 2px solid #ddd;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
            .summary {
              background-color: #fff3cd;
              border: 2px solid #ffc107;
              border-radius: 8px;
              padding: 15px;
              margin-bottom: 25px;
              text-align: center;
            }
            .summary h3 {
              margin: 0 0 10px 0;
              color: #856404;
              font-size: 18px;
            }
            .summary p {
              margin: 5px 0;
              font-size: 16px;
              color: #856404;
            }
            @media print {
              body { padding: 0; }
              .entry { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>═══════════════════════════════════════</h1>
            <h1>PENDING LORRY REPORT</h1>
            <h2>Thirumala Broker System</h2>
            <h1>═══════════════════════════════════════</h1>
          </div>

          <div class="meta-info">
            <div><strong>Generated On:</strong> ${dateStr} at ${timeStr}</div>
            <div><strong>Total Pending:</strong> ${pendingEntries.length} ${pendingEntries.length === 1 ? 'Entry' : 'Entries'}</div>
          </div>

          <div class="summary">
            <h3>⚠️ ATTENTION REQUIRED</h3>
            <p><strong>${pendingEntries.length}</strong> lorry ${pendingEntries.length === 1 ? 'entry' : 'entries'} pending (NOT LOADED)</p>
          </div>

          ${pendingEntries.map((entry, index) => `
            <div class="entry">
              <div class="entry-header">
                Entry #${index + 1}
              </div>
              <div class="entry-content">
                <div class="entry-field">
                  <label>🏢 Seller Name:</label>
                  <value>${entry.sellerName}</value>
                </div>
                <div class="entry-field">
                  <label>👤 Buyer Name:</label>
                  <value>${entry.buyerName}</value>
                </div>
                <div class="entry-field">
                  <label>📅 Condition From:</label>
                  <value>${entry.conditionFromDate}</value>
                </div>
                <div class="entry-field">
                  <label>📅 Condition To:</label>
                  <value>${entry.conditionToDate}</value>
                </div>
                <div class="entry-field">
                  <label>📦 Loaded Status:</label>
                  <value><span class="status-badge">❌ NOT LOADED</span></value>
                </div>
              </div>
            </div>
          `).join('')}

          <div class="footer">
            <p>═══════════════════════════════════════</p>
            <p><strong>Thirumala Broker System</strong></p>
            <p>This is a system-generated report | Please take necessary action</p>
          </div>

          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()
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
              <>
                <button 
                  type="button"
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-base font-bold leading-normal transition-all duration-300 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95"
                >
                  {showDetails ? 'Hide Details' : 'View All Ledgers'}
                </button>
                <button 
                  type="button"
                  onClick={handleDownloadLedger}
                  className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white text-base font-bold leading-normal transition-all duration-300 hover:from-green-600 hover:to-green-700 hover:shadow-lg hover:shadow-green-500/25 active:scale-95"
                >
                  Download Ledger
                </button>
              </>
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
                    <td className="p-3 text-gray-800 dark:text-gray-200 text-sm font-medium">
                      {entry.sellerName}
                    </td>
                    <td className="p-3 text-gray-800 dark:text-gray-200 text-sm font-medium">
                      {entry.buyerName}
                    </td>
                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        entry.loaded === 'Yes' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {entry.loaded}
                      </span>
                    </td>
                    <td className="p-3 text-gray-800 dark:text-gray-200 text-sm">
                      {entry.conditionFromDate}
                    </td>
                    <td className="p-3 text-gray-800 dark:text-gray-200 text-sm">
                      {entry.conditionToDate}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(entry)}
                          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-medium transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-medium transition-colors"
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
