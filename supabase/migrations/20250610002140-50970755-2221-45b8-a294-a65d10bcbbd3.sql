
-- Criar tabela user_stores para relacionar usuários com lojas
CREATE TABLE public.user_stores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'employee',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, store_id)
);

-- Criar tabela products (produtos)
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  sku TEXT,
  description TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela sales (vendas)
CREATE TABLE public.sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES public.store_employees(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  sale_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_stores
CREATE POLICY "Users can view their store associations" 
  ON public.user_stores 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Store owners can manage associations" 
  ON public.user_stores 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.stores 
      WHERE id = user_stores.store_id 
      AND user_id = auth.uid()
    )
  );

-- RLS policies for products
CREATE POLICY "Store members can view products" 
  ON public.products 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.stores 
      WHERE id = products.store_id 
      AND (user_id = auth.uid() OR 
           EXISTS (SELECT 1 FROM public.user_stores WHERE store_id = products.store_id AND user_id = auth.uid()))
    )
  );

CREATE POLICY "Store owners can manage products" 
  ON public.products 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.stores 
      WHERE id = products.store_id 
      AND user_id = auth.uid()
    )
  );

-- RLS policies for sales
CREATE POLICY "Store members can view sales" 
  ON public.sales 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.stores 
      WHERE id = sales.store_id 
      AND (user_id = auth.uid() OR 
           EXISTS (SELECT 1 FROM public.user_stores WHERE store_id = sales.store_id AND user_id = auth.uid()))
    )
  );

CREATE POLICY "Store members can create sales" 
  ON public.sales 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.stores 
      WHERE id = sales.store_id 
      AND (user_id = auth.uid() OR 
           EXISTS (SELECT 1 FROM public.user_stores WHERE store_id = sales.store_id AND user_id = auth.uid()))
    )
  );

-- Platform admin policies
CREATE POLICY "Platform admins can view all user_stores" 
  ON public.user_stores 
  FOR ALL 
  USING (public.is_platform_admin());

CREATE POLICY "Platform admins can view all products" 
  ON public.products 
  FOR ALL 
  USING (public.is_platform_admin());

CREATE POLICY "Platform admins can view all sales" 
  ON public.sales 
  FOR ALL 
  USING (public.is_platform_admin());

-- Indexes
CREATE INDEX idx_user_stores_user_id ON public.user_stores(user_id);
CREATE INDEX idx_user_stores_store_id ON public.user_stores(store_id);
CREATE INDEX idx_products_store_id ON public.products(store_id);
CREATE INDEX idx_products_name ON public.products(name);
CREATE INDEX idx_sales_store_id ON public.sales(store_id);
CREATE INDEX idx_sales_product_id ON public.sales(product_id);
CREATE INDEX idx_sales_date ON public.sales(sale_date);
