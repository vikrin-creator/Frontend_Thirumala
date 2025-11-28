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
  id: number | string
  name: string
  address: string
  mobile: string
  city?: string
  gst_number?: string
}

interface Buyer {
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
  bargainDate: string
  buyingDate: string
  unloadDate: string
  
  
  billType: string
  billName: string
  billNumber: string
  itemName: string
  quantity: number
  rate: number
  commission: number
  totalCommission: number
}

interface LedgerEntry {
  id: number | string
  sellerName: string
  buyerName: string
  loaded: 'Yes' | 'No'
  importLocal?: string
  conditionFromDate: string
  conditionToDate: string
  mode?: 'seller' | 'buyer'  // Add mode field
}

export default function Home() {
  const [activePage, setActivePage] = useState('seller')
  const [activeTab, setActiveTab] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  
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

  const [sellerLedgerEntries, setSellerLedgerEntries] = useState<LedgerEntry[]>([])
  const [buyerLedgerEntries, setBuyerLedgerEntries] = useState<LedgerEntry[]>([])

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

    const fetchLedger = async () => {
      try {
        // Fetch seller ledger
        const sellerResponse = await apiClient.get('/seller-ledger')
        if (sellerResponse.success && sellerResponse.data) {
          const sellerEntries = sellerResponse.data.map((entry: any) => ({
            id: entry._id || entry.id,
            sellerName: entry.sellerName,
            buyerName: entry.buyerName,
            loaded: entry.loaded,
            importLocal: entry.importLocal,
            conditionFromDate: entry.conditionFromDate,
            conditionToDate: entry.conditionToDate,
            mode: 'seller' as const
          }))
          setSellerLedgerEntries(sellerEntries)
        }

        // Fetch buyer ledger
        const buyerResponse = await apiClient.get('/buyer-ledger')
        if (buyerResponse.success && buyerResponse.data) {
          const buyerEntries = buyerResponse.data.map((entry: any) => ({
            id: entry._id || entry.id,
            sellerName: entry.sellerName,
            buyerName: entry.buyerName,
            loaded: entry.loaded,
            importLocal: entry.importLocal,
            conditionFromDate: entry.conditionFromDate,
            conditionToDate: entry.conditionToDate,
            mode: 'buyer' as const
          }))
          setBuyerLedgerEntries(buyerEntries)
        }
      } catch (error) {
        console.error('Failed to fetch ledger entries:', error)
      }
    }

    const fetchLorries = async () => {
      try {
        const response = await apiClient.get('/lorries')
        if (response.success && response.data) {
          // Separate lorries by mode
          const sellerLorryList: Lorry[] = []
          const buyerLorryList: Lorry[] = []
          
          response.data.forEach((lorry: any) => {
            const mappedLorry = {
              id: lorry._id || lorry.id,
              sellerId: lorry.sellerId,
              sellerName: lorry.sellerName,
              lorryNumber: lorry.lorryNumber,
              counterpartyName: lorry.counterpartyName,
              unloadDate: lorry.unloadDate,
              buyingDate: lorry.buyingDate,
              bargainDate: lorry.bargainDate,
              billType: lorry.billType,
              billName: lorry.billName,
              billNumber: lorry.billNumber,
              itemName: lorry.itemName,
              quantity: lorry.quantity,
              rate: lorry.rate || lorry.amount || 0,
              commission: lorry.commission,
              totalCommission: lorry.totalCommission
            }
            
            if (lorry.mode === 'seller') {
              sellerLorryList.push(mappedLorry)
            } else {
              buyerLorryList.push(mappedLorry)
            }
          })
          
          setSellerLorries(sellerLorryList)
          setBuyerLorries(buyerLorryList)
        }
      } catch (error) {
        console.error('Failed to fetch lorries:', error)
      }
    }

    const loadAllData = async () => {
      setIsLoading(true)
      await Promise.all([
        fetchSellers(),
        fetchBuyers(),
        fetchLedger(),
        fetchLorries()
      ])
      setIsLoading(false)
    }

    loadAllData()
  }, [])

  // Separate lorry lists for seller and buyer modes
  const [sellerLorries, setSellerLorries] = useState<Lorry[]>([])

  const [buyerLorries, setBuyerLorries] = useState<Lorry[]>([])

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

  const addLorry = async (lorry: Omit<Lorry, 'id' | 'sellerName' | 'totalCommission'>, mode: 'seller' | 'buyer' = 'seller') => {
    try {
      const newLorry = { 
        ...lorry, 
        id: Date.now(), 
        sellerName: '',
        totalCommission: lorry.quantity * lorry.commission 
      }

      let sellerName = ''
      let buyerName = ''

      if (mode === 'seller') {
        const seller = sellers.find(s => s.id.toString() === lorry.sellerId.toString())
        newLorry.sellerName = seller?.name || ''
        sellerName = seller?.name || ''
        buyerName = lorry.counterpartyName
        // In seller mode: counterpartyName is buyer name (keep as is)
      } else {
        // In buyer mode: buyer is the main entity, seller is the counterparty
        const buyer = buyers.find(b => b.id.toString() === lorry.sellerId.toString())
        buyerName = buyer?.name || ''
        sellerName = lorry.counterpartyName // counterpartyName from form is the seller in buyer mode
        newLorry.sellerName = sellerName // Store seller name in sellerName field
        newLorry.counterpartyName = buyerName // Store buyer name in counterpartyName for display
      }

      // Save lorry to backend with mode information
      const lorryData = {
        ...newLorry,
        mode, // Add mode to identify if this is a seller lorry or buyer lorry
        sellerName,
        buyerName
      }
      
      const response = await apiClient.post('/lorries', lorryData)
      
      if (response.success && response.data) {
        // Update local state with the backend-generated ID
        const savedLorry = {
          ...newLorry,
          id: response.data._id || response.data.id
        }
        
        if (mode === 'seller') {
          setSellerLorries([...sellerLorries, savedLorry])
        } else {
          setBuyerLorries([...buyerLorries, savedLorry])
        }

        // Auto-update ledger: set loaded = "Yes" for this seller-buyer combination
        console.log('🚀 Calling updateLedgerLoadedStatus with:', { sellerName, buyerName, mode })
        await updateLedgerLoadedStatus(sellerName, buyerName, mode)
      }
    } catch (error) {
      console.error('Failed to add lorry:', error)
      alert('Failed to save lorry. Please try again.')
    }
  }

  const updateLedgerLoadedStatus = async (sellerName: string, buyerName: string, mode: 'seller' | 'buyer') => {
    try {
      console.log('🔍 Updating ledger for:', { sellerName, buyerName, mode })
      
      // Get the appropriate ledger entries based on mode
      const currentLedger = mode === 'seller' ? sellerLedgerEntries : buyerLedgerEntries
      console.log(`📋 Current ${mode} ledger entries:`, currentLedger.map((e: LedgerEntry) => ({ seller: e.sellerName, buyer: e.buyerName, loaded: e.loaded })))
      
      // Find existing ledger entry for this seller-buyer combination (case-insensitive)
      const existingEntry = currentLedger.find(
        (entry: LedgerEntry) => entry.sellerName.toLowerCase() === sellerName.toLowerCase() && 
                 entry.buyerName.toLowerCase() === buyerName.toLowerCase()
      )

      console.log('🎯 Found existing entry:', existingEntry ? `ID: ${existingEntry.id}, Loaded: ${existingEntry.loaded}` : 'No matching entry found')

      // Use the correct endpoint based on mode
      const endpoint = mode === 'buyer' ? '/buyer-ledger' : '/seller-ledger'

      if (existingEntry) {
        // Update existing entry to loaded = "Yes"
        console.log('✅ Updating existing entry to loaded="Yes"')
        await apiClient.put(`${endpoint}/${existingEntry.id}`, {
          sellerName: existingEntry.sellerName,
          buyerName: existingEntry.buyerName,
          loaded: 'Yes',
          conditionFromDate: existingEntry.conditionFromDate,
          conditionToDate: existingEntry.conditionToDate
        })
      } else {
        // Create new entry with loaded = "Yes"
        console.log('➕ Creating new ledger entry with loaded="Yes"')
        const today = new Date().toISOString().split('T')[0]
        await apiClient.post(endpoint, {
          sellerName,
          buyerName,
          loaded: 'Yes',
          conditionFromDate: today,
          conditionToDate: today
        })
      }

      // Refresh ledger entries
      console.log('🔄 Refreshing ledger entries from backend')
      await refreshLedgerEntries()
      console.log('✅ Ledger entries refreshed successfully')
    } catch (error) {
      console.error('❌ Failed to update ledger loaded status:', error)
    }
  }

  const deleteSeller = async (id: number | string) => {
    try {
      const result = await apiClient.delete(`/sellers/${id}`)
      console.log('Delete result:', result)
      
      if (result.success) {
        // Refresh the sellers list after deletion
        const response = await apiClient.get('/sellers')
        if (response.success && response.data) {
          const mappedSellers = response.data.map((s: any) => ({
            id: s._id || s.id,
            name: s.name,
            address: s.address,
            mobile: s.contact || s.mobile
          }))
          setSellers(mappedSellers)
          alert('Seller deleted successfully!')
        }
      } else {
        alert(`Failed to delete seller: ${result.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Failed to delete seller:', error)
      alert(`Failed to delete seller: ${error instanceof Error ? error.message : 'Please try again.'}`)
    }
  }

  const deleteBuyer = async (id: number | string) => {
    try {
      const result = await apiClient.delete(`/buyers/${id}`)
      console.log('Delete result:', result)
      
      if (result.success) {
        // Refresh the buyers list after deletion
        const response = await apiClient.get('/buyers')
        if (response.success && response.data) {
          const mappedBuyers = response.data.map((b: any) => ({
            id: b._id || b.id,
            name: b.name,
            address: b.address,
            mobile: b.contact || b.mobile
          }))
          setBuyers(mappedBuyers)
          alert('Buyer deleted successfully!')
        }
      } else {
        alert(`Failed to delete buyer: ${result.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Failed to delete buyer:', error)
      alert(`Failed to delete buyer: ${error instanceof Error ? error.message : 'Please try again.'}`)
    }
  }

  const updateSeller = async (id: number | string, updatedData: Partial<Seller>) => {
    try {
      // Prepare data for backend (map mobile to contact)
      // Convert name to uppercase for consistency
      const backendData = {
        name: updatedData.name ? updatedData.name.toUpperCase() : undefined,
        address: updatedData.address,
        contact: updatedData.mobile,
        city: updatedData.city,
        gst_number: updatedData.gst_number
      }
      
      await apiClient.put(`/sellers/${id}`, backendData)
      
      // Refresh the sellers list after update
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
      console.error('Failed to update seller:', error)
      alert('Failed to update seller. Please try again.')
    }
  }

  const updateBuyer = async (id: number | string, updatedData: Partial<Buyer>) => {
    try {
      // Prepare data for backend (map mobile to contact)
      // Convert name to uppercase for consistency
      const backendData = {
        name: updatedData.name ? updatedData.name.toUpperCase() : undefined,
        address: updatedData.address,
        contact: updatedData.mobile,
        city: updatedData.city,
        gst_number: updatedData.gst_number
      }
      
      await apiClient.put(`/buyers/${id}`, backendData)
      
      // Refresh the buyers list after update
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
      console.error('Failed to update buyer:', error)
      alert('Failed to update buyer. Please try again.')
    }
  }

  const deleteLorry = async (id: number | string, mode: 'seller' | 'buyer' = 'seller') => {
    try {
      // Delete from backend
      await apiClient.delete(`/lorries/${id}`)
      
      // Update local state
      if (mode === 'seller') {
        setSellerLorries(sellerLorries.filter((l: Lorry) => l.id !== id))
      } else {
        setBuyerLorries(buyerLorries.filter((l: Lorry) => l.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete lorry:', error)
      alert('Failed to delete lorry. Please try again.')
    }
  }

  // Helper function to refresh ledger entries from backend
  const refreshLedgerEntries = async () => {
    try {
      // Fetch seller ledger
      const sellerResponse = await apiClient.get('/seller-ledger')
      if (sellerResponse.success && sellerResponse.data) {
        const sellerEntries = sellerResponse.data.map((entry: any) => ({
          id: entry._id || entry.id,
          sellerName: entry.sellerName,
          buyerName: entry.buyerName,
          loaded: entry.loaded,
          importLocal: entry.importLocal,
          conditionFromDate: entry.conditionFromDate,
          conditionToDate: entry.conditionToDate,
          mode: 'seller' as const
        }))
        setSellerLedgerEntries(sellerEntries)
      }

      // Fetch buyer ledger
      const buyerResponse = await apiClient.get('/buyer-ledger')
      if (buyerResponse.success && buyerResponse.data) {
        const buyerEntries = buyerResponse.data.map((entry: any) => ({
          id: entry._id || entry.id,
          sellerName: entry.sellerName,
          buyerName: entry.buyerName,
          loaded: entry.loaded,
          importLocal: entry.importLocal,
          conditionFromDate: entry.conditionFromDate,
          conditionToDate: entry.conditionToDate,
          mode: 'buyer' as const
        }))
        setBuyerLedgerEntries(buyerEntries)
      }
    } catch (error) {
      console.error('Failed to refresh ledger entries:', error)
    }
  }

  const addLedgerEntry = async (entry: Omit<LedgerEntry, 'id'>) => {
    try {
      const endpoint = entry.mode === 'buyer' ? '/buyer-ledger' : '/seller-ledger'
      await apiClient.post(endpoint, entry)
      await refreshLedgerEntries()
    } catch (error) {
      console.error('Failed to add ledger entry:', error)
      alert('Failed to add ledger entry. Please try again.')
    }
  }

  const updateLedgerEntry = async (id: number | string, updatedData: Partial<LedgerEntry>) => {
    try {
      const backendData = {
        sellerName: updatedData.sellerName,
        buyerName: updatedData.buyerName,
        loaded: updatedData.loaded,
        importLocal: updatedData.importLocal,
        conditionFromDate: updatedData.conditionFromDate,
        conditionToDate: updatedData.conditionToDate
      }
      
      const endpoint = updatedData.mode === 'buyer' ? '/buyer-ledger' : '/seller-ledger'
      await apiClient.put(`${endpoint}/${id}`, backendData)
      await refreshLedgerEntries()
    } catch (error) {
      console.error('Failed to update ledger entry:', error)
      alert('Failed to update ledger entry. Please try again.')
    }
  }

  const deleteLedgerEntry = async (id: number | string, mode?: 'seller' | 'buyer') => {
    try {
      const endpoint = mode === 'buyer' ? '/buyer-ledger' : '/seller-ledger'
      const result = await apiClient.delete(`${endpoint}/${id}`)
      console.log('Delete result:', result)
      
      if (result.success) {
        await refreshLedgerEntries()
        alert('Ledger entry deleted successfully!')
      } else {
        alert(`Failed to delete ledger entry: ${result.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Failed to delete ledger entry:', error)
      alert(`Failed to delete ledger entry: ${error instanceof Error ? error.message : 'Please try again.'}`)
    }
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      {/* Loading Spinner Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        </div>
      )}
      
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
                  {activePage === 'sellerLedger' && 'Seller Daily Ledger'}
                  {activePage === 'buyerLedger' && 'Buyer Daily Ledger'}
                </h1>
              </div>

              {activePage === 'seller' && (
                <>
                  <SellerForm onAddSeller={addSeller} onViewDetails={handleViewSellerDetails} />
                  <LorryForm sellers={sellers} buyers={buyers} onAddLorry={(lorry) => addLorry(lorry, 'seller')} mode="seller" />
                  <div id="details-section">
                    <DataTable 
                      sellers={sellers}
                      lorries={sellerLorries}
                      activeTab={activeTab}
                      setActiveTab={setActiveTab}
                      onDeleteSeller={deleteSeller}
                      onEditSeller={updateSeller}
                      onDeleteLorry={(id) => deleteLorry(id, 'seller')}
                      mode="seller"
                    />
                  </div>
                </>
              )}

              {activePage === 'buyer' && (
                <>
                  <BuyerForm onAddBuyer={addBuyer} onViewDetails={handleViewLorryDetails} />
                  <LorryForm sellers={sellers} buyers={buyers} onAddLorry={(lorry) => addLorry(lorry, 'buyer')} mode="buyer" />
                  <div id="details-section">
                    <DataTable 
                      buyers={buyers}
                      lorries={buyerLorries}
                      activeTab={activeTab}
                      setActiveTab={setActiveTab}
                      onDeleteBuyer={deleteBuyer}
                      onEditBuyer={updateBuyer}
                      onDeleteLorry={(id) => deleteLorry(id, 'buyer')}
                      mode="buyer"
                    />
                  </div>
                </>
              )}

              {activePage === 'billing' && (
                <BillingPage 
                  sellers={sellers}
                  buyers={buyers}
                  sellerLorries={sellerLorries}
                  buyerLorries={buyerLorries}
                />
              )}

              {activePage === 'sellerLedger' && (
                <DailyLedgerPage 
                  sellers={sellers}
                  buyers={buyers}
                  ledgerEntries={sellerLedgerEntries}
                  onAddLedger={(entry) => addLedgerEntry({ ...entry, mode: 'seller' })}
                  onEditLedger={updateLedgerEntry}
                  onDeleteLedger={deleteLedgerEntry}
                  mode="seller"
                />
              )}

              {activePage === 'buyerLedger' && (
                <DailyLedgerPage 
                  sellers={sellers}
                  buyers={buyers}
                  ledgerEntries={buyerLedgerEntries}
                  onAddLedger={(entry) => addLedgerEntry({ ...entry, mode: 'buyer' })}
                  onEditLedger={updateLedgerEntry}
                  onDeleteLedger={deleteLedgerEntry}
                  mode="buyer"
                />
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}