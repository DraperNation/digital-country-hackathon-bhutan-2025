import { useGetTransactions } from '@/hooks/getTransactions';
import { multiSigWallet } from '@/lib/multisig';
import { Loader2 } from 'lucide-react';
import React from 'react'
import { useReadContract, useWriteContract } from 'wagmi';
import { Button } from '../ui/button';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { formatEther } from 'viem';

const Approve = () => {
    const { data: transactions, isLoading, refetch } = useGetTransactions();

    const { data: numConfirmationsRequired } = useReadContract({
        address: multiSigWallet.address as `0x${string}`,
        abi: multiSigWallet.abi,
        functionName: "numConfirmationsRequired",
        args: [],
    });

    const { writeContractAsync } = useWriteContract();

    const handleApprove = async (index: number) => {
        const toastId = toast.loading("Approving Proposal...");
        await writeContractAsync({
            address: multiSigWallet.address as `0x${string}`,
            abi: multiSigWallet.abi,
            functionName: "confirmTransaction",
            args: [index],
        }, {
            onSuccess: (tx) => {
                refetch();
                toast.dismiss(toastId);
                toast.success("Proposal approved at index " + tx);
            },
            onError: () => {
                toast.dismiss(toastId);
                toast.error("Failed to approve transaction");
            }
        });
    }

    const handleExecute = async (index: number) => {
        const toastId = toast.loading("Executing Proposal...");
        await writeContractAsync({
            address: multiSigWallet.address as `0x${string}`,
            abi: multiSigWallet.abi,
            functionName: "executeTransaction",
            args: [index],
        }, {
            onSuccess: async (tx) => {
                await refetch();
                toast.dismiss(toastId);
                toast.success("Proposal executed at index " + tx);
            },
            onError: () => {
                toast.dismiss(toastId);
                toast.error("Failed to execute transaction, Only the owner can execute transactions");
            }
        });
    }


    if ((isLoading)) return <div className='w-full h-full flex flex-col gap-4 items-center justify-center'>
        <Loader2 className='size-16 animate-spin' />
        <p className='text-3xl font-bold text-blue-950'>Fetching Proposals...</p>
    </div>

    return (
        // <div className='w-full h-full overflow-y-hidden'>
        <ScrollArea className='w-full h-full scroll-smooth overflow-y-auto'>
            <div className='w-full h-full flex gap-4 flex-wrap px-4 pb-60'>
                {transactions?.map((transaction, index) => {
                    return (
                        <div key={index} className='flex-1 h-80 flex flex-col justify-between gap-4 text-blue-950 bg-gradient-to-br from-blue-200 to-blue-300 rounded-md p-4'>
                            <div className='flex flex-col gap-4'>
                                <div className='flex items-center gap-2 justify-between'>
                                    <h1 className='text-3xl font-bold text-nowrap'>{transaction.title}</h1>
                                    <div className={cn('flex items-center gap-2 rounded-md p-2', transaction.executed ? 'bg-blue-500 text-white' : transaction.approvalCount >= Number(numConfirmationsRequired) ? 'bg-green-600 text-white' : 'bg-white text-blue-950')}>
                                        <p className='text-sm font-semibold text-nowrap'>Approvals Received: {transaction.approvalCount}/{Number(numConfirmationsRequired)}</p>
                                    </div>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <div className='text-sm font-semibold flex items-center gap-2 p-2 bg-white rounded-full w-fit text-nowrap'>
                                        <Jazzicon diameter={20} seed={jsNumberForAddress(transaction.to)} />
                                        {transaction.to.slice(0, 6)}...{transaction.to.slice(-4)}</div>
                                    <p className='text-sm font-semibold text-nowrap p-2 bg-white rounded-full w-fit'>{formatEther(transaction.value)} ETH</p>
                                </div>
                            </div>
                            <div className='flex flex-col gap-4'>
                                <p className='text-sm pr-4 text-blue-950'>{transaction.description}</p>
                                {transaction.executed && <Button disabled onClick={() => handleApprove(index)} className='w-40 bg-blue-500 font-bold text-white'>Funds Disbursed</Button>}
                                {transaction.approvalCount < Number(numConfirmationsRequired) && !transaction.executed && <Button onClick={() => handleApprove(index)} className='w-40 bg-blue-950 font-bold text-white'>Approve</Button>}
                                {transaction.approvalCount >= Number(numConfirmationsRequired) && !transaction.executed && <Button onClick={() => handleExecute(index)} className='w-40 bg-green-600 font-bold text-white'>Execute</Button>}
                            </div>
                        </div>
                    )
                })}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
        // </div>
    )
}

export default Approve