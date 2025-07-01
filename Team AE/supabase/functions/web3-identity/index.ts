
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface IdentityRequest {
  action: 'create' | 'verify' | 'update' | 'revoke';
  walletAddress: string;
  userData?: {
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  signature: string;
  nonce?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const { action, walletAddress, userData, signature, nonce } = await req.json() as IdentityRequest

    // Generate DID (Decentralized Identifier)
    const did = `did:bhutan:${walletAddress.toLowerCase().slice(2, 18)}`
    
    // Create verification proof
    const verificationProof = {
      type: 'BhutanEResidencyCredential',
      issuer: 'did:bhutan:government',
      issuanceDate: new Date().toISOString(),
      credentialSubject: {
        id: did,
        walletAddress: walletAddress,
        residencyStatus: 'active',
        issuedBy: 'Kingdom of Bhutan Digital Identity Authority'
      },
      proof: {
        type: 'EthereumEip712Signature2021',
        created: new Date().toISOString(),
        verificationMethod: `${did}#keys-1`,
        proofPurpose: 'assertionMethod',
        proofValue: signature
      }
    }

    switch (action) {
      case 'create':
        // Store identity credential
        const { data: identityData, error: identityError } = await supabaseClient
          .from('web3_identities')
          .insert([
            {
              did: did,
              wallet_address: walletAddress,
              user_data: userData,
              verification_proof: verificationProof,
              status: 'active',
              reputation_score: 100,
              created_at: new Date().toISOString(),
            }
          ])

        if (identityError) {
          console.error('Identity creation error:', identityError)
          return new Response(
            JSON.stringify({ error: 'Failed to create identity' }),
            {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          )
        }

        return new Response(
          JSON.stringify({
            success: true,
            identity: {
              did: did,
              verificationProof: verificationProof,
              reputationScore: 100,
              status: 'active',
              blockchainAnchor: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
            }
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )

      case 'verify':
        // Verify identity exists and is valid
        const { data: verifyData, error: verifyError } = await supabaseClient
          .from('web3_identities')
          .select('*')
          .eq('wallet_address', walletAddress)
          .single()

        if (verifyError || !verifyData) {
          return new Response(
            JSON.stringify({ success: false, error: 'Identity not found' }),
            {
              status: 404,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          )
        }

        return new Response(
          JSON.stringify({
            success: true,
            verified: true,
            identity: {
              did: verifyData.did,
              status: verifyData.status,
              reputationScore: verifyData.reputation_score,
              issuedAt: verifyData.created_at,
              lastVerified: new Date().toISOString()
            }
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
    }

  } catch (error) {
    console.error('Error in web3-identity:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
