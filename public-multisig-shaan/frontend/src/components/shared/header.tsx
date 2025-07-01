import { ConnectButton } from '@rainbow-me/rainbowkit'
import React from 'react'
import { useBalance } from 'wagmi'
import { multiSigWallet } from '@/lib/multisig'
import { formatEther } from 'viem'

const Header = () => {

    const { data:balance } = useBalance({
        address: multiSigWallet.address as `0x${string}`,
    })
  return (
    <div className='w-full h-16 bg-blue-100 flex items-center justify-between p-2 px-4'>
        <h1 className='text-2xl font-bold'>🇧🇹 Bhutan Public Treasury</h1>
        <div className='flex h-full items-center gap-2'>
            <div className='flex items-center gap-2 text-sm bg-blue-800 text-white h-10 rounded-xl p-2 px-4'>
                <p className='text-sm'>Treasury Balance: {' '}</p>
                <p className='text-sm font-bold'>{formatEther(balance?.value ?? BigInt(0))} {balance?.symbol}</p>
            </div>
        <ConnectButton />
        </div>
    </div>
  )
}

export default Header