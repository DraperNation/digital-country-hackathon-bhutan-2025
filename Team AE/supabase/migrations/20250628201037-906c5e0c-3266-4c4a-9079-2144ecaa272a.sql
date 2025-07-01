
-- Create table for digital attestations
CREATE TABLE public.digital_attestations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  attestation_type VARCHAR(100) NOT NULL,
  issuer_name VARCHAR(255) NOT NULL,
  issuer_did VARCHAR(500),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  attestation_data JSONB,
  verification_hash VARCHAR(128),
  blockchain_tx_hash VARCHAR(128),
  issue_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expiry_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'active',
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for business registrations
CREATE TABLE public.business_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_user_id UUID REFERENCES auth.users NOT NULL,
  business_name VARCHAR(255) NOT NULL,
  business_type VARCHAR(100) NOT NULL,
  registration_number VARCHAR(100),
  business_email VARCHAR(255) NOT NULL,
  business_address TEXT,
  business_did VARCHAR(500),
  did_signature TEXT,
  license_type VARCHAR(100),
  annual_revenue_range VARCHAR(50),
  employee_count INTEGER DEFAULT 0,
  business_sector VARCHAR(100),
  verification_status VARCHAR(50) DEFAULT 'pending',
  registration_fee_paid DECIMAL(10,2) DEFAULT 0,
  annual_compliance_fee DECIMAL(10,2) DEFAULT 0,
  wallet_address VARCHAR(42),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for business transactions
CREATE TABLE public.business_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES public.business_registrations(id) NOT NULL,
  transaction_type VARCHAR(100) NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'BTN',
  description TEXT,
  blockchain_tx_hash VARCHAR(128),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for business licenses and permits
CREATE TABLE public.business_licenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES public.business_registrations(id) NOT NULL,
  license_type VARCHAR(100) NOT NULL,
  license_number VARCHAR(100),
  issue_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expiry_date TIMESTAMP WITH TIME ZONE,
  issuing_authority VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  fee_paid DECIMAL(10,2),
  requirements_met JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for digital attestations
ALTER TABLE public.digital_attestations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own attestations" 
  ON public.digital_attestations 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own attestations" 
  ON public.digital_attestations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Add RLS policies for business registrations
ALTER TABLE public.business_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own businesses" 
  ON public.business_registrations 
  FOR SELECT 
  USING (auth.uid() = owner_user_id);

CREATE POLICY "Users can create their own businesses" 
  ON public.business_registrations 
  FOR INSERT 
  WITH CHECK (auth.uid() = owner_user_id);

CREATE POLICY "Users can update their own businesses" 
  ON public.business_registrations 
  FOR UPDATE 
  USING (auth.uid() = owner_user_id);

-- Add RLS policies for business transactions
ALTER TABLE public.business_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view transactions for their businesses" 
  ON public.business_transactions 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.business_registrations br 
      WHERE br.id = business_transactions.business_id 
      AND br.owner_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create transactions for their businesses" 
  ON public.business_transactions 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.business_registrations br 
      WHERE br.id = business_transactions.business_id 
      AND br.owner_user_id = auth.uid()
    )
  );

-- Add RLS policies for business licenses
ALTER TABLE public.business_licenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view licenses for their businesses" 
  ON public.business_licenses 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.business_registrations br 
      WHERE br.id = business_licenses.business_id 
      AND br.owner_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create licenses for their businesses" 
  ON public.business_licenses 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.business_registrations br 
      WHERE br.id = business_licenses.business_id 
      AND br.owner_user_id = auth.uid()
    )
  );
