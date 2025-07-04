/**
 * @file This file exports a server-side function to create a digital identity
 * by calling the Sovio API. This is intended to be used within a Next.js API route.
 * @author Gemini
 * @version 1.0.0
 */

/**
 * Creates a Verifiable Credential via the Sovio API.
 * * This function should be called from a server environment (like a Next.js API route)
 * to protect the bearerToken.
 * * @param {object} identityData - The user's identity information.
 * @param {string} identityData.email - The user's email address.
 * @param {string} identityData.name - The user's full name.
 * @param {string} identityData.dob - The user's date of birth in 'YYYY-MM-DD' format.
 * @param {string} identityData.gender - The user's gender ('MALE', 'FEMALE', 'OTHER').
 * @param {string} identityData.country - The user's country of residence.
 * @param {string} identityData.passportHash - A unique hash related to the user's passport.
 * @returns {Promise<object>} A promise that resolves to the JSON response from the Sovio API.
 * @throws {Error} Throws an error if the API call fails or returns a non-ok status.
 */
export async function createSovioIdentity(identityData) {
    const { email, name, dob, gender, country, passportHash } = identityData;

    // --- Define API details
    const apiUrl = 'https://api.sovio.id/orgs/a6114767-a9e7-4f46-85aa-6d105d42bf2e/credentials/oob/email?credentialType=jsonld';

    // IMPORTANT: This Bearer token is static and will expire.
    // In a production Next.js app, you should store this securely as an environment variable (e.g., process.env.SOVIO_API_TOKEN).
    const bearerToken = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJUR1hNMzRSWVcyRXVjRGFBdHpFVVJTQVRNcHd1YUt4emoxc1dXVzJPOGMwIn0.eyJleHAiOjE3NTExNzAyNzgsImlhdCI6MTc1MTE0MTQ3OCwianRpIjoiNzUzOWYyMzYtNTMzMy00NTk2LTkzNTMtOGY3YWZkMWRiZTc4IiwiaXNzIjoiaHR0cHM6Ly9pZHAuc292aW8uaWQvcmVhbG1zL2NyZWRlYmxfcGxhdGZvcm0iLCJhdWQiOlsiYTYxMTQ3NjctYTllNy00ZjQ2LTg1YWEtNmQxMDVkNDJiZjJlIiwiYWNjb3VudCJdLCJzdWIiOiJmNWE3ODVmZS1mZTgzLTRiMmUtOGQ5ZS05NjUyMDA5ZTliMjIiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhZG1pbkNsaWVudCIsInNpZCI6IjViNmVkN2YyLTViZmYtNDA5Yi1hMGI0LTU5N2Q3NzhhZjkwYyIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cHM6Ly9pZHAuc292aW8uaWQvKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiZGVmYXVsdC1yb2xlcy1jcmVkZWJsX3BsYXRmb3JtIiwib2ZmbGluZV9hY2Nlc3MiLCJob2xkZXIiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImE2MTE0NzY3LWE5ZTctNGY0Ni04NWFhLTZkMTA1ZDQyYmYyZSI6eyJyb2xlcyI6WyJvd25lciJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJHYWJpbiBGYXkiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJnYWJpbi5mYXlAZ21haWwuY29tIiwiZ2l2ZW5fbmFtZSI6IkdhYmluIiwiZmFtaWx5X25hbWUiOiJGYXkiLCJlbWFpbCI6ImdhYmluLmZheUBnbWFpbC5jb20ifQ.aE4AYKJgT9_orqj4l6VCknl4CbwwGW8J_3OuBHc2zw4Sd0P9Ypg2RG-aIR4WUqP0EgBwPzI5HHg21GYwa1Z5k_vRTwNHKe8vG8GZlWmMt_pJVUep_aHzf0XYF1D8utcxHQcKb10qH8yQO1y5VVJR7CijdiDRm8QlPOhnm55tUhw9YkZR6p45lFmN-ypIDJBqBe2YRuUaKEf-0raBWjabOJ7kAlXAfEANGXkJ5nge902FJaiba2kUtlVkkrAb1g1OxUeKp_E_5yoB6LL73c3Rjh9NgSyvFFVZWDjIt_WkRxCITVqh0NfJXcqpZXHkxVkE1kRL970e4x4fzqriui_OYA';

    // Format the date as DDMMYYYY from YYYY-MM-DD
    const date = new Date(dob);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const formattedDob = `${day}${month}${year}`;

    // --- Construct the request payload
    const requestBody = {
        "credentialOffer": [{
            "emailId": email,
            "credential": {
                "@context": [
                    "https://www.w3.org/2018/credentials/v1",
                    "https://schema.sovio.id/schemas/341b57cc-9795-43b2-81f9-6e9005fcfffe"
                ],
                "type": ["VerifiableCredential", "E-RESIDENCY"],
                "issuer": { "id": "did:polygon:0x54B13340c604F0d4A7033889Ae4E721b955b0A72" },
                "issuanceDate": new Date().toISOString(),
                "credentialSubject": {
                    "NAME": name,
                    "DOB": formattedDob,
                    "PASSPORT_HASH": passportHash,
                    "GENDER": gender,
                    "COUNTRY": country
                }
            },
            "options": {
                "proofType": "EcdsaSecp256k1Signature2019",
                "proofPurpose": "assertionMethod"
            }
        }],
        "protocolVersion": "v2",
        "isReuseConnection": true,
        "credentialType": "jsonld"
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${bearerToken}`
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            // Throw an error with the response text for better debugging
            const errorText = await response.text();
            throw new Error(`API call failed with status ${response.status}: ${errorText}`);
        }

        return await response.json();

    } catch (error) {
        console.error("Error creating Sovio identity:", error);
        // Re-throw the error so the calling function can handle it
        throw error;
    }
}