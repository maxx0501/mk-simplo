
import { useState, useEffect } from 'react';

interface Sale {
  id: string;
  product_name: string;
  product_value: number;
  sale_date: string;
  notes?: string;
  employee_name: string;
}

export const useSalesStorage = () => {
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    const storedSales = localStorage.getItem('mksimplo_sales');
    if (storedSales) {
      setSales(JSON.parse(storedSales));
    }
  }, []);

  const saveSales = (newSales: Sale[]) => {
    setSales(newSales);
    localStorage.setItem('mksimplo_sales', JSON.stringify(newSales));
  };

  const addSale = (sale: Omit<Sale, 'id' | 'sale_date'>) => {
    const newSale: Sale = {
      ...sale,
      id: Date.now().toString(),
      sale_date: new Date().toISOString()
    };
    const updatedSales = [newSale, ...sales];
    saveSales(updatedSales);
    return newSale;
  };

  return {
    sales,
    addSale
  };
};
