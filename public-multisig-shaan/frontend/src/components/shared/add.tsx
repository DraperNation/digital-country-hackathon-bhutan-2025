import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { VerifiedIcon } from 'lucide-react'
import { useReadContract, useWriteContract } from 'wagmi'
import { multiSigWallet } from '@/lib/multisig'
import { toast } from 'sonner'
import Jazzicon from 'react-jazzicon'
import { jsNumberForAddress } from 'react-jazzicon'

const AddCitizen = () => {

    const [address, setAddress] = useState("")
    const {writeContractAsync} = useWriteContract()

    const {data: citizens} = useReadContract({
        address: multiSigWallet.address as `0x${string}`,
        abi: multiSigWallet.abi,
        functionName: "getOwners",
    })

    const handleAddCitizen = async () => {
        if (!address) return
        const toastId = toast.loading("Adding Citizen...");
        await writeContractAsync({
            address: multiSigWallet.address as `0x${string}`,
            abi: multiSigWallet.abi,
            functionName: "addOwner",
            args: [address],
        },{
            onSuccess: () => {
                toast.dismiss(toastId)
                toast.success("Citizen Added")
            },
            onError: () => {
                toast.dismiss(toastId)
                toast.error("Failed to add citizen")
            }
        })
    }

    return (
        <div className='flex items-start gap-4 w-full h-full'>
            <div className='flex flex-col h-full gap-4 flex-1'>
                <h1 className='text-2xl font-bold'>Add Citizen</h1>
                <Input onChange={(e) => setAddress(e.target.value)} value={address} placeholder='Enter Citizen Address: 0xa7234...' className='w-full' />
                <Button onClick={handleAddCitizen} className='w-full bg-blue-800 text-white'>Add Citizen</Button>
                <h1 className='text-xl mt-8 font-bold'>Existing Citizens: </h1>
                <div className='flex flex-wrap items-center gap-4'>
                    {(citizens as `0x${string}`[])?.map((citizen, index) => {
                        return (
                            <div key={index} className='flex items-center gap-2 text-sm font-semibold text-white bg-blue-950 rounded-full p-2'>
                                <Jazzicon diameter={20} seed={jsNumberForAddress(citizen)} />
                                {citizen.slice(0, 6)}...{citizen.slice(-4)}
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className='flex flex-col gap-4 px-8 h-full flex-1 bg-gradient-to-br from-blue-200 to-blue-300 rounded-md p-4 items-center justify-center'>
                <VerifiedIcon className='size-16 text-blue-950' />
                <h1 className='text-3xl text-center text-blue-950 font-bold'>Citizen Adding Process would include KYC and AML checks</h1>
                <p className='text-sm text-center text-blue-950'>For purposes of this demo, we will assume that the citizen has been verified and only the address is required</p>
            </div>
        </div>
    )
}

export default AddCitizen