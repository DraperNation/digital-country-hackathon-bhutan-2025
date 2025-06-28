import React, { useState } from 'react'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select';
import { Button } from '../ui/button';
import { useWriteContract } from 'wagmi';
import { multiSigWallet } from '@/lib/multisig';
import Image from 'next/image';
import { parseEther } from 'viem';
import { toast } from 'sonner';

type Form = {
    amount: number;
    title: string;
    to: string;
    description: string;
    type: "PUBLIC_WORK" | "CONTRACT" | "OTHER";
}

const NewTransaction = () => {
    const [form, setForm] = useState<Form>({
        amount: 0,
        description: "",
        title: "",
        to: "",
        type: "PUBLIC_WORK",
    })

    const { writeContractAsync } = useWriteContract();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async () => {
        const toastId = toast.loading("Submitting transaction...");
        const tx = await writeContractAsync({
            address: multiSigWallet.address as `0x${string}`,
            abi: multiSigWallet.abi,
            functionName: "submitTransaction",
            args: [
                form.to,
                parseEther(form.amount.toString()),
                form.title,
                form.description,
                form.type,
            ],
        }, {
            onSuccess: () => {
                toast.dismiss(toastId);
                toast.success("Transaction submitted successfully");
            },
            onError: () => {
                toast.dismiss(toastId);
                toast.error("Transaction failed");
            },
        });
        console.log(tx);
    }

    return (
        <div className='flex items-center justify-between gap-8 p-4 w-full h-full'>
            <div className='flex flex-col gap-4 w-1/2 h-full justify-between'>
                <div className='flex flex-col gap-2'>
                    <label className='font-bold' htmlFor="title">Title</label>
                    <div className='flex items-center gap-2'>
                        <Input placeholder='Title of the request' type="text" name="title" value={form.title} onChange={handleChange} />
                    </div>
                </div>
                <div className='flex flex-col gap-2'>
                    <label className='font-bold' htmlFor="description">Description</label>
                    <Input placeholder='Description of why the funds are needed' type="text" name="description" value={form.description} onChange={handleChange} />
                </div>
                <div className='flex flex-col gap-2'>
                    <label className='font-bold' htmlFor="type">Type</label>
                    <Select name="type" value={form.type} onValueChange={(value) => setForm({ ...form, type: value as "PUBLIC_WORK" | "CONTRACT" | "OTHER" })}>
                        <SelectTrigger>
                            {form.type.charAt(0).toUpperCase() + form.type.slice(1)}
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="PUBLIC_WORK">Public Work</SelectItem>
                            <SelectItem value="CONTRACT">Contract</SelectItem>
                            <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className='flex flex-col gap-2'>
                    <label className='font-bold' htmlFor="to">To</label>
                    <div className='flex items-center gap-2'>
                        <Input placeholder='0xa585...af9f' type="text" name="to" value={form.to} onChange={handleChange} />
                    </div>
                </div>
                <div className='flex flex-col gap-2'>
                    <label className='font-bold' htmlFor="amount">Amount</label>
                    <div className='flex items-center gap-2'>
                        <Input placeholder='0.01 ETH Minimum' type="number" name="amount" value={form.amount} onChange={handleChange} />
                        <Button disabled>ETH</Button>
                    </div>
                </div>
                <Button className='bg-blue-800' onClick={handleSubmit}>Submit</Button>
            </div>
            <div className='w-1/2 relative flex flex-col bg-blue-900 rounded-xl h-full gap-4'>
                <Image src={'/ebhutan-marketplace.png'} alt="New Transaction" width={500} height={500} className='w-full h-full object-cover rounded-xl' />
                <div className='absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t rounded-xl from-blue-900 to-transparent' />
                <div className='absolute bottom-0 left-0 w-full h-fit text-white rounded-xl flex flex-col gap-4 p-4'>
                    <h1 className='text-3xl font-bold'>Empowering Public Goods</h1>
                    <p className='text-sm'>
                        This application is a publicly owned treasury that can be used to fund public goods and services under the supervision of the community.
                    </p>
                </div>
            </div>
            {/* <Carousel opts={{ loop: true, duration: 5 }} className='h-full w-1/2'>
                <CarouselContent className='aspect-video'>
                    <CarouselItem>
                        
                    </CarouselItem>
                    <CarouselItem>
                        <div className='w-full relative flex flex-col bg-blue-900 rounded-xl h-full gap-4'>
                            <Image src={'/ebhutan-roads.png'} alt="New Transaction" width={500} height={500} className='w-full h-full object-cover rounded-xl' />
                            <div className='absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t rounded-xl from-blue-900 to-transparent' />
                            <div className='absolute bottom-0 left-0 w-full h-fit text-white rounded-xl flex flex-col gap-4 p-4'>
                                <h1 className='text-3xl font-bold'>Empowering Public Goods</h1>
                                <p className='text-sm'>
                                    This application is a publicly owned treasury that can be used to fund public goods and services under the supervision of the community.
                                </p>
                            </div>
                        </div>
                    </CarouselItem>
                </CarouselContent>
            </Carousel> */}
        </div>
    )
}

export default NewTransaction