-- Criar tabela de lojas
CREATE TABLE public.stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  cnpj TEXT,
  address TEXT,
  owner_name TEXT,
  plan_type TEXT DEFAULT 'free',
  status TEXT DEFAULT 'active',
  subscription_status TEXT DEFAULT 'trial',
  subscription_id TEXT,
  trial_ends_at TIMESTAMPTZ,
  access_code TEXT UNIQUE,
  user_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela de perfis de usuário
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela de relacionamento usuário-loja
CREATE TABLE public.user_stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'employee',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, store_id)
);

-- Criar tabela de funcionários de loja
CREATE TABLE public.store_employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'employee',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela de administradores da plataforma
CREATE TABLE public.platform_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela de produtos
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela de vendas
CREATE TABLE public.sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  sale_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

-- Policies para stores
CREATE POLICY "Users can view their own stores"
  ON public.stores FOR SELECT
  USING (
    user_id = auth.uid() OR
    id IN (SELECT store_id FROM public.user_stores WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update their own stores"
  ON public.stores FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert stores"
  ON public.stores FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Policies para profiles
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (id = auth.uid());

-- Policies para user_stores
CREATE POLICY "Users can view their store relationships"
  ON public.user_stores FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their store relationships"
  ON public.user_stores FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Policies para store_employees
CREATE POLICY "Store employees can view employees in their store"
  ON public.store_employees FOR SELECT
  USING (
    store_id IN (SELECT store_id FROM public.user_stores WHERE user_id = auth.uid())
  );

CREATE POLICY "Store owners can manage employees"
  ON public.store_employees FOR ALL
  USING (
    store_id IN (
      SELECT id FROM public.stores WHERE user_id = auth.uid()
    )
  );

-- Policies para products
CREATE POLICY "Users can view products in their stores"
  ON public.products FOR SELECT
  USING (
    store_id IN (SELECT store_id FROM public.user_stores WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can manage products in their stores"
  ON public.products FOR ALL
  USING (
    store_id IN (SELECT store_id FROM public.user_stores WHERE user_id = auth.uid())
  );

-- Policies para sales
CREATE POLICY "Users can view sales in their stores"
  ON public.sales FOR SELECT
  USING (
    store_id IN (SELECT store_id FROM public.user_stores WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create sales in their stores"
  ON public.sales FOR INSERT
  WITH CHECK (
    store_id IN (SELECT store_id FROM public.user_stores WHERE user_id = auth.uid())
  );

-- Policies para platform_admins (somente leitura para usuários autenticados)
CREATE POLICY "Anyone can check if user is admin"
  ON public.platform_admins FOR SELECT
  USING (true);

-- Função para gerar código de acesso
CREATE OR REPLACE FUNCTION generate_store_access_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
BEGIN
  code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stores_updated_at
  BEFORE UPDATE ON public.stores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_store_employees_updated_at
  BEFORE UPDATE ON public.store_employees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();