pragma circom 2.0.0;

template NationalityCheck() {
    // Private inputs (hidden from verifier)
    signal private input nationality;
    signal private input secret; // Additional secret to prevent brute force
    
    // Public inputs (known to verifier)
    signal input expectedNationality; // Hash of "Bhutan"
    signal input commitmentHash;      // Hash of nationality + secret
    
    // Output
    signal output isValid;
    
    // Compute hash of nationality + secret
    signal nationalitySquared;
    signal secretSquared;
    signal combined;
    
    nationalitySquared <== nationality * nationality;
    secretSquared <== secret * secret;
    combined <== nationalitySquared + secretSquared;
    
    // Check 1: The nationality matches expected value
    signal nationalityDiff;
    signal nationalityCheck;
    nationalityDiff <== nationality - expectedNationality;
    nationalityCheck <== 1 - nationalityDiff * nationalityDiff;
    
    // Check 2: The commitment is correct
    signal commitmentDiff;
    signal commitmentCheck;
    commitmentDiff <== combined - commitmentHash;
    commitmentCheck <== 1 - commitmentDiff * commitmentDiff;
    
    // Both checks must pass (simplified AND)
    isValid <== nationalityCheck * commitmentCheck;
}

component main = NationalityCheck(); 