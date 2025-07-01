// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BTCDepositVerifier {
    address public trustedSigner;

    constructor(address _trustedSigner) {
        trustedSigner = _trustedSigner;
    }

    function verifyDeposit(
        bytes32 txid,
        uint256 amountSats,
        address recipient,
        bytes memory signature
    ) public view returns (bool) {
        // Reconstruct the message that was originally signed off-chain
        bytes32 messageHash = keccak256(abi.encodePacked(txid, amountSats, recipient));
        // Apply the Ethereum signed message prefix and hash
        bytes32 ethSignedMessageHash = toEthSignedMessageHash(messageHash);
        // Recover the signer's address from the signature and compare to the trustedSigner
        return recoverSigner(ethSignedMessageHash, signature) == trustedSigner;
    }

    // Standard function to add the Ethereum signed message prefix
    function toEthSignedMessageHash(bytes32 messageHash) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash));
    }

    // Recovers the Ethereum address that signed the message
    function recoverSigner(bytes32 ethSignedMessageHash, bytes memory sig) internal pure returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(sig);
        return ecrecover(ethSignedMessageHash, v, r, s);
    }

    // Splits a 65-byte signature into its r, s, and v components
    function splitSignature(bytes memory sig) internal pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(sig.length == 65, "Invalid signature length");
        assembly {
            r := mload(add(sig, 32))   // Load r (first 32 bytes)
            s := mload(add(sig, 64))   // Load s (next 32 bytes)
            v := byte(0, mload(add(sig, 96))) // Load v (last byte)
        }
    }
}