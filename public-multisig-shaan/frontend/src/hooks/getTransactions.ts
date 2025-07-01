import { useReadContract } from "wagmi";
import { readContract } from "wagmi/actions";
import { multiSigWallet } from "@/lib/multisig";
import { useQuery } from "@tanstack/react-query";
import { config } from "@/config/rainbowkit";

export interface Transaction {
    to: string;
    value: bigint;
    title: string;
    description: string;
    type: string;
    executed: boolean;
    approvalCount: number;
}
export const useGetTransactions = () => {

    const { data: transactionCount } = useReadContract({
        address: multiSigWallet.address as `0x${string}`,
        abi: multiSigWallet.abi,
        functionName: "getTransactionCount",
        args: [],
    });

    return useQuery({
        queryKey: ["transactions"],
        queryFn: async () => {
            const transactions = [];
            if (!transactionCount) return [];
            for (let i = 0; i < Number(transactionCount); i++) {
                // @ts-expect-error: This is a workaround to fix the type error
                const transaction : [string, bigint, string, string, string, boolean, number] = await readContract(config,{
                    address: multiSigWallet.address as `0x${string}`,
                    abi: multiSigWallet.abi,
                    functionName: "transactions",
                    args: [i],
                });
                transactions.push({
                    to: transaction[0] as `0x${string}`,
                    value: transaction[1] as bigint,
                    title: transaction[2] as string,
                    description: transaction[3] as string,
                    type: transaction[4] as string,
                    executed: transaction[5] as boolean,
                    approvalCount: transaction[6] as number,
                });
                // convert array to TransactionType
            }
            return transactions as Transaction[];
        },
        enabled: !!transactionCount,
        refetchInterval: 1000,
    });
}