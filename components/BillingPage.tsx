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

    // Filter lorries by seller name (matches both seller mode and buyer mode lorries)
    const sellerLorries = lorries.filter(lorry => 
      lorry.sellerName.toLowerCase() === seller.name.toLowerCase()
    )
    
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

    // Filter lorries by buyer name (only buyer mode lorries where this buyer purchased)
    const buyerLorries = lorries.filter(lorry => 
      lorry.counterpartyName && lorry.counterpartyName.toLowerCase() === buyer.name.toLowerCase()
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

  const handlePrintBill = (bill: any) => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank', 'width=800,height=600')
    if (!printWindow) {
      alert('Please allow pop-ups to print the bill')
      return
    }

    // Calculate total commission for all items
    const totalCommission = bill.items.reduce((sum: number, item: any) => sum + item.totalCommission, 0)
    const totalAmount = bill.items.reduce((sum: number, item: any) => sum + item.amount, 0)

    // Generate HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Bill - ${bill.billNumber}</title>
        <style>
          @media print {
            @page { margin: 1cm; }
            body { margin: 0; }
          }
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background: white;
            color: black;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 15px;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            color: #333;
          }
          .bill-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            padding: 10px;
            background: #f5f5f5;
          }
          .bill-info div {
            flex: 1;
          }
          .bill-info strong {
            display: block;
            margin-bottom: 5px;
            color: #555;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 12px;
          }
          th {
            background-color: #333;
            color: white;
            padding: 10px 5px;
            text-align: left;
            font-weight: bold;
            border: 1px solid #333;
          }
          td {
            padding: 8px 5px;
            border: 1px solid #ddd;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .totals {
            margin-top: 20px;
            text-align: right;
            font-size: 14px;
          }
          .totals div {
            margin: 5px 0;
            padding: 5px 10px;
          }
          .totals .grand-total {
            font-size: 16px;
            font-weight: bold;
            background: #333;
            color: white;
            padding: 10px;
            margin-top: 10px;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 15px;
          }
          .print-btn {
            position: fixed;
            top: 10px;
            right: 10px;
            padding: 10px 20px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
          }
          .print-btn:hover {
            background: #45a049;
          }
          @media print {
            .print-btn { display: none; }
          }
        </style>
      </head>
      <body>
        <button class="print-btn" onclick="window.print()">🖨️ Print</button>
        
        <div class="header">
          <h1>THIRUMALA BROKER</h1>
          <p>Bill Document</p>
        </div>

        <div class="bill-info">
          <div>
            <strong>Bill Number:</strong>
            ${bill.billNumber}
          </div>
          <div>
            <strong>Party Name:</strong>
            ${bill.party}
          </div>
          <div>
            <strong>Party Type:</strong>
            ${bill.partyType === 'seller' ? 'Seller' : 'Buyer'}
          </div>
          <div>
            <strong>Generated Date:</strong>
            ${bill.date}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Lorry No.</th>
              <th>${bill.partyType === 'seller' ? 'Buyer Name' : 'Seller Name'}</th>
              <th>Unload Date</th>
              <th>Buying Date</th>
              <th>Bargain Date</th>
              <th>Bill Type</th>
              <th>Bill Name</th>
              <th>Bill Number</th>
              <th>Item</th>
              <th>Quantity</th>
              <th>Amount</th>
              <th>Commission</th>
              <th>Total Commission</th>
            </tr>
          </thead>
          <tbody>
            ${bill.items.map((item: any, index: number) => `
              <tr>
                <td>${index + 1}</td>
                <td>${item.lorryNumber}</td>
                <td>${item.counterpartyName}</td>
                <td>${item.unloadDate}</td>
                <td>${item.buyingDate}</td>
                <td>${item.bargainDate}</td>
                <td>${item.billType || 'local'}</td>
                <td>${item.billName || '-'}</td>
                <td>${item.billNumber || '-'}</td>
                <td>${item.itemName}</td>
                <td>${item.quantity}</td>
                <td>₹${item.amount.toLocaleString()}</td>
                <td>₹${item.commission.toLocaleString()}</td>
                <td>₹${item.totalCommission.toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <div><strong>Total Amount:</strong> ₹${totalAmount.toLocaleString()}</div>
          <div class="grand-total">
            <strong>Grand Total Commission:</strong> ₹${totalCommission.toLocaleString()}
          </div>
        </div>

        <div class="footer">
          <p>This is a computer-generated bill. Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          <p>Thirumala Broker - Contact: [Your Contact Info]</p>
        </div>

        <script>
          // Auto print when page loads (optional)
          // window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()
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
                  <div className="grid grid-cols-1 gap-4">
                    <button
                      onClick={() => generateSellerBill(selectedSeller, 'Seller Bill')}
                      className="bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                    >
                      Generate Bill
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
                  <div className="grid grid-cols-1 gap-4">
                    <button
                      onClick={() => generateBuyerBill(selectedBuyer, 'Buyer Bill')}
                      className="bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                    >
                      Generate Bill
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
          
          {generatedBills.length > 0 ? generatedBills.map((bill) => {
            const totalAmount = bill.items.reduce((sum: number, item: any) => sum + item.amount, 0)
            const totalCommission = bill.items.reduce((sum: number, item: any) => sum + item.totalCommission, 0)
            
            return (
              <div key={bill.id} className="mb-6 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                {/* Bill Header */}
                <div className="bg-gray-50 dark:bg-gray-800 p-4 flex justify-between items-center">
                  <div className="flex gap-6">
                    <div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Bill Number:</span>
                      <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{bill.billNumber}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Party Name:</span>
                      <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{bill.party}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Type:</span>
                      <p className="text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          bill.partyType === 'seller' 
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' 
                            : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                        }`}>
                          {bill.partyType === 'seller' ? 'Seller' : 'Buyer'}
                        </span>
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Date:</span>
                      <p className="text-sm text-gray-800 dark:text-gray-100">{bill.date}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handlePrintBill(bill)}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm font-medium transition-colors"
                  >
                    🖨️ View/Print Bill
                  </button>
                </div>

                {/* Lorries Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-700">
                        <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Lorry Number</th>
                        <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
                          {bill.partyType === 'seller' ? 'Buyer Name' : 'Seller Name'}
                        </th>
                        <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Unload Date</th>
                        <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Buying Date</th>
                        <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Bargain Date</th>
                        <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Bill Type</th>
                        <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Bill Name</th>
                        <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Bill Number</th>
                        <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Item Name</th>
                        <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Quantity</th>
                        <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Amount</th>
                        <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Commission</th>
                        <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Total Commission</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {bill.items.map((lorry: any, index: number) => (
                        <tr key={`${bill.id}-${lorry.id || index}`}>
                          <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{lorry.lorryNumber}</td>
                          <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{lorry.counterpartyName}</td>
                          <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{lorry.unloadDate}</td>
                          <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{lorry.buyingDate}</td>
                          <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{lorry.bargainDate}</td>
                          <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{lorry.billType || 'local'}</td>
                          <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{lorry.billName || '-'}</td>
                          <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{lorry.billNumber || '-'}</td>
                          <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{lorry.itemName}</td>
                          <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{lorry.quantity}</td>
                          <td className="p-3 text-sm text-gray-800 dark:text-gray-100">₹{lorry.amount.toLocaleString()}</td>
                          <td className="p-3 text-sm text-gray-800 dark:text-gray-100">₹{lorry.commission.toLocaleString()}</td>
                          <td className="p-3 text-sm text-gray-800 dark:text-gray-100">₹{lorry.totalCommission.toLocaleString()}</td>
                        </tr>
                      ))}
                      {/* Totals Row */}
                      <tr className="bg-gray-50 dark:bg-gray-800 font-bold">
                        <td colSpan={10} className="p-3 text-right text-sm text-gray-800 dark:text-gray-100">
                          TOTAL ({bill.items.length} Lorries):
                        </td>
                        <td className="p-3 text-sm text-gray-800 dark:text-gray-100">₹{totalAmount.toLocaleString()}</td>
                        <td className="p-3 text-sm text-gray-800 dark:text-gray-100"></td>
                        <td className="p-3 text-sm text-green-600 dark:text-green-400">₹{totalCommission.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )
          }) : (
            <div className="text-center py-12 text-gray-600 dark:text-gray-300">
              No bills generated yet. Select a seller or buyer and generate bills.
            </div>
          )}
        </div>
    </div>
  )
}