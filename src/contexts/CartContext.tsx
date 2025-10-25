"use client";

import { createContext, useContext, useReducer, ReactNode } from "react";

interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  variantIndex?: number;
  variantName?: string;
  specialInstructions?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  isOpen: boolean;
}

type CartAction =
  | {
      type: "ADD_ITEM";
      payload: Omit<CartItem, "quantity"> & { quantity?: number };
    }
  | {
      type: "REMOVE_ITEM";
      payload: { menuItemId: string; variantIndex?: number };
    }
  | {
      type: "UPDATE_QUANTITY";
      payload: { menuItemId: string; variantIndex?: number; quantity: number };
    }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "SET_CART_OPEN"; payload: boolean };

const initialState: CartState = {
  items: [],
  total: 0,
  isOpen: false,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.menuItemId === action.payload.menuItemId &&
          item.variantIndex === action.payload.variantIndex,
      );

      let newItems: CartItem[];

      if (existingItemIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? {
                ...item,
                quantity: item.quantity + (action.payload.quantity || 1),
              }
            : item,
        );
      } else {
        newItems = [
          ...state.items,
          { ...action.payload, quantity: action.payload.quantity || 1 },
        ];
      }

      const total = newItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      return { ...state, items: newItems, total };
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter(
        (item) =>
          !(
            item.menuItemId === action.payload.menuItemId &&
            item.variantIndex === action.payload.variantIndex
          ),
      );
      const total = newItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      return { ...state, items: newItems, total };
    }

    case "UPDATE_QUANTITY": {
      const newItems = state.items
        .map((item) =>
          item.menuItemId === action.payload.menuItemId &&
          item.variantIndex === action.payload.variantIndex
            ? { ...item, quantity: action.payload.quantity }
            : item,
        )
        .filter((item) => item.quantity > 0);

      const total = newItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      return { ...state, items: newItems, total };
    }

    case "CLEAR_CART":
      return { ...state, items: [], total: 0 };

    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };

    case "SET_CART_OPEN":
      return { ...state, isOpen: action.payload };

    default:
      return state;
  }
}

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addToCart: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeFromCart: (menuItemId: string, variantIndex?: number) => void;
  updateQuantity: (
    menuItemId: string,
    variantIndex: number | undefined,
    quantity: number,
  ) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  cartItems: CartItem[];
  cartTotal: number;
  cartCount: number;
} | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (
    item: Omit<CartItem, "quantity"> & { quantity?: number },
  ) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const removeFromCart = (menuItemId: string, variantIndex?: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: { menuItemId, variantIndex } });
  };

  const updateQuantity = (
    menuItemId: string,
    variantIndex: number | undefined,
    quantity: number,
  ) => {
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { menuItemId, variantIndex, quantity },
    });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const toggleCart = () => {
    dispatch({ type: "TOGGLE_CART" });
  };

  const setCartOpen = (open: boolean) => {
    dispatch({ type: "SET_CART_OPEN", payload: open });
  };

  const value = {
    state,
    dispatch,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    setCartOpen,
    cartItems: state.items,
    cartTotal: state.total,
    cartCount: state.items.reduce((count, item) => count + item.quantity, 0),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
