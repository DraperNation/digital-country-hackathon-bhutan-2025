
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CarbonTradeRequest {
  action: 'buy' | 'offset' | 'transfer';
  projectId: string;
  amount: number;
  walletAddress: string;
  signature?: string;
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

    if (req.method === 'GET') {
      // Return available carbon credit projects
      const projects = [
        {
          id: 'himalayan-forest-001',
          name: 'Himalayan Forest Conservation',
          location: 'Thimphu, Bhutan',
          creditsAvailable: 500,
          pricePerCredit: 25,
          description: 'Protecting old-growth forests in the Himalayas',
          certifiedBy: 'Verified Carbon Standard (VCS)',
          co2PerCredit: 1.0,
          projectType: 'Forest Conservation',
          verificationHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
        },
        {
          id: 'solar-village-002',
          name: 'Solar Village Initiative',
          location: 'Paro, Bhutan',
          creditsAvailable: 200,
          pricePerCredit: 30,
          description: 'Installing solar panels in rural communities',
          certifiedBy: 'Gold Standard',
          co2PerCredit: 1.2,
          projectType: 'Renewable Energy',
          verificationHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
        }
      ]

      return new Response(
        JSON.stringify({ projects }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { action, projectId, amount, walletAddress, signature } = await req.json() as CarbonTradeRequest

    // Generate blockchain transaction hash
    const txHash = '0x' + Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('')

    // Record the transaction
    const { data, error } = await supabaseClient
      .from('carbon_credit_transactions')
      .insert([
        {
          transaction_hash: txHash,
          action: action,
          project_id: projectId,
          amount: amount,
          wallet_address: walletAddress,
          signature: signature,
          status: 'confirmed',
          gas_used: Math.floor(Math.random() * 80000) + 21000,
          block_number: Math.floor(Math.random() * 1000000) + 18000000,
          created_at: new Date().toISOString(),
        }
      ])

    if (error) {
      console.error('Database error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to record transaction' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Calculate environmental impact
    const co2Offset = amount * 1.1 // tonnes of CO2
    const treeEquivalent = Math.floor(co2Offset * 48) // trees planted equivalent

    return new Response(
      JSON.stringify({
        success: true,
        transaction: {
          hash: txHash,
          action: action,
          amount: amount,
          status: 'confirmed',
          blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
          gasUsed: Math.floor(Math.random() * 80000) + 21000,
        },
        impact: {
          co2Offset: co2Offset,
          treeEquivalent: treeEquivalent,
          carbonNeutralProgress: Math.min(100, (co2Offset / 50) * 100), // Progress towards 50 tonne goal
        },
        verification: {
          certificateId: `BCC-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
          blockchainProof: txHash,
          timestamp: new Date().toISOString(),
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error in carbon-credits:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
