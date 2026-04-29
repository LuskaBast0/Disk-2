/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Beer, 
  Wine, 
  Package, 
  Beef, 
  CupSoda, 
  Snowflake, 
  ShoppingCart, 
  X, 
  Plus, 
  Minus, 
  MessageCircle, 
  Search,
  ExternalLink,
  Info,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { Category, Product, CartItem } from './types';
import { PRODUCTS, CATEGORIES, WHATSAPP_NUMBER } from './constants';

const categoryIcons: { [key: string]: any } = {
  'Cervejas': Beer,
  'Destilados': Wine,
  'Combos': Package,
  'Porções': Beef,
  'Refrigerantes': CupSoda,
  'Gelo & Acompanhamentos': Snowflake
};

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('Cervejas');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Cart operations
  const addToCart = (product: Product, quantity: number, option?: string, observation?: string) => {
    const cartId = `${product.id}-${option || 'default'}`;
    setCart(prev => {
      const existing = prev.find(item => item.id === cartId);
      if (existing) {
        return prev.map(item => 
          item.id === cartId 
            ? { ...item, quantity: item.quantity + quantity, observation: observation || item.observation } 
            : item
        );
      }
      return [...prev, { id: cartId, product, quantity, selectedOption: option, observation }];
    });
    setSelectedProduct(null);
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartId));
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === cartId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => {
      const price = item.selectedOption && item.product.pricesByOption 
        ? item.product.pricesByOption[item.selectedOption] 
        : item.product.price;
      return total + (price * item.quantity);
    }, 0);
  }, [cart]);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchesCategory = p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const sendWhatsAppOrder = () => {
    let message = `*Novo Pedido - Adega Vila*\n\n`;
    cart.forEach(item => {
      const price = item.selectedOption && item.product.pricesByOption 
        ? item.product.pricesByOption[item.selectedOption] 
        : item.product.price;
      
      message += `✅ *${item.quantity}x ${item.product.name}*`;
      if (item.selectedOption) message += ` (${item.selectedOption})`;
      message += `\n   Subtotal: R$ ${(price * item.quantity).toFixed(2)}`;
      if (item.observation) message += `\n   Obs: ${item.observation}`;
      message += `\n\n`;
    });

    message += `💰 *Total: R$ ${cartTotal.toFixed(2)}*\n\n`;
    message += `📍 _Por favor, informe seu endereço abaixo para entrega._`;

    const url = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-border py-6 px-6 md:px-12 flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="font-display font-black text-4xl tracking-tighter leading-none text-brand uppercase">
            DISK<span className="text-white">BEBIDAS</span>
          </h1>
          <p className="text-muted text-[10px] font-black uppercase tracking-[0.3em] mt-1">Adega Vila Delivery</p>
        </div>

        <div className="flex items-center gap-4">
          <button 
            id="cart-trigger"
            onClick={() => setIsCartOpen(true)}
            className="group relative p-3 bg-white/5 border-2 border-white/10 hover:bg-brand hover:border-brand transition-all duration-300"
          >
            <ShoppingCart size={22} className="group-hover:text-black transition-colors" />
            {cart.length > 0 && (
              <span className="absolute -top-3 -right-3 bg-white text-black font-black text-[10px] w-6 h-6 flex items-center justify-center border-2 border-stone-950">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-12 pt-12">
        {/* Welcome Section */}
        <section className="mb-12">
          <h2 className="font-display text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-4">
            Gelada na <br/><span className="text-brand">sua porta.</span>
          </h2>
          <p className="text-muted font-bold text-sm uppercase tracking-widest">Entrega ultra-rápida em toda a região.</p>
        </section>

        {/* Search */}
        <div className="relative mb-12">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted" size={20} />
          <input 
            type="text" 
            placeholder="O que você quer beber?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border-2 border-border py-5 pl-14 pr-6 focus:outline-none focus:border-brand transition-all placeholder:text-stone-700 font-bold uppercase text-sm tracking-widest"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 sticky top-[92px] bg-surface z-30 pt-4 mb-12 border-b border-border">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name as Category)}
                className={`px-8 py-3 font-black text-xs uppercase tracking-widest transition-all duration-300 border-2 whitespace-nowrap ${
                  isActive 
                    ? 'bg-brand border-brand text-black shadow-[4px_4px_0_0_rgba(245,158,11,0.2)]' 
                    : 'bg-stone-900 border-stone-800 text-stone-500 hover:border-stone-600 hover:text-stone-300'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="group bg-stone-950 border-2 border-border p-5 flex gap-6 hover:border-brand transition-all duration-300 cursor-pointer relative overflow-hidden"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="w-32 h-32 md:w-40 md:h-40 bg-stone-900 border-2 border-stone-800 flex-shrink-0 relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 bg-stone-950/80 px-2 py-1 text-[8px] font-black uppercase tracking-widest text-brand">
                    {product.category}
                  </div>
                </div>
                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <div>
                    <h3 className="font-display font-black text-2xl leading-none uppercase mb-2 group-hover:text-brand transition-colors truncate">
                      {product.name}
                    </h3>
                    <p className="text-[10px] text-stone-500 uppercase tracking-[0.05em] font-bold line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                  <div className="flex justify-between items-end mt-4">
                    <span className="text-brand font-black text-2xl italic tracking-tighter">
                      {product.options && product.pricesByOption
                        ? `R$ ${Math.min(...Object.values(product.pricesByOption).map(p => Number(p))).toFixed(2)}`
                        : `R$ ${product.price.toFixed(2)}`
                      }
                    </span>
                    <button className="bg-stone-100 text-stone-950 w-10 h-10 flex items-center justify-center font-black text-xl hover:bg-brand transition-colors">
                      +
                    </button>
                  </div>
                </div>
                {/* Accent line */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 rotate-45 translate-x-12 -translate-y-12 pointer-events-none" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-24 px-6">
            <div className="bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="text-white/20" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Nenhum produto encontrado</h3>
            <p className="text-white/40">Tente ajustar sua busca ou mudar a categoria.</p>
          </div>
        )}
      </main>

      {/* Floating Cart Button (Mobile) */}
      <AnimatePresence>
        {cart.length > 0 && !isCartOpen && (
          <motion.button
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            onClick={() => setIsCartOpen(true)}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-brand text-black px-8 py-4 rounded-full font-bold shadow-2xl flex items-center gap-3 md:hidden group"
          >
            <ShoppingCart size={20} />
            <span>Ver Carrinho ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
            <div className="bg-black/20 w-px h-4 mx-2" />
            <span className="font-extrabold font-display">R$ {cartTotal.toFixed(2)}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-stone-950/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full max-w-3xl bg-stone-900 border-t-8 border-brand overflow-hidden flex flex-col max-h-[95vh]"
            >
              <div className="flex flex-col md:flex-row h-full">
                <div className="relative w-full md:w-1/2 h-64 md:h-auto">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover grayscale"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900 to-transparent" />
                </div>
                
                <div className="p-8 md:p-12 flex-1 overflow-y-auto custom-scrollbar flex flex-col">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand mb-4 block">
                        // {selectedProduct.category}
                      </span>
                      <h2 className="text-5xl font-display font-black leading-none uppercase tracking-tighter">{selectedProduct.name}</h2>
                    </div>
                    <button 
                      onClick={() => setSelectedProduct(null)}
                      className="p-2 hover:bg-white/5 bg-white/5 rounded-none transition-colors border border-white/10"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <p className="text-stone-400 font-bold text-sm leading-relaxed mb-10 max-w-md">{selectedProduct.description}</p>

                  <div className="mt-auto">
                    <ProductForm 
                      product={selectedProduct} 
                      onConfirm={(qty, obs, opt) => addToCart(selectedProduct, qty, opt, obs)}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-stone-950/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 35, stiffness: 350 }}
              className="relative w-full max-w-lg bg-brand text-stone-950 flex flex-col h-full shadow-2xl"
            >
              <div className="p-8 border-b-4 border-stone-950 flex items-center justify-between">
                <h2 className="text-4xl font-display font-black uppercase italic tracking-tighter leading-none">
                  Seu Pedido
                </h2>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-black/10 transition-colors border-2 border-stone-950"
                >
                  <X size={28} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                    <ShoppingCart size={80} className="mb-6 stroke-[3px]" />
                    <h3 className="text-2xl font-black uppercase italic italic">Carrinho Vazio</h3>
                  </div>
                ) : (
                  cart.map((item) => (
                    <motion.div 
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative border-b-2 border-stone-950/20 pb-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                          <span className="text-4xl font-black italic tracking-tighter leading-none opacity-40">{item.quantity}X</span>
                          <div>
                            <h4 className="text-xl font-black uppercase leading-none mb-1">{item.product.name}</h4>
                            {item.selectedOption && (
                              <span className="text-[10px] font-black uppercase tracking-widest bg-stone-950/10 px-2 py-0.5">
                                {item.selectedOption}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                           <span className="text-xl font-black italic">
                             R$ {( (item.selectedOption && item.product.pricesByOption ? item.product.pricesByOption[item.selectedOption] : item.product.price) * item.quantity).toFixed(2)}
                           </span>
                           <button onClick={() => removeFromCart(item.id)} className="text-stone-950 hover:bg-stone-950 hover:text-white transition-all p-1 border border-stone-950">
                               <X size={14} />
                           </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex border-2 border-stone-950">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-2 hover:bg-stone-950/10"><Minus size={14} /></button>
                          <span className="text-base font-black px-4 py-2 border-x-2 border-stone-950">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:bg-stone-950/10"><Plus size={14} /></button>
                        </div>
                        {item.observation && (
                          <div className="text-[10px] font-bold uppercase tracking-tight opacity-70 bg-stone-950/5 p-2 flex-1">
                             OBS: {item.observation}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 bg-amber-400 border-t-4 border-stone-950 space-y-8">
                  <div className="flex justify-between items-end">
                    <span className="text-2xl font-black uppercase italic leading-none">Total Geral</span>
                    <div className="text-right">
                      <span className="text-[10px] font-black uppercase block tracking-widest opacity-60 mb-2">Pague na entrega</span>
                      <span className="text-6xl font-black italic leading-none tracking-tighter">R$ {cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  <button 
                    onClick={sendWhatsAppOrder}
                    className="w-full bg-stone-950 text-brand py-6 font-black uppercase text-2xl tracking-tighter flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[8px_8px_0_0_rgba(0,0,0,1)]"
                  >
                    <MessageCircle size={32} />
                    Finalizar Pedido
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer Info (Desktop) */}
      <footer className="mt-12 py-12 px-6 border-t border-white/5 text-center sm:text-left max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <h3 className="font-display font-extrabold text-2xl mb-4">ADEGA VILA</h3>
            <p className="text-white/40 text-sm max-w-md">
              O melhor delivery de bebidas da região. Qualidade, rapidez e os melhores preços para você aproveitar o seu momento sem sair de casa.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase text-[10px] tracking-widest text-brand italic">Funcionamento</h4>
            <ul className="text-sm text-white/50 space-y-2">
              <li>Seg - Qui: 18h às 02h</li>
              <li>Sex - Sáb: 18h às 05h</li>
              <li>Dom: 14h às 00h</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase text-[10px] tracking-widest text-brand italic">Contato</h4>
            <ul className="text-sm text-white/50 space-y-2">
              <li className="flex items-center gap-2">
                <MessageCircle size={14} className="text-brand" />
                (11) 99999-9999
              </li>
              <li className="flex items-center gap-2">
                <ExternalLink size={14} className="text-brand" />
                @adegavila.delivery
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-white/20 uppercase tracking-[0.2em]">&copy; 2024 ADEGA VILA - TODOS OS DIREITOS RESERVADOS</p>
          <div className="flex gap-6">
             <div className="w-8 h-5 bg-white/5 rounded border border-white/10" />
             <div className="w-8 h-5 bg-white/5 rounded border border-white/10" />
             <div className="w-8 h-5 bg-white/5 rounded border border-white/10" />
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProductForm({ product, onConfirm }: { product: Product, onConfirm: (qty: number, obs: string, opt?: string) => void }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState(product.options ? product.options[0] : undefined);
  const [observation, setObservation] = useState('');

  const currentPrice = useMemo(() => {
    if (selectedOption && product.pricesByOption) {
      return product.pricesByOption[selectedOption];
    }
    return product.price;
  }, [selectedOption, product]);

  return (
    <div className="space-y-10">
      {product.options && (
        <div>
          <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-stone-500 mb-6 italic">// Escolha o tamanho</label>
          <div className="flex flex-wrap gap-4">
            {product.options.map(opt => (
              <button
                key={opt}
                onClick={() => setSelectedOption(opt)}
                className={`px-6 py-4 rounded-none font-black flex flex-col items-start min-w-[140px] transition-all duration-300 border-2 ${
                  selectedOption === opt 
                    ? 'bg-brand text-stone-950 border-brand shadow-[4px_4px_0_0_rgba(245,158,11,0.2)]' 
                    : 'bg-white/5 text-stone-500 border-white/10 hover:border-white/30'
                }`}
              >
                <span className="text-[10px] uppercase tracking-widest mb-1 opacity-70">{opt}</span>
                <span className="font-display font-black text-lg italic">R$ {product.pricesByOption![opt].toFixed(2)}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-stone-500 mb-4 italic">// Observações</label>
        <textarea 
          placeholder="Ex: Tira a cebola, trocar por Skol, etc..."
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
          className="w-full bg-stone-950 border-2 border-border p-5 focus:outline-none focus:border-brand transition-all text-sm font-bold h-32 placeholder:text-stone-800 uppercase tracking-wider"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 pt-6">
        <div className="flex items-center gap-0 bg-stone-950 border-2 border-border w-full sm:w-auto overflow-hidden">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-5 hover:bg-white/5 transition-colors border-r-2 border-border"
          >
            <Minus size={20} />
          </button>
          <span className="font-display font-black text-3xl w-20 text-center italic">{quantity}</span>
          <button 
            onClick={() => setQuantity(quantity + 1)}
            className="p-5 hover:bg-white/5 transition-colors border-l-2 border-border"
          >
            <Plus size={20} />
          </button>
        </div>

        <button 
          onClick={() => onConfirm(quantity, observation, selectedOption)}
          className="flex-1 w-full bg-stone-100 text-stone-950 py-5 font-display font-black text-xl uppercase tracking-tighter flex items-center justify-center gap-3 transition-all hover:bg-brand shadow-[6px_6px_0_0_rgba(255,255,255,0.1)] active:scale-[0.98]"
        >
          <ShoppingCart size={24} />
          Adicionar • R$ {(currentPrice * quantity).toFixed(2)}
        </button>
      </div>
    </div>
  );
}
