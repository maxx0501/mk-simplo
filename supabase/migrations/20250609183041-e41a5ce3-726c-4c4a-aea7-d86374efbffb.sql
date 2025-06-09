
-- Create stores table (lojas)
CREATE TABLE public.stores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  email TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  access_code TEXT UNIQUE NOT NULL DEFAULT public.generate_store_access_code(),
  plan_type TEXT NOT NULL DEFAULT 'trial',
  status TEXT NOT NULL DEFAULT 'active',
  subscription_id UUID REFERENCES public.subscriptions(id),
  trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '7 days'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create store_employees table (funcionários da loja)
CREATE TABLE public.store_employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  login TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(store_id, login)
);

-- Enable RLS on both tables
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_employees ENABLE ROW LEVEL SECURITY;

-- RLS policies for stores
CREATE POLICY "Users can view their own stores" 
  ON public.stores 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own stores" 
  ON public.stores 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stores" 
  ON public.stores 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stores" 
  ON public.stores 
  FOR DELETE 
  USING (auth.uid() = user_id);

CREATE POLICY "Platform admins can view all stores" 
  ON public.stores 
  FOR ALL 
  USING (public.is_platform_admin());

-- RLS policies for store_employees
CREATE POLICY "Store owners can manage employees" 
  ON public.store_employees 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.stores 
      WHERE id = store_employees.store_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Platform admins can view all employees" 
  ON public.store_employees 
  FOR SELECT 
  USING (public.is_platform_admin());

-- Create indexes for better performance
CREATE INDEX idx_stores_user_id ON public.stores(user_id);
CREATE INDEX idx_stores_access_code ON public.stores(access_code);
CREATE INDEX idx_store_employees_store_id ON public.store_employees(store_id);
CREATE INDEX idx_store_employees_login ON public.store_employees(store_id, login);
