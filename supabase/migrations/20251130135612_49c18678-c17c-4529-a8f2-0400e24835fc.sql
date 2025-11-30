-- Remover tabela store_employees (vamos usar user_stores em vez disso)
DROP TABLE IF EXISTS public.store_employees CASCADE;

-- Adicionar campo de busca por nome em stores
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS search_name TEXT GENERATED ALWAYS AS (LOWER(name)) STORED;
CREATE INDEX IF NOT EXISTS idx_stores_search_name ON public.stores(search_name);

-- Atualizar user_stores para incluir status de convite
ALTER TABLE public.user_stores ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE public.user_stores ADD COLUMN IF NOT EXISTS invited_by UUID REFERENCES auth.users(id);
ALTER TABLE public.user_stores ADD COLUMN IF NOT EXISTS invited_at TIMESTAMP WITH TIME ZONE;

-- Criar tabela de solicitações de acesso
CREATE TABLE IF NOT EXISTS public.store_access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(store_id, user_id)
);

-- Criar tabela de notificações
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.store_access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Políticas para store_access_requests
CREATE POLICY "Users can view their own access requests"
ON public.store_access_requests FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can create access requests"
ON public.store_access_requests FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Store owners can view access requests for their stores"
ON public.store_access_requests FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.stores 
    WHERE id = store_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Store owners can update access requests for their stores"
ON public.store_access_requests FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.stores 
    WHERE id = store_id AND user_id = auth.uid()
  )
);

-- Políticas para notifications
CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
USING (user_id = auth.uid());

-- Função para criar notificação
CREATE OR REPLACE FUNCTION public.create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_data JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, data)
  VALUES (p_user_id, p_type, p_title, p_message, p_data)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

-- Trigger para criar notificação quando convite é criado
CREATE OR REPLACE FUNCTION public.notify_store_invite()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  store_name TEXT;
BEGIN
  IF NEW.status = 'pending' AND NEW.invited_by IS NOT NULL THEN
    SELECT name INTO store_name FROM public.stores WHERE id = NEW.store_id;
    
    PERFORM public.create_notification(
      NEW.user_id,
      'store_invite',
      'Convite para loja',
      'Você foi convidado para fazer parte da equipe da loja ' || store_name,
      jsonb_build_object('store_id', NEW.store_id, 'user_store_id', NEW.id)
    );
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_user_store_invite
  AFTER INSERT ON public.user_stores
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_store_invite();

-- Trigger para criar notificação quando solicitação de acesso é criada
CREATE OR REPLACE FUNCTION public.notify_access_request()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  store_owner_id UUID;
  requester_email TEXT;
BEGIN
  IF NEW.status = 'pending' THEN
    SELECT user_id INTO store_owner_id FROM public.stores WHERE id = NEW.store_id;
    SELECT email INTO requester_email FROM auth.users WHERE id = NEW.user_id;
    
    PERFORM public.create_notification(
      store_owner_id,
      'access_request',
      'Solicitação de acesso',
      requester_email || ' solicitou acesso à sua loja',
      jsonb_build_object('request_id', NEW.id, 'store_id', NEW.store_id)
    );
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_access_request_created
  AFTER INSERT ON public.store_access_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_access_request();