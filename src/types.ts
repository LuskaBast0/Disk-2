export type Category = 'Cervejas' | 'Destilados' | 'Combos' | 'Porções' | 'Refrigerantes' | 'Gelo & Acompanhamentos';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: Category;
  options?: string[]; // Para porções: ['Pequena', 'Média', 'Grande']
  pricesByOption?: { [key: string]: number };
}

export interface CartItem {
  id: string; // unique for that item in cart (product.id + option)
  product: Product;
  quantity: number;
  selectedOption?: string;
  observation?: string;
}
