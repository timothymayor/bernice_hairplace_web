import React from 'react';
import { useShop } from '../context/ShopContext';
import { Order } from '../types';
import { Package, ArrowRight, MessageSquare, Ruler, LogOut, RefreshCw } from 'lucide-react';
import { GoogleSignInButton } from '../components/GoogleSignInButton';

const STATUS_LABELS: Record<Order['paymentStatus'], { label: string; className: string }> = {
  success: { label: 'Paid • Processing', className: 'bg-[#FEDEB2]/60 text-[#78603E]' },
  pending: { label: 'Awaiting Confirmation', className: 'bg-[#EFEEEB] text-[#4E4542]' },
  initialized: { label: 'Awaiting Payment', className: 'bg-[#EFEEEB] text-[#4E4542]' },
  failed: { label: 'Payment Failed', className: 'bg-[#FFDAD6] text-[#93000A]' },
  reversed: { label: 'Payment Reversed', className: 'bg-[#FFDAD6] text-[#93000A]' },
};

export const OrdersView: React.FC = () => {
  const {
    orders,
    ordersLoading,
    formatPrice,
    setCurrentView,
    setCurrentOrder,
    setIsConciergeOpen,
    setIsCustomOrderModalOpen,
    user,
    authReady,
    signOut,
  } = useShop();

  const openOrder = (order: Order) => {
    setCurrentOrder(order);
    setCurrentView('payment-status');
  };

  if (!authReady) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center text-sm text-[#807571]">
        <RefreshCw className="w-6 h-6 text-[#C5A880] animate-spin mx-auto mb-3" />
        Loading your account…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <span className="text-[10px] uppercase tracking-widest font-bold text-[#725B38]">Your Account</span>
        <h2 className="font-editorial text-3xl text-[#1A1412] mt-1 mb-2">Sign in to see your orders</h2>
        <p className="text-sm text-[#807571] mb-8">
          Track your orders, keep your bag and wishlist in sync across devices, and check out faster.
        </p>
        <GoogleSignInButton returnPath="/orders" className="w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full bg-[#FBF9F6] min-h-screen">
      <div className="max-w-[1040px] w-full mx-auto px-4 sm:px-10 py-10 lg:py-14">
        <section className="rounded-2xl bg-[#F5F3F0] p-6 md:p-10 mb-8 shadow-sm border border-[#EAE8E5]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#725B38]">{user.email}</span>
              <h1 className="font-editorial text-3xl sm:text-4xl text-[#1A1412] tracking-tight font-medium mt-1">
                Welcome, {user.fullName.split(' ')[0]}
              </h1>
              <p className="text-xs sm:text-sm text-[#4E4542] mt-2 max-w-xl">
                Your orders are listed below. For delivery updates or changes, message our studio on WhatsApp with your
                order number.
              </p>
            </div>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#4E4542] hover:text-[#1A1412] px-3 py-2 rounded hover:bg-[#EFEEEB] transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign out</span>
            </button>
          </div>
          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={() => setIsConciergeOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded bg-[#1A1412] hover:bg-[#201A18] text-white text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-[#C5A880]" />
              <span>WhatsApp the Studio</span>
            </button>
            <button
              onClick={() => setIsCustomOrderModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded bg-white border border-[#D1C4C0] hover:bg-[#EFEEEB] text-[#1A1412] text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              <Ruler className="w-4 h-4 text-[#725B38]" />
              <span>Custom Wig Request</span>
            </button>
          </div>
        </section>

        {ordersLoading && orders.length === 0 ? (
          <div className="py-16 text-center text-sm text-[#807571]">
            <RefreshCw className="w-6 h-6 text-[#C5A880] animate-spin mx-auto mb-3" />
            Loading your orders…
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#EAE8E5] p-10 text-center">
            <Package className="w-10 h-10 text-[#C5A880] mx-auto mb-3" />
            <h2 className="font-editorial text-2xl text-[#1A1412] mb-1">No orders yet</h2>
            <p className="text-xs text-[#807571] mb-6">When you check out, your order will appear here.</p>
            <button
              onClick={() => setCurrentView('shop')}
              className="px-6 py-3 bg-[#1A1412] hover:bg-[#201A18] text-white text-xs uppercase font-bold tracking-wider rounded"
            >
              Shop the Collection
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => {
              const status = STATUS_LABELS[order.paymentStatus];
              return (
                <button
                  key={order.id}
                  onClick={() => openOrder(order)}
                  className="text-left bg-white rounded-xl border border-[#EAE8E5] hover:border-[#C5A880] p-5 sm:p-6 shadow-sm transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <div>
                      <p className="text-xs font-bold text-[#1A1412]">#{order.orderNumber}</p>
                      <p className="text-[11px] text-[#807571]">{order.date}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${status.className}`}>
                      {status.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {order.items.map((item, idx) => (
                      <img
                        key={idx}
                        src={item.image}
                        alt={item.productName}
                        className="w-14 h-16 rounded object-cover bg-[#F5F3F0] shrink-0"
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#F5F3F0]">
                    <span className="text-xs text-[#4E4542]">
                      {order.items.reduce((n, i) => n + i.quantity, 0)} item(s) •{' '}
                      <strong className="text-[#1A1412]">{formatPrice(order.total)}</strong>
                    </span>
                    <span className="text-xs font-bold text-[#725B38] flex items-center gap-1">
                      View details <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
