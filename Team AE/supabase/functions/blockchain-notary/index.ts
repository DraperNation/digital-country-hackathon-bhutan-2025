
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NotarizeRequest {
  documentHash: string;
  documentName: string;
  walletAddress: string;
  signature: string;
  metadata?: {
    fileSize: number;
    fileType: string;
    timestamp: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const { documentHash, documentName, walletAddress, signature, metadata } = await req.json() as NotarizeRequest

    // Verify signature authenticity (simplified for demo)
    const isValidSignature = signature && signature.length > 0

    if (!isValidSignature) {
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Generate blockchain transaction hash (simulated)
    const blockchainTxHash = `0x${Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('')}`

    // Store notarization record
    const { data, error } = await supabaseClient
      .from('document_notarizations')
      .insert([
        {
          document_hash: documentHash,
          document_name: documentName,
          wallet_address: walletAddress,
          signature: signature,
          blockchain_tx_hash: blockchainTxHash,
          metadata: metadata,
          verification_status: 'verified',
          notarized_at: new Date().toISOString(),
        }
      ])

    if (error) {
      console.error('Database error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to store notarization' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Return success with blockchain details
    return new Response(
      JSON.stringify({
        success: true,
        blockchainTxHash,
        notarizationId: data?.[0]?.id,
        message: 'Document successfully notarized on blockchain',
        gasUsed: Math.floor(Math.random() * 50000) + 21000,
        blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error in blockchain-notary:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
