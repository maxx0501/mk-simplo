
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';

export default function Users() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  // Mock data para usuários
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'João Silva',
      email: 'joao@exemplo.com',
      phone: '(11) 99999-9999',
      role: 'owner',
      status: 'active',
      lastLogin: '2024-01-15 09:30',
      createdAt: '2024-01-01'
    },
    {
      id: 2,
      name: 'Maria Santos',
      email: 'maria@exemplo.com',
      phone: '(11) 88888-8888',
      role: 'manager',
      status: 'active',
      lastLogin: '2024-01-14 16:45',
      createdAt: '2024-01-05'
    },
    {
      id: 3,
      name: 'Pedro Costa',
      email: 'pedro@exemplo.com',
      phone: '(11) 77777-7777',
      role: 'seller',
      status: 'inactive',
      lastLogin: '2024-01-10 11:20',
      createdAt: '2024-01-08'
    },
    {
      id: 4,
      name: 'Ana Oliveira',
      email: 'ana@exemplo.com',
      phone: '(11) 66666-6666',
      role: 'seller',
      status: 'active',
      lastLogin: '2024-01-15 08:15',
      createdAt: '2024-01-12'
    }
  ]);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'seller',
    password: ''
  });

  const roles = {
    owner: { label: 'Proprietário', color: 'bg-purple-100 text-purple-800' },
    manager: { label: 'Gerente', color: 'bg-blue-100 text-blue-800' },
    seller: { label: 'Vendedor', color: 'bg-green-100 text-green-800' }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const user = {
      id: users.length + 1,
      ...newUser,
      status: 'active',
      lastLogin: '-',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setUsers([...users, user]);
    setNewUser({ name: '', email: '', phone: '', role: 'seller', password: '' });
    setIsAddUserOpen(false);

    toast({
      title: "Usuário adicionado",
      description: `${user.name} foi adicionado com sucesso`
    });
  };

  const handleToggleStatus = (userId: number) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));

    const user = users.find(u => u.id === userId);
    toast({
      title: `Usuário ${user?.status === 'active' ? 'desativado' : 'ativado'}`,
      description: `${user?.name} foi ${user?.status === 'active' ? 'desativado' : 'ativado'} com sucesso`
    });
  };

  const handleDeleteUser = (userId: number) => {
    const user = users.find(u => u.id === userId);
    setUsers(users.filter(user => user.id !== userId));
    
    toast({
      title: "Usuário removido",
      description: `${user?.name} foi removido com sucesso`
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Usuários</h1>
            <p className="text-gray-500">Gerencie os usuários da sua loja</p>
          </div>
          
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Usuário
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Usuário</DialogTitle>
                <DialogDescription>
                  Preencha as informações do novo usuário
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    placeholder="Nome completo"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Função</Label>
                  <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="seller">Vendedor</SelectItem>
                      <SelectItem value="manager">Gerente</SelectItem>
                      <SelectItem value="owner">Proprietário</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Senha *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    placeholder="Senha temporária"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddUser}>
                  Adicionar Usuário
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">
                usuários cadastrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {users.filter(u => u.status === 'active').length}
              </div>
              <p className="text-xs text-muted-foreground">
                usuários ativos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendedores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(u => u.role === 'seller').length}
              </div>
              <p className="text-xs text-muted-foreground">
                vendedores cadastrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gerentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(u => u.role === 'manager').length}
              </div>
              <p className="text-xs text-muted-foreground">
                gerentes cadastrados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Busca */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Usuários</CardTitle>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-48">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filtrar por função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as funções</SelectItem>
                  <SelectItem value="owner">Proprietário</SelectItem>
                  <SelectItem value="manager">Gerente</SelectItem>
                  <SelectItem value="seller">Vendedor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Último Login</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail className="mr-1 h-3 w-3" />
                          {user.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm flex items-center">
                        <Phone className="mr-1 h-3 w-3" />
                        {user.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={roles[user.role as keyof typeof roles].color}>
                        {roles[user.role as keyof typeof roles].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                        {user.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        {user.lastLogin}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleStatus(user.id)}
                        >
                          {user.status === 'active' ? (
                            <UserX className="h-4 w-4" />
                          ) : (
                            <UserCheck className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingUser(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Permissões por Função */}
        <Card>
          <CardHeader>
            <CardTitle>Permissões por Função</CardTitle>
            <CardDescription>
              Entenda as permissões de cada função no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-purple-800">Proprietário</h4>
                  <Badge className="bg-purple-100 text-purple-800">Acesso Total</Badge>
                </div>
                <p className="text-sm text-gray-600">
                  Acesso completo a todas as funcionalidades, incluindo configurações da loja, 
                  relatórios financeiros e gerenciamento de usuários.
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-blue-800">Gerente</h4>
                  <Badge className="bg-blue-100 text-blue-800">Acesso Avançado</Badge>
                </div>
                <p className="text-sm text-gray-600">
                  Pode gerenciar produtos, vendas, estoque e relatórios. 
                  Não tem acesso às configurações da loja nem ao gerenciamento de usuários.
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-green-800">Vendedor</h4>
                  <Badge className="bg-green-100 text-green-800">Acesso Básico</Badge>
                </div>
                <p className="text-sm text-gray-600">
                  Pode registrar vendas, consultar produtos e verificar estoque. 
                  Acesso limitado a relatórios básicos de suas próprias vendas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
