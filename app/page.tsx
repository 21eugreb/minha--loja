"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  title: string;
  description: string;
  handle: string;
  images: {
    edges: {
      node: {
        url: string;
      };
    }[];
  };
};

type CartContextType = {
  cartItems: Product[];
  addToCart: (product: Product) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);
const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart deve ser usado dentro do CartProvider");
  return context;
};

function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const addToCart = (product: Product) => setCartItems((prev) => [...prev, product]);
  return <CartContext.Provider value={{ cartItems, addToCart }}>{children}</CartContext.Provider>;
}

function CartIcon() {
  const { cartItems } = useCart();
  return (
    <div className="relative">
      <ShoppingCart className="w-6 h-6" />
      {cartItems.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
          {cartItems.length}
        </span>
      )}
    </div>
  );
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch("https://barbaflash.shop/api/2023-10/graphql.json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": "d120cd08b1d081a7c29307fc23f6bff7",
        },
        body: JSON.stringify({
          query: `{
            products(first: 6) {
              edges {
                node {
                  id
                  title
                  description
                  handle
                  images(first: 1) {
                    edges {
                      node {
                        url
                      }
                    }
                  }
                }
              }
            }
          }`
        })
      });
      const json = await res.json();
      const items = json.data.products.edges.map((edge: any) => edge.node);
      setProducts(items);
    }

    fetchProducts();
  }, []);

  return (
    <CartProvider>
      <div className="bg-white text-black min-h-screen flex flex-col">
        <header className="bg-[#ff7300] text-white p-4 shadow-md">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <h1 className="text-2xl font-bold">Minha Loja</h1>
            <div className="flex flex-col sm:flex-row gap-4 items-center w-full md:w-auto">
              <div className="flex gap-2 w-full sm:w-auto">
                <Input placeholder="Buscar produtos..." className="w-full sm:w-64" />
                <Button variant="secondary" className="whitespace-nowrap">
                  <Search className="w-4 h-4 mr-2" /> Buscar
                </Button>
              </div>
              <CartIcon />
            </div>
          </div>
        </header>

        <section className="bg-[#ff7300] text-white text-center py-16 px-4">
          <h2 className="text-4xl font-bold mb-4">Bem-vindo à nossa loja!</h2>
          <p className="text-lg">Os melhores produtos para você colecionar e se divertir.</p>
        </section>

        <main className="flex-1 max-w-7xl mx-auto py-10 px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </main>

        <footer className="bg-gray-100 text-center py-6 mt-10 text-sm text-gray-600">
          © {new Date().getFullYear()} Minha Loja. Todos os direitos reservados.
        </footer>
      </div>
    </CartProvider>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const router = useRouter();
  const imageUrl = product.images?.edges[0]?.node?.url || "https://via.placeholder.com/300x200";

  return (
    <motion.div whileHover={{ scale: 1.03 }} className="transition-all">
      <Card className="rounded-2xl shadow-md overflow-hidden flex flex-col">
        <CardContent className="p-4 flex-1 flex flex-col">
          <img src={imageUrl} alt={product.title} className="h-48 w-full object-cover mb-4 rounded-lg" />
          <h3 className="text-xl font-semibold mb-1 line-clamp-1">{product.title}</h3>
          <p className="text-gray-600 text-sm flex-1 mb-4 line-clamp-3">{product.description}</p>
          <div className="flex gap-2 mt-auto">
            <Button className="w-full bg-[#ff7300] hover:bg-orange-600" onClick={() => router.push(`/produto/${product.handle}`)}>
              Ver detalhes
            </Button>
            <Button variant="outline" className="w-full" onClick={() => addToCart(product)}>
              Adicionar
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
