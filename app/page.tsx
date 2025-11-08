'use client'

import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import SellerForm from '../components/SellerForm'
import BuyerForm from '../components/BuyerForm'
import LorryForm from '../components/LorryForm'
import DataTable from '../components/DataTable'
import BillingPage from '../components/BillingPage'
import DailyLedgerPage from '../components/DailyLedgerPage'
import { apiClient } from '../lib/api'

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
  const [activeTab, setActiveTab] = useState('')
  
  const scrollToDetails = () => {
    const detailsSection = document.getElementById('details-section')
    if (detailsSection) {
      detailsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleViewSellerDetails = () => {
    setActiveTab('sellers')
    setTimeout(scrollToDetails, 100)
  }

  const handleViewLorryDetails = () => {
    setActiveTab('lorries')
    setTimeout(scrollToDetails, 100)
  }
  
  const [sellers, setSellers] = useState<Seller[]>([])

  const [buyers, setBuyers] = useState<Buyer[]>([])

  // Fetch sellers from backend on mount
  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await apiClient.get('/sellers')
        if (response.success && response.data) {
          // Map the backend data to match our interface
          const mappedSellers = response.data.map((seller: any) => ({
            id: seller._id || seller.id,
            name: seller.name,
            address: seller.address,
            mobile: seller.contact || seller.mobile
          }))
          setSellers(mappedSellers)
        }
      } catch (error) {
        console.error('Failed to fetch sellers:', error)
      }
    }

    const fetchBuyers = async () => {
      try {
        const response = await apiClient.get('/buyers')
        if (response.success && response.data) {
          // Map the backend data to match our interface
          const mappedBuyers = response.data.map((buyer: any) => ({
            id: buyer._id || buyer.id,
            name: buyer.name,
            address: buyer.address,
            mobile: buyer.contact || buyer.mobile
          }))
          setBuyers(mappedBuyers)
        }
      } catch (error) {
        console.error('Failed to fetch buyers:', error)
      }
    }

    fetchSellers()
    fetchBuyers()
  }, [])

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

  const addSeller = async (seller: Omit<Seller, 'id'>) => {
    // The seller is already added to backend by SellerForm, just refresh the list
    try {
      const response = await apiClient.get('/sellers')
      if (response.success && response.data) {
        const mappedSellers = response.data.map((s: any) => ({
          id: s._id || s.id,
          name: s.name,
          address: s.address,
          mobile: s.contact || s.mobile
        }))
        setSellers(mappedSellers)
      }
    } catch (error) {
      console.error('Failed to refresh sellers:', error)
      // Fallback: add to local state
      setSellers([...sellers, { ...seller, id: Date.now() }])
    }
  }

  const addBuyer = async (buyer: Omit<Buyer, 'id'>) => {
    // The buyer is already added to backend by BuyerForm, just refresh the list
    try {
      const response = await apiClient.get('/buyers')
      if (response.success && response.data) {
        const mappedBuyers = response.data.map((b: any) => ({
          id: b._id || b.id,
          name: b.name,
          address: b.address,
          mobile: b.contact || b.mobile
        }))
        setBuyers(mappedBuyers)
      }
    } catch (error) {
      console.error('Failed to refresh buyers:', error)
      // Fallback: add to local state
      setBuyers([...buyers, { ...buyer, id: Date.now() }])
    }
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
                  <SellerForm onAddSeller={addSeller} onViewDetails={handleViewSellerDetails} />
                  <LorryForm sellers={sellers} onAddLorry={addLorry} mode="seller" />
                  <div id="details-section">
                    <DataTable 
                      sellers={sellers}
                      lorries={lorries}
                      activeTab={activeTab}
                      setActiveTab={setActiveTab}
                      onDeleteSeller={deleteSeller}
                      onDeleteLorry={deleteLorry}
                      mode="seller"
                    />
                  </div>
                </>
              )}

              {activePage === 'buyer' && (
                <>
                  <BuyerForm onAddBuyer={addBuyer} onViewDetails={handleViewLorryDetails} />
                  <LorryForm buyers={buyers} onAddLorry={addLorry} mode="buyer" />
                  <div id="details-section">
                    <DataTable 
                      buyers={buyers}
                      lorries={lorries}
                      activeTab={activeTab}
                      setActiveTab={setActiveTab}
                      onDeleteBuyer={deleteBuyer}
                      onDeleteLorry={deleteLorry}
                      mode="buyer"
                    />
                  </div>
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