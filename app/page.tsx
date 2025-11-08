'use client'

import React, { useState } from 'react'
import Header from '../components/Header'
import SellerForm from '../components/SellerForm'
import BuyerForm from '../components/BuyerForm'
import LorryForm from '../components/LorryForm'
import DataTable from '../components/DataTable'
import BillingPage from '../components/BillingPage'
import DailyLedgerPage from '../components/DailyLedgerPage'

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

export default function Home() {
  const [activePage, setActivePage] = useState('seller')
  
  const [sellers, setSellers] = useState<Seller[]>([
    {
      id: 1,
      name: 'John Doe',
      address: '123 Main St, Anytown, USA',
      mobile: '987-654-3210'
    },
    {
      id: 2,
      name: 'Jane Smith',
      address: '456 Oak Ave, Sometown, USA',
      mobile: '123-456-7890'
    }
  ])

  const [buyers, setBuyers] = useState<Buyer[]>([
    {
      id: 1,
      name: 'ABC Industries',
      address: '789 Industrial Park, Business City, USA',
      mobile: '555-123-4567'
    },
    {
      id: 2,
      name: 'XYZ Corp',
      address: '321 Corporate Blvd, Metro City, USA',
      mobile: '555-987-6543'
    }
  ])

  const [lorries, setLorries] = useState<Lorry[]>([
    {
      id: 1,
      sellerId: 1,
      sellerName: 'John Doe',
      lorryNumber: 'MH12AB1234',
      unloadDate: '2023-10-27',
      buyingDate: '2023-10-26',
      bargainDate: '2023-10-25',
      billName: 'Bill-001',
      billNumber: 'B001',
      itemName: 'Steel Bars',
      quantity: 100,
      amount: 50000,
      commission: 50,
      totalCommission: 5000
    }
  ])

  const [activeTab, setActiveTab] = useState('sellers')

  const addSeller = (seller: Omit<Seller, 'id'>) => {
    setSellers([...sellers, { ...seller, id: Date.now() }])
  }

  const addBuyer = (buyer: Omit<Buyer, 'id'>) => {
    setBuyers([...buyers, { ...buyer, id: Date.now() }])
  }

  const addLorry = (lorry: Omit<Lorry, 'id' | 'sellerName' | 'totalCommission'>) => {
    const seller = sellers.find(s => s.id === parseInt(lorry.sellerId.toString()))
    setLorries([...lorries, { 
      ...lorry, 
      id: Date.now(), 
      sellerName: seller?.name || '',
      totalCommission: lorry.quantity * lorry.commission 
    }])
  }

  const deleteSeller = (id: number) => {
    setSellers(sellers.filter(s => s.id !== id))
  }

  const deleteBuyer = (id: number) => {
    setBuyers(buyers.filter(b => b.id !== id))
  }

  const deleteLorry = (id: number) => {
    setLorries(lorries.filter(l => l.id !== id))
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col glass-overlay backdrop-blur-sm">
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 flex flex-1 justify-center py-3 sm:py-4 lg:py-5">
          <div className="layout-content-container flex flex-col w-full max-w-7xl flex-1">
            <Header activePage={activePage} setActivePage={setActivePage} />
            
            <main className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
              <div className="flex flex-wrap justify-center sm:justify-between gap-3 px-2 sm:px-4">
                <h1 className="gradient-text text-2xl sm:text-3xl lg:text-4xl font-black leading-tight tracking-[-0.033em] text-center sm:text-left">
                  {activePage === 'seller' && 'Seller Management'}
                  {activePage === 'buyer' && 'Buyer Management'}
                  {activePage === 'billing' && 'Billing Management'}
                  {activePage === 'ledger' && 'Daily Ledger'}
                </h1>
              </div>

              {activePage === 'seller' && (
                <>
                  <SellerForm onAddSeller={addSeller} />
                  <LorryForm sellers={sellers} onAddLorry={addLorry} mode="seller" />
                  <DataTable 
                    sellers={sellers}
                    lorries={lorries}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    onDeleteSeller={deleteSeller}
                    onDeleteLorry={deleteLorry}
                    mode="seller"
                  />
                </>
              )}

              {activePage === 'buyer' && (
                <>
                  <BuyerForm onAddBuyer={addBuyer} />
                  <LorryForm buyers={buyers} onAddLorry={addLorry} mode="buyer" />
                  <DataTable 
                    buyers={buyers}
                    lorries={lorries}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    onDeleteBuyer={deleteBuyer}
                    onDeleteLorry={deleteLorry}
                    mode="buyer"
                  />
                </>
              )}

              {activePage === 'billing' && (
                <BillingPage 
                  sellers={sellers}
                  buyers={buyers}
                  lorries={lorries}
                />
              )}

              {activePage === 'ledger' && (
                <DailyLedgerPage 
                  sellers={sellers}
                  buyers={buyers}
                />
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}