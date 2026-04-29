import { Product } from './types';

export const PRODUCTS: Product[] = [
  // Cervejas
  {
    id: 'c1',
    name: 'Heineken 330ml',
    description: 'Cerveja lager premium, refrescante e com o sabor marcante que você já conhece.',
    price: 9.50,
    image: 'https://images.unsplash.com/photo-1618885472179-5e474019f2a9?auto=format&fit=crop&q=80&w=800',
    category: 'Cervejas'
  },
  {
    id: 'c2',
    name: 'Budweiser 350ml',
    description: 'Cerveja americana do tipo Lager, com sabor equilibrado e refrescante.',
    price: 6.90,
    image: 'https://images.unsplash.com/photo-1555658636-6e4a36218be7?auto=format&fit=crop&q=80&w=800',
    category: 'Cervejas'
  },
  {
    id: 'c3',
    name: 'Stella Artois 330ml',
    description: 'Cerveja premium belga, leve e com amargor suave.',
    price: 8.50,
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&q=80&w=800',
    category: 'Cervejas'
  },

  // Destilados
  {
    id: 'd1',
    name: 'Gin Tanqueray 750ml',
    description: 'Gin premium britânico, perfeito para o seu drink.',
    price: 120.00,
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&q=80&w=800',
    category: 'Destilados'
  },
  {
    id: 'd2',
    name: 'Vodka Absolut 750ml',
    description: 'Vodka sueca pura e cristalina, ideal para coquetéis.',
    price: 95.00,
    image: 'https://images.unsplash.com/photo-1550985543-f47f38aee65e?auto=format&fit=crop&q=80&w=800',
    category: 'Destilados'
  },
  {
    id: 'd3',
    name: 'Whisky Black Label 1L',
    description: 'Johnnie Walker Black Label, o clássico 12 anos.',
    price: 180.00,
    image: 'https://images.unsplash.com/photo-1527281405159-35d5b9a9bc51?auto=format&fit=crop&q=80&w=800',
    category: 'Destilados'
  },

  // Combos
  {
    id: 'cb1',
    name: 'Combo Gin Tônica',
    description: '1 Gin Tanqueray + 4 Tônicas Antarctica + Gelo Furado + Morangos.',
    price: 165.00,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=800',
    category: 'Combos'
  },
  {
    id: 'cb2',
    name: 'Combo Vodka com Energético',
    description: '1 Vodka Absolut + 4 Red Bull 250ml + Balde de Gelo.',
    price: 180.00,
    image: 'https://images.unsplash.com/photo-1542337142-3112d76f01f0?auto=format&fit=crop&q=80&w=800',
    category: 'Combos'
  },

  // Porções
  {
    id: 'p1',
    name: 'Batata Frita',
    description: 'Batatas crocantes por fora e macias por dentro.',
    price: 35.00, // Preço base para média
    image: 'https://images.unsplash.com/photo-1573014133633-5b078578299a?auto=format&fit=crop&q=80&w=800',
    category: 'Porções',
    options: ['Individual', 'Média', 'Grande'],
    pricesByOption: {
      'Individual': 25.00,
      'Média': 35.00,
       'Grande': 55.00
    }
  },
  {
    id: 'p2',
    name: 'Calabresa com Acebolada',
    description: 'Calabresa frita com cebola na chapa, acompanha pães.',
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1593361110037-3773177894a8?auto=format&fit=crop&q=80&w=800',
    category: 'Porções',
    options: ['Média', 'Grande'],
    pricesByOption: {
      'Média': 45.00,
      'Grande': 65.00
    }
  },

  // Refrigerantes
  {
    id: 'r1',
    name: 'Coca-Cola 2L',
    description: 'Sabor original, gelada e refrescante.',
    price: 12.00,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=800',
    category: 'Refrigerantes'
  },
  {
    id: 'r2',
    name: 'Guaraná Antarctica 2L',
    description: 'O sabor do Brasil, ideal para acompanhar suas porções.',
    price: 10.00,
    image: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&q=80&w=800',
    category: 'Refrigerantes'
  }
];

export const CATEGORIES: { name: string; icon: string }[] = [
  { name: 'Cervejas', icon: 'Beer' },
  { name: 'Destilados', icon: 'Wine' },
  { name: 'Combos', icon: 'Package' },
  { name: 'Porções', icon: 'Beef' },
  { name: 'Refrigerantes', icon: 'CupSoda' },
  { name: 'Gelo & Acompanhamentos', icon: 'Snowflake' }
];

export const WHATSAPP_NUMBER = '5511999999999'; // Exemplo
