'use client'

import { useAccount } from 'wagmi'

export default function ConnectButton() {
  const { address, isConnected } = useAccount()

  return (
    <>
      <appkit-button />
      {isConnected && address && (
        <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>
          Connected Wallet: {address}
        </p>
      )}
    </>
  )
}
