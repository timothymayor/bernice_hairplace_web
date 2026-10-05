import React from 'react';
import { useShop } from '../context/ShopContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, ArrowRight, Lock } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    cartCount,
    cartSubtotal,
    removeFromCart,
    updateQuantity,
    setCurrentView,
    formatPrice,
    openPaystackPayment,
  } = useShop();

  if (!isCartOpen) return null;

  const isFreeDeliveryEligible = cartSubtotal >= 150000;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / 150000) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1A1412]/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FBF9F6] shadow-2xl flex flex-col justify-between border-l border-[#EAE8E5] animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 border-b border-[#EAE8E5] bg-[#F5F3F0] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#725B38]" />
              <h2 className="font-editorial text-xl text-[#1A1412] font-medium">
                Luxury Order Bag ({cartCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-[#807571] hover:text-[#1A1412] rounded hover:bg-[#EAE8E5] transition-colors"
              aria-label="Close Bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lagos Delivery Tier Bar */}
          <div className="bg-[#EFEEEB] px-6 py-3 border-b border-[#EAE8E5]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-[#1A1412]">
                {isFreeDeliveryEligible
                  ? '✨ Complimentary Express Lagos Island Delivery Unlocked'
                  : `Add ${formatPrice(150000 - cartSubtotal)} for Complimentary Lagos Delivery`}
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#E4E2DF] rounded-full overflow-hidden">
              <div
                className="bg-[#725B38] h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="py-16 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#EFEEEB] flex items-center justify-center text-[#807571] mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-editorial text-lg text-[#1A1412] mb-1">Your Bag is Empty</h3>
                <p className="text-xs text-[#807571] max-w-xs mb-6">
                  Explore our curated single-donor raw tresses and handmade Swiss lace closures.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setCurrentView('shop');
                  }}
                  className="px-6 py-3 bg-[#1A1412] hover:bg-[#201A18] text-white text-xs uppercase tracking-wider font-semibold rounded transition-colors"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-white border border-[#EAE8E5] rounded-lg shadow-sm"
                >
                  <img
                    src={item.product.images.main}
                    alt={item.product.name}
                    className="w-20 h-24 rounded object-cover shrink-0 bg-[#EFEEEB]"
                  />
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <span className="text-[10px] uppercase tracking-wider text-[#725B38] font-semibold">
                          {item.product.origin ? 'Raw Temple Donor' : 'Atelier Unit'}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#807571] hover:text-[#BA1A1A] p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4 className="text-xs font-bold text-[#1A1412] truncate mt-0.5">
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] text-[#4E4542]">
                        Length: <strong className="text-[#1A1412]">{item.selectedLength}″</strong> • 100% Raw
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#F5F3F0] mt-1">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#D1C4C0] rounded bg-[#FBF9F6]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-[#EFEEEB] text-[#1A1412] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-[#1A1412]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-[#EFEEEB] text-[#1A1412] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-[#1A1412]">
                        {formatPrice(item.lineTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-6 bg-[#F5F3F0] border-t border-[#EAE8E5] space-y-4">
              <div className="space-y-1.5 text-xs text-[#4E4542]">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-[#1A1412]">{formatPrice(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Lagos Delivery</span>
                  <span className="text-[#725B38] font-bold uppercase">
                    {isFreeDeliveryEligible ? 'Complimentary' : 'Calculated at checkout'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>VAT & Luxury Import Certification</span>
                  <span className="text-[#725B38] font-medium">Included</span>
                </div>
                <div className="pt-2 border-t border-[#E4E2DF] flex justify-between items-baseline">
                  <span className="font-editorial text-base text-[#1A1412] font-semibold">Total Amount</span>
                  <span className="font-editorial text-lg text-[#1A1412] font-bold">
                    {formatPrice(cartSubtotal)}
                  </span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setCurrentView('checkout');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full h-12 bg-[#1A1412] hover:bg-[#201A18] text-white text-xs font-semibold uppercase tracking-widest rounded flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
                >
                  <span>Proceed to Delivery & Checkout</span>
                  <ArrowRight className="w-4 h-4 text-[#C5A880]" />
                </button>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    openPaystackPayment();
                  }}
                  className="w-full h-11 bg-white hover:bg-[#FBF9F6] border border-[#C5A880] text-[#1A1412] text-xs font-bold uppercase tracking-wider rounded flex items-center justify-center gap-2 transition-colors"
                >
                  <Lock className="w-3.5 h-3.5 text-[#725B38]" />
                  <span>Instant Paystack Checkout</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-[#807571] uppercase tracking-wider pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#725B38]" />
                <span>256-Bit SSL Encrypted • Verified Paystack Partner</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
