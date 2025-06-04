
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Grid3X3, 
  List, 
  Filter, 
  ShoppingCart, 
  Eye,
  Globe,
  Share2
} from 'lucide-react';

interface CatalogProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image?: string;
  inStock: boolean;
  featured: boolean;
}

const Catalog = () => {
  const [products] = useState<CatalogProduct[]>([
    {
      id: '1',
      name: 'Camiseta Básica',
      description: 'Camiseta 100% algodão, disponível em várias cores',
      category: 'Camisetas',
      price: 29.90,
      image: '/placeholder.svg',
      inStock: true,
      featured: true,
    },
    {
      id: '2',
      name: 'Calça Jeans',
      description: 'Calça jeans slim fit, corte moderno',
      category: 'Calças',
      price: 89.90,
      image: '/placeholder.svg',
      inStock: true,
      featured: false,
    },
    {
      id: '3',
      name: 'Tênis Esportivo',
      description: 'Tênis confortável para atividades físicas',
      category: 'Calçados',
      price: 149.90,
      image: '/placeholder.svg',
      inStock: false,
      featured: true,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showOnlyInStock, setShowOnlyInStock] = useState(false);

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesStock = !showOnlyInStock || product.inStock;
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  const featuredProducts = products.filter(p => p.featured && p.inStock);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + '/catalog');
    // Toast notification would go here
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Globe className="w-8 h-8 mr-3 text-blue-600" />
              Catálogo de Produtos
            </h1>
            <p className="text-gray-600 mt-1">Gerencie como seus produtos aparecem para os clientes</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar Catálogo
            </Button>
            <Button>
              <Eye className="w-4 h-4 mr-2" />
              Preview Público
            </Button>
          </div>
        </div>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Produtos em Destaque</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {featuredProducts.map(product => (
                  <div key={product.id} className="border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-purple-50">
                    <div className="aspect-square bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                      <div className="text-gray-400 text-sm">Imagem do Produto</div>
                    </div>
                    <h3 className="font-semibold mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-blue-600">
                        R$ {product.price.toFixed(2)}
                      </span>
                      <Badge>Destaque</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters and Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'Todas as categorias' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant={showOnlyInStock ? "default" : "outline"}
                onClick={() => setShowOnlyInStock(!showOnlyInStock)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Apenas em estoque
              </Button>

              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid/List */}
        <Card>
          <CardHeader>
            <CardTitle>
              Produtos ({filteredProducts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <div key={product.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square bg-gray-200 flex items-center justify-center">
                      <div className="text-gray-400 text-sm">Imagem do Produto</div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-sm">{product.name}</h3>
                        {product.featured && (
                          <Badge variant="secondary" className="text-xs">
                            Destaque
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-blue-600">
                          R$ {product.price.toFixed(2)}
                        </span>
                        <div className="flex items-center space-x-2">
                          {product.inStock ? (
                            <Badge variant="default" className="text-xs">
                              Em estoque
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="text-xs">
                              Indisponível
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map(product => (
                  <div key={product.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <div className="text-gray-400 text-xs">Imagem</div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold">{product.name}</h3>
                          {product.featured && <Badge variant="secondary">Destaque</Badge>}
                          {product.inStock ? (
                            <Badge variant="default">Em estoque</Badge>
                          ) : (
                            <Badge variant="destructive">Indisponível</Badge>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                        <p className="text-sm text-gray-500">Categoria: {product.category}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-blue-600">
                          R$ {product.price.toFixed(2)}
                        </div>
                        <Button size="sm" variant="outline" className="mt-2">
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Ver no catálogo
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredProducts.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Globe className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Nenhum produto encontrado</h3>
                <p>Tente ajustar os filtros ou adicionar novos produtos</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Catalog Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {products.length}
                </div>
                <div className="text-sm text-gray-600">Total de Produtos</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {products.filter(p => p.inStock).length}
                </div>
                <div className="text-sm text-gray-600">Em Estoque</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {featuredProducts.length}
                </div>
                <div className="text-sm text-gray-600">Em Destaque</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {categories.length - 1}
                </div>
                <div className="text-sm text-gray-600">Categorias</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Catalog;
