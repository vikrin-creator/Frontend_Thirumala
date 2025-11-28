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
  rate: number
  commission: number
  totalCommission: number
}

interface BillingPageProps {
  sellers: Seller[]
  buyers: Buyer[]
  sellerLorries: Lorry[]
  buyerLorries: Lorry[]
}

export default function BillingPage({ sellers, buyers, sellerLorries, buyerLorries }: BillingPageProps) {
  const [activeBillTab, setActiveBillTab] = useState<'seller' | 'buyer'>('seller')
  const [selectedSeller, setSelectedSeller] = useState('')
  const [selectedBuyer, setSelectedBuyer] = useState('')
  const [sellerSearch, setSellerSearch] = useState('')
  const [buyerSearch, setBuyerSearch] = useState('')
  const [showSellerDropdown, setShowSellerDropdown] = useState(false)
  const [showBuyerDropdown, setShowBuyerDropdown] = useState(false)
  const [generatedBills, setGeneratedBills] = useState<any[]>([])
  const totalCommission = [...sellerLorries, ...buyerLorries].reduce((sum, lorry) => sum + lorry.totalCommission, 0)
  const totalAmount = [...sellerLorries, ...buyerLorries].reduce((sum, lorry) => sum + lorry.rate, 0)

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

    // Filter only seller lorries for this seller
    const filteredSellerLorries = sellerLorries.filter(lorry => 
      lorry.sellerName.toLowerCase() === seller.name.toLowerCase()
    )
    
    const totalCommissionForSeller = filteredSellerLorries.reduce((sum, lorry) => sum + lorry.totalCommission, 0)
    
    // Check if total exceeds ₹50,000
    if (totalCommissionForSeller > 50000) {
      // Split lorries into two parts for dual bills
      const midPoint = Math.ceil(filteredSellerLorries.length / 2)
      const firstHalf = filteredSellerLorries.slice(0, midPoint)
      const secondHalf = filteredSellerLorries.slice(midPoint)
      
      const firstHalfTotal = firstHalf.reduce((sum, lorry) => sum + lorry.totalCommission, 0)
      const secondHalfTotal = secondHalf.reduce((sum, lorry) => sum + lorry.totalCommission, 0)
      
      // Create TIRUMULA BROKERS bill
      const tirumulaBill = {
        id: Date.now(),
        type: billType,
        party: seller.name,
        partyType: 'seller',
        amount: firstHalfTotal,
        date: new Date().toLocaleDateString(),
        items: firstHalf,
        billNumber: `SB${Date.now()}`,
        companyName: 'TIRUMULA BROKERS'
      }
      
      // Create BALAJI BROKERS bill
      const balajiBill = {
        id: Date.now() + 1,
        type: billType,
        party: seller.name,
        partyType: 'seller',
        amount: secondHalfTotal,
        date: new Date().toLocaleDateString(),
        items: secondHalf,
        billNumber: `SB${Date.now() + 1}`,
        companyName: 'BALAJI BROKERS'
      }
      
      setGeneratedBills(prev => [balajiBill, tirumulaBill, ...prev])
      alert(`Dual bills generated for ${seller.name}\nTIRUMULA BROKERS: ₹${firstHalfTotal.toLocaleString()}\nBALAJI BROKERS: ₹${secondHalfTotal.toLocaleString()}\nTotal: ₹${totalCommissionForSeller.toLocaleString()}`)
    } else {
      // Single bill for amounts ≤ ₹50,000
      const newBill = {
        id: Date.now(),
        type: billType,
        party: seller.name,
        partyType: 'seller',
        amount: totalCommissionForSeller,
        date: new Date().toLocaleDateString(),
        items: filteredSellerLorries,
        billNumber: `SB${Date.now()}`,
        companyName: 'TIRUMULA BROKERS'
      }
      
      setGeneratedBills(prev => [newBill, ...prev])
      alert(`${billType} generated for ${seller.name} - Amount: ₹${totalCommissionForSeller.toLocaleString()}`)
    }
  }

  const generateBuyerBill = (buyerId: string, billType: string) => {
    const buyer = buyers.find(b => b.id.toString() === buyerId)
    if (!buyer) return

    // Filter only buyer lorries for this buyer
    const filteredBuyerLorries = buyerLorries.filter(lorry => 
      lorry.counterpartyName && lorry.counterpartyName.toLowerCase() === buyer.name.toLowerCase()
    )
    const totalCommissionForBuyer = filteredBuyerLorries.reduce((sum, lorry) => sum + lorry.totalCommission, 0)
    
    // Check if total exceeds ₹50,000
    if (totalCommissionForBuyer > 50000) {
      // Split lorries into two parts for dual bills
      const midPoint = Math.ceil(filteredBuyerLorries.length / 2)
      const firstHalf = filteredBuyerLorries.slice(0, midPoint)
      const secondHalf = filteredBuyerLorries.slice(midPoint)
      
      const firstHalfTotal = firstHalf.reduce((sum, lorry) => sum + lorry.totalCommission, 0)
      const secondHalfTotal = secondHalf.reduce((sum, lorry) => sum + lorry.totalCommission, 0)
      
      // Create TIRUMULA BROKERS bill
      const tirumulaBill = {
        id: Date.now(),
        type: billType,
        party: buyer.name,
        partyType: 'buyer',
        amount: firstHalfTotal,
        date: new Date().toLocaleDateString(),
        items: firstHalf,
        billNumber: `BB${Date.now()}`,
        companyName: 'TIRUMULA BROKERS'
      }
      
      // Create BALAJI BROKERS bill
      const balajiBill = {
        id: Date.now() + 1,
        type: billType,
        party: buyer.name,
        partyType: 'buyer',
        amount: secondHalfTotal,
        date: new Date().toLocaleDateString(),
        items: secondHalf,
        billNumber: `BB${Date.now() + 1}`,
        companyName: 'BALAJI BROKERS'
      }
      
      setGeneratedBills(prev => [balajiBill, tirumulaBill, ...prev])
      alert(`Dual bills generated for ${buyer.name}\nTIRUMULA BROKERS: ₹${firstHalfTotal.toLocaleString()}\nBALAJI BROKERS: ₹${secondHalfTotal.toLocaleString()}\nTotal: ₹${totalCommissionForBuyer.toLocaleString()}`)
    } else {
      // Single bill for amounts ≤ ₹50,000
      const newBill = {
        id: Date.now(),
        type: billType,
        party: buyer.name,
        partyType: 'buyer',
        amount: totalCommissionForBuyer,
        date: new Date().toLocaleDateString(),
        items: filteredBuyerLorries,
        billNumber: `BB${Date.now()}`,
        companyName: 'TIRUMULA BROKERS'
      }
      
      setGeneratedBills(prev => [newBill, ...prev])
      alert(`${billType} generated for ${buyer.name} - Amount: ₹${totalCommissionForBuyer.toLocaleString()}`)
    }
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
    const totalAmount = bill.items.reduce((sum: number, item: any) => sum + item.rate, 0)

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
            padding: 15px;
            background: white;
            color: black;
            font-size: 9px;
          }
          .header-container {
            border: 2px solid black;
            margin-bottom: 0;
          }
          .header {
            text-align: center;
            padding: 10px;
            border-bottom: 1px solid black;
            background: white;
          }
          .header h1 {
            margin: 0 0 5px 0;
            font-size: 14px;
            font-weight: bold;
            color: black;
          }
          .header .address {
            font-size: 8px;
            margin: 2px 0;
            line-height: 1.2;
          }
          .contact-info {
            display: flex;
            justify-content: space-between;
            padding: 5px 10px;
            font-size: 7px;
            border-bottom: 1px solid black;
          }
          .bill-title {
            text-align: center;
            padding: 8px;
            font-weight: bold;
            font-size: 11px;
            border-bottom: 1px solid black;
            background: #f0f0f0;
          }
          .party-info {
            padding: 8px 10px;
            border-bottom: 1px solid black;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }
          .party-left {
            flex: 1;
          }
          .party-right {
            text-align: right;
            font-size: 9px;
          }
          .party-info .name {
            font-weight: bold;
            font-size: 10px;
            margin-bottom: 3px;
          }
          .party-info .address {
            font-size: 9px;
            color: #333;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 8px;
          }
          th, td {
            border: 1px solid black;
            padding: 4px 3px;
            text-align: center;
            vertical-align: middle;
          }
          th {
            background-color: white;
            font-weight: bold;
            font-size: 7px;
            line-height: 1.1;
          }
          td {
            font-size: 8px;
          }
          .text-left { text-align: left !important; }
          .text-right { text-align: right !important; }
          td {
            padding: 8px 5px;
            border: 1px solid #ddd;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
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
        
        <div class="header-container">
          <div class="header">
            <h1>${bill.companyName || 'TIRUMALA BROKERS'}</h1>
            <div class="address">ADDRESS NO: ETUKURU ROAD, OPP FANCY DISUCTION PLAZA, GUNTUR, E-MAIL ID: ${bill.companyName === 'BALAJI BROKERS' ? 'tirumulasrinu@gmail.com' : 'tirumalabm@gmail.com'}</div>
          </div>
          
          <div class="contact-info">
            <div>SRINU: 9490126798</div>
            <div>KAREEM: 9848133973</div>
            <div>OFFICE: 08632238138, 08632238139</div>
          </div>
          
          <div class="bill-title">BROKERAGE BILL</div>
          
          <div class="party-info">
            <div class="party-left">
              <div class="name">NAME:- ${bill.party.toUpperCase()}</div>
              <div class="address">ADDRESS:- ${bill.items[0]?.sellerName || 'Guntur'}</div>
              <div style="margin-top: 10px; font-size: 10px;">MOBILE NO:-</div>
            </div>
            <div class="party-right">
              <div>BILL NO: ${bill.billNumber.replace('SB', '').replace('BB', '')}</div>
              <div style="margin-top: 20px;">DATE:- ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }).split('/').join('-')}</div>
            </div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Sl</th>
              <th>Bargain<br/>date</th>
              <th>Loading<br/>date</th>
              <th>SellerName</th>
              <th>Bill<br/>Number</th>
              <th>Item</th>
              <th>Rate</th>
              <th>Qts</th>
              <th>Broker<br/>age</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${bill.items.map((item: any, index: number) => `
              <tr>
                <td>${index + 1}</td>
                <td>${item.bargainDate}</td>
                <td>${item.unloadDate}</td>
                <td class="text-left">${item.sellerName}</td>
                <td>${item.billNumber}</td>
                <td class="text-left">${item.itemName}</td>
                <td class="text-right">${(item.rate || item.amount) ? (item.rate || item.amount) : '-'}</td>
                <td class="text-right">${item.quantity}</td>
                <td class="text-right">${item.commission || 0}</td>
                <td class="text-right">${item.totalCommission.toLocaleString()}</td>
              </tr>
            `).join('')}
            <tr style="border-top: 2px solid black; font-weight: bold; background-color: #f0f0f0;">
              <td colspan="9" style="text-align: right; padding: 8px; font-size: 12px;">TOTAL AMOUNT:</td>
              <td style="text-align: right; padding: 8px; font-size: 12px;">₹${totalCommission.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        <div style="margin-top: 20px; padding: 10px; border: 1px solid black; background-color: #f9f9f9;">
          <div style="font-weight: bold; font-size: 12px; margin-bottom: 8px; text-align: center;">BANK DETAILS</div>
          <div style="font-size: 10px; line-height: 1.4;">
            ${bill.companyName === 'BALAJI BROKERS' ? `
              <div><strong>BANK NAME:</strong> STATE OF INDIA BANK</div>
              <div><strong>ACCOUNT NUMBER:</strong> 33421252876</div>
              <div><strong>IFSC CODE:</strong> SBIN0004758</div>
              <div><strong>BANK ADDRESS:</strong> SANGADIGUNTA ETUKURI ROAD GUNTUR(04758)</div>
            ` : `
              <div><strong>BANK NAME:</strong> KOTAK MAHINDRA BANK</div>
              <div><strong>ACCOUNT NUMBER:</strong> 317011002606</div>
              <div><strong>IFSC CODE:</strong> KKBK0007746</div>
              <div><strong>BANK ADDRESS:</strong> GUNTUR MAIN</div>
            `}
          </div>
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
            const totalAmount = bill.items.reduce((sum: number, item: any) => sum + item.rate, 0)
            const totalCommission = bill.items.reduce((sum: number, item: any) => sum + item.totalCommission, 0)
            
            return (
              <div key={bill.id} className="mb-6 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                {/* Bill Header */}
                <div className="bg-gray-50 dark:bg-gray-800 p-4">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                      <div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Bill Number:</span>
                        <p className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-100">{bill.billNumber}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Party Name:</span>
                        <p className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-100">{bill.party}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Company:</span>
                        <p className="text-sm font-semibold text-green-600 dark:text-green-400">{bill.companyName || 'TIRUMULA BROKERS'}</p>
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
                      className="w-full md:w-auto px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm font-medium transition-colors"
                    >
                      🖨️ View/Print Bill
                    </button>
                  </div>
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
                        <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Rate</th>
                        <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Commission</th>
                        <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Total Commission</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {bill.items.map((lorry: any, index: number) => (
                        <tr key={`${bill.id}-${lorry.id || index}`}>
                          <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{lorry.lorryNumber}</td>
                          <td className="p-3 text-sm text-gray-800 dark:text-gray-100">
                            {bill.partyType === 'seller' ? lorry.counterpartyName : lorry.sellerName}
                          </td>
                          <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{lorry.unloadDate}</td>
                          <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{lorry.buyingDate}</td>
                          <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{lorry.bargainDate}</td>
                          <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{lorry.billType || 'local'}</td>
                          <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{lorry.billName || '-'}</td>
                          <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{lorry.billNumber || '-'}</td>
                          <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{lorry.itemName}</td>
                          <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{lorry.quantity}</td>
                          <td className="p-3 text-sm text-gray-800 dark:text-gray-100">
                            ₹{(bill.partyType === 'buyer' ? lorry.totalCommission : lorry.rate).toLocaleString()}
                          </td>
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