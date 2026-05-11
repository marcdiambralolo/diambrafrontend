'use client';
import { AnimatePresence, motion,Variants  } from 'framer-motion';
import { ChevronRight, CreditCard, Plus, ShoppingCart, X } from 'lucide-react';
import React from 'react';
import { Offering } from '@/lib/interfaces';
import NextImage from '@/components/commons/NextImage';

interface CartModalTotalActionsProps {
    cartTotal: number;
    onProceedToCheckout: () => void;
    onClearCart: () => void;
}

const CartModalTotalActions: React.FC<CartModalTotalActionsProps> = ({ cartTotal, onProceedToCheckout, onClearCart }) => (
    <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-4 mb-4">
        <div className="flex items-center justify-between mb-6">
            <span className="text-xl sm:text-2xl font-black text-white dark:text-white">Total</span>
            <div className="text-right">
                <p className="text-2xl sm:text-3xl font-black text-white dark:text-white">
                    {cartTotal.toLocaleString()} F
                </p>                
                <p className="text-xs sm:text-sm text-white dark:text-gray-400">
                    ≈ ${(cartTotal / 563.5).toFixed(2)} USD
                </p>
            </div>
        </div>
        
        <div className="space-y-2">
            <button
                onClick={onProceedToCheckout}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-4 rounded-xl font-black text-base sm:text-lg shadow-xl hover:shadow-2xl active:scale-98 transition-all flex items-center justify-center gap-3"
            >
                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
                Procéder au paiement
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
                onClick={onClearCart}
                className="w-full py-3 text-red-600 font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl active:scale-95 transition-all"
            >
                Vider le panier
            </button>
        </div>
    </div>
);

export interface CartItem extends Offering {
    _id: string;
    quantity: number;
}

interface CartModalItemProps {
    item: CartItem;
    onUpdateQuantity: (id: string, delta: number) => void;
    onRemoveFromCart: (id: string) => void;
}

const CartModalItem: React.FC<CartModalItemProps> = ({ item, onUpdateQuantity, onRemoveFromCart }) => {
    const itemId = item._id || item.id;
    return (
        <div
            className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
        >
                          <span className="text-gray-300 dark:text-gray-600 text-5xl sm:text-6xl">🖼️</span>
 

            <div className="flex-grow min-w-0">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base truncate">{item.name}</h3>
                <p className="text-xs sm:text-sm text-black dark:text-gray-400">
                    {item.price.toLocaleString()} F × {item.quantity}
                </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
                <button
                    onClick={() => onUpdateQuantity(itemId, -1)}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:border-amber-500 active:scale-90 flex items-center justify-center transition-all"
                >
                    <Plus className="w-4 h-4 rotate-45" />
                </button>
                <span className="font-bold text-base sm:text-lg w-6 sm:w-8 text-center text-gray-900 dark:text-white">{item.quantity}</span>
                <button
                    onClick={() => onUpdateQuantity(itemId, 1)}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:border-amber-500 active:scale-90 flex items-center justify-center transition-all"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>
            <button
                onClick={() => onRemoveFromCart(itemId)}
                className="text-red-500 hover:text-red-700 active:scale-90 transition-all p-2"
            >
                <X className="w-5 h-5" />
            </button>
        </div>
    );
};

interface CartModalEmptyProps {
    onClose: () => void;
}

const CartModalEmpty: React.FC<CartModalEmptyProps> = ({ onClose }) => (
    <div className="text-center py-12">
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#2E5AA6] to-[#0F1C3F] rounded-full flex items-center justify-center shadow-lg">
            <ShoppingCart className="w-10 h-10 text-[#4F83D1]" />
        </div>
        <p className="text-[#D1D5DB] text-lg font-medium mb-6">Votre panier est vide</p>
        <button
            onClick={onClose}
            className="px-6 py-3 bg-[#2E5AA6] text-white rounded-xl font-bold hover:bg-[#4F83D1] active:scale-95 transition-all shadow"
        >
            Continuer mes achats
        </button>
    </div>
);

interface CartModalHeaderProps {
    cartCount: number;
    cartTotal: number;
    onClose: () => void;
}

const CartModalHeader: React.FC<CartModalHeaderProps> = ({ cartCount, cartTotal, onClose }) => (
    <div className="sticky top-0 bg-gradient-to-r from-[#0F1C3F] to-[#162A56] z-10 p-4 sm:p-6 border-b border-[#2E5AA6] rounded-t-3xl shadow-md">
        <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl sm:text-2xl font-black text-[#4F83D1] flex items-center gap-2 drop-shadow">
                <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7" />
                Mon Panier
            </h2>
            <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-[#2E5AA6] hover:bg-[#4F83D1] active:scale-90 flex items-center justify-center transition-all shadow"
            >
                <X className="w-6 h-6 text-white" />
            </button>
        </div>
        {cartCount > 0 && (
            <p className="text-sm text-[#E5E7EB]">
                {cartCount} article{cartCount > 1 ? 's' : ''} · {cartTotal.toLocaleString()} F
            </p>
        )}
    </div>
);

interface CartModalProps {
    showCart: boolean;
    cart: CartItem[];
    cartTotal: number;
    cartCount: number;
    onClose: () => void;
    onProceedToCheckout: () => void;
    onUpdateQuantity: (id: string, delta: number) => void;
    onRemoveFromCart: (id: string) => void;
    onClearCart: () => void;
}

export const slideFromBottom: Variants = {
    hidden: { y: '100%', opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 300 } },
    exit: { y: '100%', opacity: 0, transition: { duration: 0.2 } }
};

export const CartModal: React.FC<CartModalProps> = ({
    showCart,
    cart,
    cartTotal,
    cartCount,
    onClose,
    onProceedToCheckout,
    onUpdateQuantity,
    onRemoveFromCart,
    onClearCart
}) => {
    
    return (
        <AnimatePresence>
            {showCart && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 white/80 z-50 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        variants={slideFromBottom}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                        className="fixed bottom-0 left-0 right-0 bg-gradient-to-b from-[#162A56] to-[#070B1A] rounded-t-3xl z-50 max-h-[90vh] overflow-y-auto shadow-2xl border-t-2 border-[#2E5AA6]"
                    >
                        <CartModalHeader cartCount={cartCount} cartTotal={cartTotal} onClose={onClose} />
                        <div className="p-4 sm:p-6">
                            {cart.length === 0 ? (
                                <CartModalEmpty onClose={onClose} />
                            ) : (
                                <>
                                    <div className="space-y-3 mb-6">
                                        {cart.map((item) => (
                                            <CartModalItem
                                                key={item._id || item.id}
                                                item={item}
                                                onUpdateQuantity={onUpdateQuantity}
                                                onRemoveFromCart={onRemoveFromCart}
                                            />
                                        ))}
                                    </div>

                                    <CartModalTotalActions
                                        cartTotal={cartTotal}
                                        onProceedToCheckout={onProceedToCheckout}
                                        onClearCart={onClearCart}
                                    />
                                </>
                            )}
                        </div>
                    </motion.div>
                </>
            )}

        </AnimatePresence>
    );
};