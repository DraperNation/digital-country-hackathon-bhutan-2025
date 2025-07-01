pragma circom 2.0.0;

include "circomlib/circuits/poseidon.circom";
include "circomlib/circuits/comparators.circom";

template NationalityCheck() {
    // Private inputs (hidden from verifier)
    signal private input name;
    signal private input nationality;
    signal private input dob;
    
    // Public inputs (known to verifier)
    signal input expectedHash;
    signal input expectedNationality;
    
    // Output
    signal output isValid;
    
    // Component to hash the full identity
    component hasher = Poseidon(3);
    hasher.inputs[0] <== name;
    hasher.inputs[1] <== nationality;
    hasher.inputs[2] <== dob;
    
    // Check 1: The hash of private inputs matches the expected public hash
    component hashCheck = IsEqual();
    hashCheck.in[0] <== hasher.out;
    hashCheck.in[1] <== expectedHash;
    
    // Check 2: The nationality matches "Bhutan" (encoded as a number)
    component nationalityCheck = IsEqual();
    nationalityCheck.in[0] <== nationality;
    nationalityCheck.in[1] <== expectedNationality;
    
    // Both checks must pass
    component and = AND();
    and.a <== hashCheck.out;
    and.b <== nationalityCheck.out;
    
    isValid <== and.out;
}

// AND gate implementation
template AND() {
    signal input a;
    signal input b;
    signal output out;
    
    out <== a * b;
}

component main = NationalityCheck(); 