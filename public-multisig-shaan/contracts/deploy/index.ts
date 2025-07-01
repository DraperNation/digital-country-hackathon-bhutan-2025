import { viem } from "hardhat";
import { parseEther } from "viem";
import fs from "fs";

async function main() {

    const [owner1, owner2, owner3] = await viem.getWalletClients();

    const client = await viem.getWalletClient(owner1.account.address);

    // make owner1 send 0.5ETH to 0xB55233C8447158cCe70Cb30A501944aE0aA55194
    const tx = await client.sendTransaction({
        to: "0xB55233C8447158cCe70Cb30A501944aE0aA55194",
        value: parseEther("0.5"),
    });
 
    console.log("🚀 ~ main ~ tx:", tx);

    const multiSigWallet = await viem.deployContract("MultiSigWallet", [
        [owner1.account.address, '0xD99eb497608046d3C97B30E62b872daADF6f7dCF', '0x7813425f2d78FDf967e155acB94bD4cC3E88141a', '0xB55233C8447158cCe70Cb30A501944aE0aA55194'],
        2,
    ],{
        value: parseEther("1.33"),
    });

    console.log("🚀 ~ main ~ multiSigWallet:", multiSigWallet);


    try {
        fs.writeFileSync("../frontend/src/lib/multisig.ts", `export const multiSigWallet = {address: "${multiSigWallet.address}", abi: ${JSON.stringify(multiSigWallet.abi)}}`);
    } catch (error) {
        console.error(error);
    }

    const firstTx = await (await viem.getContractAt('MultiSigWallet', multiSigWallet.address)).write.submitTransaction([
        "0xB55233C8447158cCe70Cb30A501944aE0aA55194",
        parseEther("0.5"),
        "Test Transaction",
        "This is a test transaction",
        "PUBLIC_WORK"
    ]);

    const check = await (await viem.getContractAt('MultiSigWallet', multiSigWallet.address)).read.transactions([0])

    console.log("🚀 ~ main ~ firstTx:", firstTx);


    console.log("MultiSigWallet deployed to:", multiSigWallet.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
