import { multiSigWallet } from '@/lib/multisig';
import React from 'react'
import QRCode from "react-qr-code";

const Deposit = () => {
  return (
    <div className='flex flex-col px-40 items-center justify-center gap-4 w-full h-full'>
        <h1 className='text-2xl font-bold'>Send ETH to Treasury</h1>
        <QRCode size={256} fgColor='#172554' value={multiSigWallet.address as `0x${string}`} />
        <p className='text-sm text-blue-950'>Scan the QR code to deposit to the treasury, or send ETH to the following address</p>
        <p className='text-sm text-white bg-blue-950 rounded-full p-2 font-bold'>{multiSigWallet.address as `0x${string}`}</p>
    </div>
  )
}

export default Deposit