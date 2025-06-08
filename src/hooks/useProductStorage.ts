
import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock_quantity: number;
  sku?: string;
  created_at: string;
}

export const useProductStorage = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const storedProducts = localStorage.getItem('mksimplo_products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }
  }, []);

  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('mksimplo_products', JSON.stringify(newProducts));
  };

  const addProduct = (product: Omit<Product, 'id' | 'created_at'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    const updatedProducts = [newProduct, ...products];
    saveProducts(updatedProducts);
    return newProduct;
  };

  const updateProduct = (id: string, product: Omit<Product, 'id' | 'created_at'>) => {
    const updatedProducts = products.map(p => 
      p.id === id 
        ? { ...product, id, created_at: p.created_at }
        : p
    );
    saveProducts(updatedProducts);
  };

  const deleteProduct = (id: string) => {
    const updatedProducts = products.filter(p => p.id !== id);
    saveProducts(updatedProducts);
  };

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct
  };
};
