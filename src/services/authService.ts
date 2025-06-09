
import { supabase } from '@/integrations/supabase/client';

export const loginUser = async (email: string, password: string) => {
  console.log('Tentando fazer login com email:', email);

  // Tentar fazer login
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password: password,
  });

  if (error) {
    console.error('Erro no login:', error);
    throw error;
  }

  console.log('Login bem-sucedido:', data);

  if (!data.user) {
    throw new Error('Usuário não encontrado');
  }

  // Verificar se é admin da plataforma usando a tabela platform_admins
  try {
    console.log('Verificando se é superadmin via tabela platform_admins...');
    const { data: adminData } = await supabase
      .from('platform_admins')
      .select('*')
      .eq('user_id', data.user.id)
      .maybeSingle();

    if (adminData) {
      console.log('Usuário é admin da plataforma');
      return {
        success: true,
        userData: {
          id: data.user.id,
          email: data.user.email,
          role: 'superadmin',
          empresa_id: null
        },
        redirectTo: '/admin'
      };
    }
  } catch (profileCheckError) {
    console.log('⚠️ Erro ao verificar admin, continuando como usuário normal:', profileCheckError);
  }

  // Buscar dados do usuário e empresa
  const { data: usuarioData } = await supabase
    .from('usuarios')
    .select('*, empresas(*)')
    .eq('id', data.user.id)
    .single();

  if (usuarioData && usuarioData.empresas) {
    console.log('Usuário tem empresa associada:', usuarioData.empresas.nome);
    return {
      success: true,
      userData: {
        id: data.user.id,
        email: data.user.email,
        nome: usuarioData.nome,
        empresa_id: usuarioData.empresa_id,
        empresa_nome: usuarioData.empresas.nome
      },
      redirectTo: '/dashboard'
    };
  }

  console.log('Usuário não tem empresa associada');
  return {
    success: true,
    userData: {
      id: data.user.id,
      email: data.user.email,
      nome: null,
      empresa_id: null,
      empresa_nome: null
    },
    redirectTo: '/dashboard'
  };
};

export const registerUser = async (ownerName: string, email: string, password: string, companyName?: string) => {
  console.log('=== INICIANDO CADASTRO ===');
  console.log('Email:', email);
  console.log('Nome do proprietário:', ownerName);
  console.log('Nome da empresa:', companyName);
  
  // Validações básicas
  if (!ownerName.trim() || !email.trim() || !password.trim()) {
    throw new Error('Todos os campos são obrigatórios.');
  }

  if (password.length < 6) {
    throw new Error('A senha deve ter pelo menos 6 caracteres.');
  }
  
  // Criar o usuário no Supabase Auth
  console.log('Criando usuário no Supabase Auth...');
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: email.trim(),
    password: password,
    options: {
      data: {
        full_name: ownerName,
        company_name: companyName || 'Minha Empresa'
      },
      emailRedirectTo: `${window.location.origin}/login`
    }
  });

  if (authError) {
    console.error('Erro no auth:', authError);
    
    if (authError.message === "User already registered") {
      throw new Error('Este email já possui uma conta. Tente fazer login.');
    }
    
    throw new Error(authError.message || 'Erro ao criar conta. Tente novamente.');
  }

  console.log('Usuário criado no auth com sucesso:', authData.user?.id);

  if (!authData.user) {
    throw new Error('Falha ao criar usuário. Tente novamente.');
  }

  return { success: true };
};

export const resendEmailConfirmation = async (email: string) => {
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email.trim(),
    options: {
      emailRedirectTo: `${window.location.origin}/login`
    }
  });

  if (error) {
    throw error;
  }

  return { success: true };
};
