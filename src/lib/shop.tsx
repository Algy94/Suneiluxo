import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Category = "Cabelos" | "Joias" | "Combos";

export type Product = {
  id: number;
  name: string;
  category: Category;
  price: number;
  oldPrice?: number;
  rating: number;
  stock: number;
  image: string;
  tag?: string;
};

export type CartItem = Product & { qty: number };

export type Order = {
  id: string;
  total: number;
  items: CartItem[];
  createdAt: string;
};

export const products: Product[] = [
  {
    id: 1,
    name: "Cabelo Humano Cacheado 18”",
    category: "Cabelos",
    price: 2850,
    oldPrice: 3200,
    rating: 4.9,
    stock: 8,
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80",
    tag: "Mais vendido",
  },
  {
    id: 2,
    name: "Cabelo Humano Liso 20”",
    category: "Cabelos",
    price: 3150,
    rating: 4.8,
    stock: 6,
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
    tag: "Novo",
  },
  {
    id: 3,
    name: "Peruca Cacheada Premium",
    category: "Cabelos",
    price: 3990,
    oldPrice: 4500,
    rating: 4.9,
    stock: 4,
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
    tag: "Oferta",
  },
  {
    id: 4,
    name: "Brincos Dourados Elegance",
    category: "Joias",
    price: 650,
    rating: 4.7,
    stock: 20,
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    name: "Colar Dourado Aurora",
    category: "Joias",
    price: 790,
    rating: 4.8,
    stock: 15,
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 6,
    name: "Conjunto Joias Royal",
    category: "Joias",
    price: 1190,
    oldPrice: 1450,
    rating: 4.9,
    stock: 10,
    image:
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=900&q=80",
    tag: "Novo",
  },
  {
    id: 7,
    name: "Combo Glam — Cabelo + Brincos",
    category: "Combos",
    price: 3350,
    oldPrice: 3700,
    rating: 4.9,
    stock: 5,
    image:
      "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=900&q=80",
    tag: "Combo",
  },
  {
    id: 8,
    name: "Combo Luxo — Cabelo + Joias",
    category: "Combos",
    price: 4450,
    oldPrice: 5000,
    rating: 5,
    stock: 3,
    image:
      "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&w=900&q=80",
    tag: "Oferta",
  },
];

export const money = (n: number) =>
  new Intl.NumberFormat("pt-MZ", {
    style: "currency",
    currency: "MZN",
    maximumFractionDigits: 0,
  })
    .format(n)
    .replace("MZN", "MT");

type ShopContextValue = {
  cart: CartItem[];
  favorites: number[];
  count: number;
  total: number;
  notice: string;
  lastOrder: Order | null;
  add: (p: Product) => void;
  setQty: (id: number, qty: number) => void;
  remove: (id: number) => void;
  toggleFavorite: (id: number) => void;
  checkout: () => Order | null;
};

const ShopContext = createContext<ShopContextValue | null>(null);

const ORDER_KEY = "suneiluxo_last_order";

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [notice, setNotice] = useState("");
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(ORDER_KEY);
    if (raw) {
      try {
        setLastOrder(JSON.parse(raw) as Order);
      } catch {
        /* ignore malformed */
      }
    }
  }, []);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(""), 2200);
    return () => clearTimeout(t);
  }, [notice]);

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);

  const value = useMemo<ShopContextValue>(
    () => ({
      cart,
      favorites,
      count,
      total,
      notice,
      lastOrder,
      add: (p) => {
        setCart((c) => {
          const existing = c.find((i) => i.id === p.id);
          return existing
            ? c.map((i) => (i.id === p.id ? { ...i, qty: Math.min(i.qty + 1, p.stock) } : i))
            : [...c, { ...p, qty: 1 }];
        });
        setNotice("Produto adicionado ao carrinho");
      },
      setQty: (id, qty) =>
        setCart((c) =>
          c.map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(qty, i.stock)) } : i)),
        ),
      remove: (id) => setCart((c) => c.filter((i) => i.id !== id)),
      toggleFavorite: (id) =>
        setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id])),
      checkout: () => {
        if (!cart.length) return null;
        const order: Order = {
          id: "SL-" + Math.floor(1000 + Math.random() * 9000),
          total,
          items: cart,
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem(ORDER_KEY, JSON.stringify(order));
        setLastOrder(order);
        setCart([]);
        setNotice(`Pedido ${order.id} criado com sucesso.`);
        return order;
      },
    }),
    [cart, favorites, count, total, notice, lastOrder],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used inside ShopProvider");
  return ctx;
}
