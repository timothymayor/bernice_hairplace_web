import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  CheckCircle,
  Clock,
  AlertOctagon,
  Truck,
  ArrowRight,
  MessageSquare,
  Printer,
  ShieldCheck,
  RefreshCw,
  RotateCcw,
  ExternalLink,
} from 'lucide-react';

export const PaymentStatusView: React.FC = () => {
  const {
    currentOrder,
    orders,
    formatPrice,
    setCurrentView,
    openPaystackPayment,
    setIsConciergeOpen,
    showToast,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'success' | 'pending' | 'failed'>(() => {
    if (currentOrder?.paymentStatus === 'failed') return 'failed';
    if (currentOrder?.paymentStatus === 'pending') return 'pending';
    return 'success';
  });

  const [isVerifying, setIsVerifying] = useState(false);

  const order = currentOrder || orders[0];

  const handleRefreshVerification = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setActiveTab('success');
      showToast('Payment Verified', 'Paystack confirmed transaction reference.', 'success');
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full bg-[#FBF9F6] min-h-screen">
      <div className="max-w-[1240px] w-full mx-auto px-4 sm:px-10 py-10 lg:py-14">
        {/* Interactive State Preview Tabs */}
        <div className="w-full flex flex-col items-center justify-center mb-10">
          <div className="inline-flex items-center gap-2 p-1.5 bg-[#EFEEEB] rounded-full shadow-sm max-w-full overflow-x-auto border border-[#EAE8E5]">
            <button
              onClick={() => setActiveTab('success')}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'success'
                  ? 'bg-[#1A1412] text-white shadow'
                  : 'text-[#4E4542] hover:text-[#1A1412]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#FEDEB2]"></span>
              <span>Payment Confirmed</span>
            </button>

            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'pending'
                  ? 'bg-[#1A1412] text-white shadow'
                  : 'text-[#4E4542] hover:text-[#1A1412]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#725B38]"></span>
              <span>Pending Verification</span>
            </button>

            <button
              onClick={() => setActiveTab('failed')}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'failed'
                  ? 'bg-[#1A1412] text-white shadow'
                  : 'text-[#4E4542] hover:text-[#1A1412]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#BA1A1A]"></span>
              <span>Payment Failed</span>
            </button>
          </div>
          <p className="text-[10px] uppercase font-bold tracking-widest text-[#807571] mt-2">
            Interactive State Preview • Lagos Studio Order Engine
          </p>
        </div>

        {/* VIEW 1: SUCCESS STATE */}
        {activeTab === 'success' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start animate-in fade-in duration-300">
            {/* Left Column: Confirmation Banner & Logistics */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-[#EAE8E5] relative overflow-hidden">
                <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-[#FEDEB2]/20 blur-3xl pointer-events-none"></div>

                <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#FEDEB2]/50 text-[#78603E] text-[10px] uppercase font-bold tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#725B38]"></span>
                    Paid • Order Confirmed
                  </span>
                  <span className="text-[10px] font-mono tracking-wider text-[#807571] uppercase">
                    REF: {order.paymentReference}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-[#FEDEB2]/60 flex items-center justify-center shrink-0 text-[#725B38]">
                    <CheckCircle className="w-8 h-8 fill-current" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#725B38] font-bold block">
                      Lagos Dispatch Authorization
                    </span>
                    <h1 className="font-editorial text-3xl sm:text-4xl text-[#1A1412] leading-tight font-medium">
                      Payment Successful.<br />
                      <span className="italic font-normal">Thank you, {order.customerName.split(' ')[0]}.</span>
                    </h1>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#4E4542] mb-6 leading-relaxed">
                  Order <strong className="text-[#1A1412] font-bold">#{order.orderNumber}</strong> has been successfully placed with our Victoria Island studio. A bespoke confirmation dossier has been delivered to{' '}
                  <span className="text-[#1A1412] font-medium underline underline-offset-4 decoration-[#C5A880]">
                    {order.customerEmail}
                  </span>.
                </p>

                {/* Fulfillment Notice */}
                <div className="p-4 bg-[#F5F3F0] rounded-lg mb-6 border border-[#EAE8E5]">
                  <div className="flex items-start gap-3">
                    <Truck className="w-5 h-5 text-[#725B38] shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h2 className="text-xs uppercase tracking-wider font-bold text-[#1A1412]">
                          Express Dedicated Courier Fulfillment
                        </h2>
                        <span className="text-[10px] font-bold text-[#725B38] uppercase">
                          Tomorrow • by 3:00 PM
                        </span>
                      </div>
                      <p className="text-xs text-[#807571] mt-1 leading-relaxed">
                        Processing for direct dispatch to <strong className="text-[#1A1412]">{order.shippingAddress.district || 'Lekki Phase 1, Lagos'}</strong>. Dispatched in temperature-controlled protective satin keepsake packaging.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    onClick={() => {
                      setCurrentView('account');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="h-12 px-6 bg-[#1A1412] hover:bg-[#201A18] text-white rounded text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <span>View Order in Account</span>
                    <ArrowRight className="w-4 h-4 text-[#C5A880]" />
                  </button>

                  <button
                    onClick={() => {
                      setCurrentView('shop');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="h-12 px-6 bg-[#EFEEEB] hover:bg-[#EAE8E5] text-[#1A1412] rounded text-xs uppercase tracking-wider font-semibold flex items-center justify-center transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>

              {/* Concierge Standby */}
              <div className="p-4 bg-white rounded-xl flex items-center justify-between flex-wrap gap-4 shadow-sm border border-[#EAE8E5]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#F5F3F0] flex items-center justify-center text-[#1A1412]">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider font-bold text-[#1A1412]">
                      Dedicated Concierge Assistance
                    </p>
                    <p className="text-xs text-[#807571]">
                      Lagos Island & Mainland studio coordinators on standby
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsConciergeOpen(true)}
                  className="text-xs font-bold text-[#725B38] hover:text-[#1A1412] flex items-center gap-1 transition-colors"
                >
                  <span>Chat on WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Column: Order Curations Summary */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-[#EAE8E5]">
                <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#EAE8E5]">
                  <h2 className="font-editorial text-2xl text-[#1A1412] font-medium">Order Curations</h2>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#807571]">
                    {order.items.length} Units
                  </span>
                </div>

                {/* Items */}
                <div className="flex flex-col gap-4 mb-6">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-3.5 items-center p-3 bg-[#F5F3F0] rounded-lg">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-16 h-20 rounded object-cover shrink-0 bg-white"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-[#725B38] block">
                          {item.categoryLabel}
                        </span>
                        <h3 className="font-editorial text-sm text-[#1A1412] font-bold truncate">
                          {item.productName}
                        </h3>
                        <p className="text-[11px] text-[#807571] mt-0.5">
                          Length: {item.selectedLength}″ • Qty: {item.quantity}
                        </p>
                        <p className="text-xs font-bold text-[#1A1412] mt-1">
                          {formatPrice(item.lineTotal)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Costs Breakdown */}
                <div className="space-y-2 text-xs text-[#4E4542] pt-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#1A1412]">{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lagos Express Dedicated Courier</span>
                    <span className="text-[#725B38] font-bold uppercase text-[10px]">Complimentary</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Paystack Gateway Processing</span>
                    <span className="text-[#807571]">₦0</span>
                  </div>

                  <div className="pt-3 border-t border-[#E4E2DF] flex justify-between items-baseline">
                    <div>
                      <span className="font-editorial text-base text-[#1A1412] font-bold block">
                        Total Paid
                      </span>
                      <span className="text-[10px] text-[#807571] uppercase">Settled in NGN via Card</span>
                    </div>
                    <span className="font-editorial text-2xl text-[#1A1412] font-bold">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-3 bg-[#EFEEEB] p-3 rounded text-[11px] text-[#4E4542] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#725B38] shrink-0" />
                  <span>Verified by Paystack • 100% Raw Human Hair Guarantee</span>
                </div>
              </div>

              {/* Tax Invoice Banner */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-[#EAE8E5] flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-[#725B38]">
                    Need A Printed Copy?
                  </p>
                  <h3 className="font-editorial text-base text-[#1A1412] font-medium">
                    Official Tax Invoice & Certificate
                  </h3>
                </div>
                <button
                  onClick={() => window.print()}
                  className="h-10 px-4 bg-[#EFEEEB] hover:bg-[#EAE8E5] text-[#1A1412] rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Invoice</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: PENDING VERIFICATION STATE */}
        {activeTab === 'pending' && (
          <div className="max-w-2xl mx-auto bg-white p-8 sm:p-12 rounded-xl shadow-sm text-center relative overflow-hidden border border-[#EAE8E5] animate-in fade-in duration-300">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-[#FEDEB2]/50 flex items-center justify-center text-[#725B38]">
                <Clock className="w-8 h-8 animate-spin-slow text-[#725B38]" />
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEDEB2]/60 text-[#78603E] text-[10px] font-bold uppercase tracking-wider mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#725B38] animate-pulse"></span>
              Awaiting Network Confirmation
            </span>

            <h1 className="font-editorial text-3xl sm:text-4xl text-[#1A1412] mb-2 font-medium">
              Verifying Your Payment
            </h1>

            <p className="text-xs sm:text-sm text-[#4E4542] max-w-lg mx-auto mb-6 leading-relaxed">
              We are currently confirming your transaction with <strong className="text-[#1A1412]">Paystack</strong>. Please hold on — this typically takes 10 to 45 seconds depending on Nigerian interbank switches.
            </p>

            <div className="bg-[#F5F3F0] p-4 rounded-lg text-left max-w-md mx-auto mb-8 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#807571]">Draft Reference:</span>
                <span className="font-mono text-[#1A1412] font-bold">{order.paymentReference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#807571]">Order Total:</span>
                <span className="font-bold text-[#1A1412]">{formatPrice(order.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#807571]">Payment Channel:</span>
                <span className="text-[#1A1412]">NIBSS / Instant Bank Transfer</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleRefreshVerification}
                disabled={isVerifying}
                className="w-full sm:w-auto h-12 px-8 bg-[#1A1412] hover:bg-[#201A18] text-white rounded text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#C5A880]" />
                    <span>Verifying with Paystack...</span>
                  </>
                ) : (
                  <>
                    <span>Refresh Payment Status</span>
                    <RefreshCw className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                onClick={() => setIsConciergeOpen(true)}
                className="w-full sm:w-auto h-12 px-8 bg-[#EFEEEB] hover:bg-[#EAE8E5] text-[#1A1412] rounded text-xs font-semibold uppercase tracking-wider flex items-center justify-center transition-colors"
              >
                WhatsApp Support
              </button>
            </div>
          </div>
        )}

        {/* VIEW 3: PAYMENT FAILED STATE */}
        {activeTab === 'failed' && (
          <div className="max-w-2xl mx-auto bg-white p-8 sm:p-12 rounded-xl shadow-sm text-center relative overflow-hidden border border-[#EAE8E5] animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-[#FFDAD6] text-[#BA1A1A] flex items-center justify-center mx-auto mb-4">
              <AlertOctagon className="w-8 h-8" />
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFDAD6] text-[#93000A] text-[10px] font-bold uppercase tracking-wider mb-2">
              Payment Incomplete
            </span>

            <h1 className="font-editorial text-3xl sm:text-4xl text-[#1A1412] mb-2 font-medium">
              Payment Could Not Be Completed
            </h1>

            <p className="text-xs sm:text-sm text-[#4E4542] max-w-lg mx-auto mb-6 leading-relaxed">
              Your card or bank declined this transaction. No funds were debited, and order <strong className="text-[#1A1412]">#{order.orderNumber}</strong> has been temporarily held for you so you don’t lose your reserved raw bundle selection.
            </p>

            <div className="p-4 bg-[#F5F3F0] rounded-lg text-left max-w-md mx-auto mb-8 border border-[#EAE8E5]">
              <p className="text-xs font-bold text-[#1A1412]">Declined by Card Issuer (Bank Code 51)</p>
              <p className="text-xs text-[#807571] mt-1 leading-relaxed">
                Common reasons include daily web spend limits, temporary bank switch outages, or 3D Secure OTP timeouts.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => openPaystackPayment(order)}
                className="w-full sm:w-auto h-12 px-8 bg-[#1A1412] hover:bg-[#201A18] text-white rounded text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>Try Payment Again</span>
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsConciergeOpen(true)}
                className="w-full sm:w-auto h-12 px-8 bg-[#EFEEEB] hover:bg-[#EAE8E5] text-[#1A1412] rounded text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Pay via Direct Transfer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
