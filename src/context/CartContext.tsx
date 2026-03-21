import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

interface CartItem {
    id: string | number;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: any) => void;
    removeFromCart: (id: string | number) => void;
    updateQuantity: (id: string | number, delta: number) => void;
    clearCart: () => void;
    isCartOpen: boolean;
    setCartOpen: (open: boolean) => void;
    cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartOpen, setCartOpen] = useState(false);
    const userId = user?.id || user?._id || 'guest';
    const isFirstRun = useRef(true);

    // Initial Load: When user changes, load their specific cart
    useEffect(() => {
        const saved = localStorage.getItem(`cart_${userId}`);
        if (saved) {
            try {
                setCartItems(JSON.parse(saved));
            } catch {
                setCartItems([]);
            }
        } else {
            setCartItems([]);
        }
        isFirstRun.current = true; // Reset first run so we don't immediately save back during load
    }, [userId]);

    // Save Change: Persist cart to localStorage whenever it changes
    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }
        localStorage.setItem(`cart_${userId}`, JSON.stringify(cartItems));
    }, [cartItems, userId]);

    const addToCart = (item: any) => {
        setCartItems(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1, imageUrl: item.imageUrl }];
        });
        setCartOpen(true);
    };

    const removeFromCart = (id: string | number) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id: string | number, delta: number) => {
        setCartItems(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem(`cart_${userId}`);
    };

    const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ 
            cartItems, addToCart, removeFromCart, updateQuantity, clearCart, 
            isCartOpen, setCartOpen, cartTotal 
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};
