'use client';

import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { ProductType, getStrapiMediaUrl } from '../lib/storeapi';

export type CartItemType = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  heliumDeployVariantId: string;
  inStock: boolean;
  slug?: string;
};

type CartContextType = {
  items: CartItemType[];
  addToCart: (product: ProductType, quantity: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemsCount: () => number;
  getCheckoutUrl: () => string;
};

// Define actions for reducer
type CartAction = 
  | { type: 'ADD_ITEM'; payload: { product: ProductType; quantity: number; transactionId: string } }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'INITIALIZE_CART'; payload: { items: CartItemType[] } };

// Reducer function
const cartReducer = (state: CartItemType[], action: CartAction): CartItemType[] => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity, transactionId } = action.payload;
      const productId = String(product.id);
      const existingItemIndex = state.findIndex(item => item.id === productId);
      
      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        const newState = [...state];
        newState[existingItemIndex] = {
          ...newState[existingItemIndex],
          quantity: newState[existingItemIndex].quantity + quantity
        };
        return newState;
      } else {
        // Item doesn't exist, add it
        const attributes = product.attributes;
        let imageUrl = '/placeholder.png';
        try {
          if (attributes.mainImage?.data?.attributes?.url) {
            imageUrl = getStrapiMediaUrl(attributes.mainImage.data.attributes.url);
          }
        } catch (error) {
          console.error('Error getting image URL:', error);
        }
        
        const newItem: CartItemType = {
          id: productId,
          name: attributes.name || 'Product',
          price: attributes.price || 0,
          image: imageUrl,
          quantity,
          heliumDeployVariantId: attributes.heliumDeployVariantId || '',
          inStock: Boolean(attributes.inStock),
          slug: attributes.slug || productId
        };
        
        return [...state, newItem];
      }
    }
    case 'REMOVE_ITEM':
      return state.filter(item => item.id !== action.payload.id);
    
    case 'UPDATE_QUANTITY':
      return state.map(item => 
        item.id === action.payload.id 
          ? { ...item, quantity: action.payload.quantity } 
          : item
      );
    
    case 'CLEAR_CART':
      return [];
    
    case 'INITIALIZE_CART':
      return action.payload.items;
    
    default:
      return state;
  }
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, dispatch] = useReducer(cartReducer, []);
  const [isInitialized, setIsInitialized] = React.useState(false);
  
  // Track processed transactions to prevent duplicates
  const processedTransactions = useRef<Set<string>>(new Set());
  
  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cryptohub-cart');
      if (savedCart) {
        dispatch({ 
          type: 'INITIALIZE_CART', 
          payload: { items: JSON.parse(savedCart) } 
        });
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('cryptohub-cart', JSON.stringify(items));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [items, isInitialized]);

  // Fixed addToCart with transaction ID to prevent duplicate operations
  // Fixed addToCart with transaction ID to prevent duplicate operations
const addToCart = (product: ProductType, quantity: number) => {
  if (quantity <= 0) return;
  
  // Fix: Ensure product.id is always a string
  const productId = product && product.id ? String(product.id) : 'unknown';
  // Generate a unique transaction ID for this operation
  const transactionId = `${productId}-${Date.now()}`;
  
  // If we've already processed this transaction, skip it
  if (processedTransactions.current.has(transactionId)) {
    console.log('Transaction already processed, skipping', transactionId);
    return;
  }
  
  // Mark this transaction as processed
  processedTransactions.current.add(transactionId);
  
  // Limit the size of the processed transactions set
  if (processedTransactions.current.size > 100) {
    const iterator = processedTransactions.current.values();
    const nextValue = iterator.next().value;
    if (nextValue !== undefined) {
      processedTransactions.current.delete(nextValue);
    }
  }
  
  try {
    dispatch({ 
      type: 'ADD_ITEM', 
      payload: { product, quantity, transactionId } 
    });
  } catch (err) {
    console.error('Error in addToCart:', err);
    // Remove from processed transactions in case of error
    processedTransactions.current.delete(transactionId);
  }
};

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    // Clear processed transactions when clearing cart
    processedTransactions.current.clear();
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const getItemsCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  const getCheckoutUrl = () => {
    if (items.length === 0) return '';
    
    let url = 'https://heliumdeploy.com/cart/';
    
    const variantParams = items
      .filter(item => item.heliumDeployVariantId) 
      .map(item => `${item.heliumDeployVariantId}:${item.quantity}`)
      .join(',');
      
    if (variantParams) {
      url += variantParams;
    }
    
    url += '?';
    url += 'ref=7183307.eclsMYrIgl';
    
    const hasSingleItemOver500 = items.some(item => (item.price * item.quantity) >= 500);
    
    if (hasSingleItemOver500) {
      url += '&discount=BlockchainBay50';
    } else {
      url += '&discount=BlockchainBay';
    }
    
    url += '&return_to=' + encodeURIComponent(window.location.origin + '/order-complete');
    
    return url;
  };

  return (
    <CartContext.Provider value={{ 
      items, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      getCartTotal,
      getItemsCount,
      getCheckoutUrl
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};