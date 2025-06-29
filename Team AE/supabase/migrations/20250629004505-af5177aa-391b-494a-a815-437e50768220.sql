
-- Create enum for business statuses
CREATE TYPE business_status AS ENUM ('pending', 'active', 'suspended', 'expired');

-- Create enum for transaction types
CREATE TYPE transaction_type AS ENUM ('registration_fee', 'license_fee', 'annual_compliance', 'gnh_contribution', 'penalty', 'refund');

-- Create enum for payment statuses
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');

-- Update business_registrations table with better structure
DROP TABLE IF EXISTS public.business_licenses CASCADE;
DROP TABLE IF EXISTS public.business_transactions CASCADE;
DROP TABLE IF EXISTS public.business_registrations CASCADE;

CREATE TABLE public.business_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id VARCHAR(50) UNIQUE NOT NULL, -- Unique business ID (BHU-BIZ-XXXXXXXX)
  owner_user_id UUID REFERENCES auth.users NOT NULL,
  business_name VARCHAR(255) NOT NULL,
  business_type VARCHAR(100) NOT NULL,
  business_email VARCHAR(255) NOT NULL,
  business_phone VARCHAR(20),
  business_address TEXT,
  business_sector VARCHAR(100),
  license_type VARCHAR(100),
  annual_revenue_range VARCHAR(50),
  employee_count INTEGER DEFAULT 0,
  
  -- Financial details
  registration_fee_paid DECIMAL(15,2) DEFAULT 0,
  license_fee_paid DECIMAL(15,2) DEFAULT 0,
  annual_compliance_fee DECIMAL(15,2) DEFAULT 0,
  total_fees_paid DECIMAL(15,2) DEFAULT 0,
  total_gnh_contributions DECIMAL(15,2) DEFAULT 0,
  
  -- Digital identity
  business_did VARCHAR(500) NOT NULL,
  did_signature TEXT NOT NULL,
  wallet_address VARCHAR(42) NOT NULL,
  
  -- Status and verification
  verification_status business_status DEFAULT 'pending',
  registration_number VARCHAR(100), -- Official government registration number
  tax_identification_number VARCHAR(50),
  
  -- Dates
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  license_expiry_date TIMESTAMP WITH TIME ZONE,
  last_compliance_date TIMESTAMP WITH TIME ZONE,
  next_compliance_due TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create business_transactions table for all financial activities
CREATE TABLE public.business_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id VARCHAR(50) UNIQUE NOT NULL, -- Unique transaction ID
  business_id UUID REFERENCES public.business_registrations(id) NOT NULL,
  
  -- Transaction details
  transaction_type transaction_type NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'BTN',
  description TEXT,
  
  -- Payment details
  payment_method VARCHAR(50) DEFAULT 'wallet',
  payment_reference VARCHAR(100),
  blockchain_tx_hash VARCHAR(128),
  
  -- Status
  status payment_status DEFAULT 'pending',
  
  -- Dates
  transaction_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  payment_processed_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create business_analytics table for dashboard metrics
CREATE TABLE public.business_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES public.business_registrations(id) NOT NULL,
  
  -- Financial metrics
  total_revenue DECIMAL(15,2) DEFAULT 0,
  total_expenses DECIMAL(15,2) DEFAULT 0,
  tax_paid DECIMAL(15,2) DEFAULT 0,
  gnh_contributions DECIMAL(15,2) DEFAULT 0,
  
  -- Operational metrics
  employees_count INTEGER DEFAULT 0,
  compliance_score INTEGER DEFAULT 0, -- 0-100
  sustainability_score INTEGER DEFAULT 0, -- 0-100
  
  -- Performance metrics
  quarterly_growth_rate DECIMAL(5,2) DEFAULT 0,
  annual_growth_rate DECIMAL(5,2) DEFAULT 0,
  
  -- Reporting period
  reporting_year INTEGER NOT NULL,
  reporting_quarter INTEGER, -- 1-4, NULL for annual
  
  -- Dates
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(business_id, reporting_year, reporting_quarter)
);

-- Create business_licenses table for tracking various licenses and permits
CREATE TABLE public.business_licenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES public.business_registrations(id) NOT NULL,
  
  license_type VARCHAR(100) NOT NULL,
  license_number VARCHAR(100) UNIQUE,
  license_name VARCHAR(255) NOT NULL,
  issuing_authority VARCHAR(255) NOT NULL,
  
  -- Dates
  issue_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expiry_date TIMESTAMP WITH TIME ZONE,
  renewal_date TIMESTAMP WITH TIME ZONE,
  
  -- Financial
  fee_paid DECIMAL(10,2) NOT NULL DEFAULT 0,
  renewal_fee DECIMAL(10,2) DEFAULT 0,
  
  -- Status
  status business_status DEFAULT 'active',
  
  -- Requirements and conditions
  requirements_met JSONB DEFAULT '{}',
  conditions JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.business_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_licenses ENABLE ROW LEVEL SECURITY;

-- Business registrations policies
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

-- Business transactions policies
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

-- Business analytics policies
CREATE POLICY "Users can view analytics for their businesses" 
  ON public.business_analytics 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.business_registrations br 
      WHERE br.id = business_analytics.business_id 
      AND br.owner_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update analytics for their businesses" 
  ON public.business_analytics 
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.business_registrations br 
      WHERE br.id = business_analytics.business_id 
      AND br.owner_user_id = auth.uid()
    )
  );

-- Business licenses policies
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

-- Create functions for generating unique IDs
CREATE OR REPLACE FUNCTION generate_business_id()
RETURNS TEXT AS $$
BEGIN
  RETURN 'BHU-BIZ-' || LPAD(FLOOR(RANDOM() * 100000000)::TEXT, 8, '0');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_transaction_id()
RETURNS TEXT AS $$
BEGIN
  RETURN 'TXN-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate business_id
CREATE OR REPLACE FUNCTION set_business_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.business_id IS NULL THEN
    NEW.business_id := generate_business_id();
    -- Ensure uniqueness
    WHILE EXISTS (SELECT 1 FROM public.business_registrations WHERE business_id = NEW.business_id) LOOP
      NEW.business_id := generate_business_id();
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_business_id
  BEFORE INSERT ON public.business_registrations
  FOR EACH ROW
  EXECUTE FUNCTION set_business_id();

-- Create trigger to auto-generate transaction_id
CREATE OR REPLACE FUNCTION set_transaction_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.transaction_id IS NULL THEN
    NEW.transaction_id := generate_transaction_id();
    -- Ensure uniqueness
    WHILE EXISTS (SELECT 1 FROM public.business_transactions WHERE transaction_id = NEW.transaction_id) LOOP
      NEW.transaction_id := generate_transaction_id();
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_transaction_id
  BEFORE INSERT ON public.business_transactions
  FOR EACH ROW
  EXECUTE FUNCTION set_transaction_id();

-- Create trigger to update business totals when transactions are added
CREATE OR REPLACE FUNCTION update_business_totals()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'completed' THEN
    UPDATE public.business_registrations 
    SET 
      total_fees_paid = COALESCE(total_fees_paid, 0) + NEW.amount,
      total_gnh_contributions = CASE 
        WHEN NEW.transaction_type = 'gnh_contribution' 
        THEN COALESCE(total_gnh_contributions, 0) + NEW.amount 
        ELSE COALESCE(total_gnh_contributions, 0) 
      END,
      updated_at = NOW()
    WHERE id = NEW.business_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_business_totals
  AFTER INSERT ON public.business_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_business_totals();
