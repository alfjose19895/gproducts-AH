import React, { createContext, useContext, useState, useEffect } from 'react';

// Definición de la estructura de un item en el carrito
interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    stock: number; // Guardamos el stock total para validar límites
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: any) => void;
    removeFromCart: (id: number) => void;
    clearCart: () => void;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Intentar cargar el carrito desde localStorage al iniciar
    const [cart, setCart] = useState<CartItem[]>(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Guardar en localStorage cada vez que el carrito cambie
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: any) => {
        setCart(prev => {
            const existingItem = prev.find(item => item.id === product.id);
            const currentQty = existingItem ? existingItem.quantity : 0;

            // 1. Validar Stock disponible
            // Usamos product.stock (si viene de la API) o item.stock (si ya está en el carrito)
            const totalStockAvailable = Number(product.stock);

            if (currentQty + 1 > totalStockAvailable) {
                alert(`¡Lo sentimos! Solo hay ${totalStockAvailable} unidades disponibles de ${product.name}.`);
                return prev;
            }

            // 2. Normalizar valores para evitar NaN
            const safePrice = parseFloat(String(product.price)) || 0;

            if (existingItem) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            // 3. Agregar nuevo producto con cantidad inicial 1
            return [...prev, {
                id: Number(product.id),
                name: product.name,
                price: safePrice,
                quantity: 1,
                stock: totalStockAvailable
            }];
        });
    };

    const removeFromCart = (id: number) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('cart');
    };

    // Contador total de productos para el badge del menú
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart debe usarse dentro de un CartProvider');
    }
    return context;
};