// context/index.tsx
'use client'

import { wagmiAdapter, projectId } from '@/config'
import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { mainnet, arbitrum, avalanche, base, optimism, polygon, sepolia } from '@reown/appkit/networks'
import { cookieToInitialState, WagmiProvider, useAccount, type Config } from 'wagmi'

// Create a context
type WalletContextType = {
  loggedIn: boolean
  address?: string
}
const WalletContext = createContext<WalletContextType | undefined>(undefined)

// React Query Client
const queryClient = new QueryClient()

// Metadata for modal
const metadata = {
  name: 'web3 connect wallet app',
  description: 'AppKit Example',
  url: 'https://reown.com/appkit',
  icons: ['https://assets.reown.com/reown-profile-pic.png'],
}

// Create modal instance
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [mainnet, arbitrum, avalanche, base, optimism, polygon, sepolia],
  defaultNetwork: mainnet,
  metadata,
  features: {
    analytics: true,
  },
})

// Inner WalletProvider that uses `useAccount`
function WalletProvider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount()
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    setLoggedIn(isConnected)
  }, [isConnected])

  return (
    <WalletContext.Provider value={{ loggedIn, address }}>
      {children}
    </WalletContext.Provider>
  )
}

// Main context wrapper
function ContextProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <WalletProvider>{children}</WalletProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

// Export hook to use wallet context
export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used inside ContextProvider')
  }
  return context
}

export default ContextProvider
