
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InvoiceRequest {
  amount: number;
  description: string;
  walletAddress: string;
  currency: 'BTC' | 'SATS';
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

    const { amount, description, walletAddress, currency } = await req.json() as InvoiceRequest

    // Generate Lightning invoice (simulated but realistic format)
    const invoiceId = `lnbc${amount * 100000000}n1p${Math.random().toString(36).substring(2, 15)}`
    const paymentHash = Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('')

    // Generate QR code data
    const qrCodeData = `lightning:${invoiceId}`

    // Store invoice in database
    const { data, error } = await supabaseClient
      .from('lightning_invoices')
      .insert([
        {
          invoice_id: invoiceId,
          payment_hash: paymentHash,
          amount: amount,
          currency: currency,
          description: description,
          wallet_address: walletAddress,
          status: 'pending',
          expires_at: new Date(Date.now() + 3600000).toISOString(), // 1 hour expiry
          created_at: new Date().toISOString(),
        }
      ])

    if (error) {
      console.error('Database error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to create invoice' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Simulate Lightning Network node response
    return new Response(
      JSON.stringify({
        success: true,
        invoice: {
          id: invoiceId,
          paymentHash: paymentHash,
          amount: amount,
          currency: currency,
          description: description,
          qrCode: qrCodeData,
          expiresAt: new Date(Date.now() + 3600000).toISOString(),
          status: 'pending'
        },
        networkInfo: {
          nodeId: '03' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
          channels: Math.floor(Math.random() * 1000) + 100,
          capacity: Math.floor(Math.random() * 10000000) + 1000000,
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error in lightning-invoice:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
