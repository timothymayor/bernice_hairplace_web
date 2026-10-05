import React, { useEffect, useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Lock, RefreshCw, CheckCircle, AlertTriangle, ShieldCheck, X } from 'lucide-react';

export const PaystackModal: React.FC = () => {
  const {
    isPaystackModalOpen,
    closePaystackPayment,
    currentOrder,
    orderTotal,
    formatPrice,
    simulatePaystackSuccess,
    simulatePaystackFailure,
  } = useShop();

  const [simulatedProgress, setSimulatedProgress] = useState(20);
  const [selectedChannel, setSelectedChannel] = useState<'card' | 'bank' | 'ussd'>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isPaystackModalOpen) {
      setSimulatedProgress(25);
      setIsProcessing(false);
      interval = setInterval(() => {
        setSimulatedProgress((prev) => (prev < 85 ? prev + 15 : prev));
      }, 400);
    }
    return () => clearInterval(interval);
  }, [isPaystackModalOpen]);

  if (!isPaystackModalOpen) return null;

  const displayAmount = currentOrder ? formatPrice(currentOrder.total) : formatPrice(orderTotal);
  const refCode = currentOrder?.paymentReference || `pstk_ref_${Math.floor(1000000000 + Math.random() * 9000000000)}`;

  const handlePayNow = () => {
    setIsProcessing(true);
    setSimulatedProgress(100);
    setTimeout(() => {
      simulatePaystackSuccess();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1A1412]/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white max-w-lg w-full rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center relative overflow-hidden border border-[#EAE8E5]">
        {/* Close Button */}
        <button
          onClick={closePaystackPayment}
          className="absolute top-4 right-4 text-[#807571] hover:text-[#1A1412] p-1.5 rounded-full hover:bg-[#F5F3F0] transition-colors"
          aria-label="Cancel"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Animated Handshake Icon */}
        <div className="w-16 h-16 rounded-full bg-[#FEDEB2]/60 flex items-center justify-center mb-4 relative shadow-sm">
          <RefreshCw className={`w-8 h-8 text-[#725B38] ${isProcessing ? 'animate-spin' : 'animate-spin-slow'}`} />
        </div>

        {/* Handshake Badge */}
        <div className="flex items-center gap-1.5 text-[#725B38] text-xs uppercase font-bold tracking-widest mb-1.5">
          <Lock className="w-3.5 h-3.5" />
          <span>Secure Paystack Handshake Active</span>
        </div>

        <h3 className="font-editorial text-2xl sm:text-3xl text-[#1A1412] font-medium mb-1">
          Connecting to Paystack
        </h3>

        <p className="text-xs text-[#4E4542] max-w-sm mb-6 leading-relaxed">
          Establishing 256-bit encrypted checkout canal for{' '}
          <strong className="text-[#1A1412] font-bold text-sm">{displayAmount}</strong>. Please do not refresh this browser session.
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-[#EFEEEB] rounded-full h-1.5 mb-6 overflow-hidden">
          <div
            className="bg-[#725B38] h-full rounded-full transition-all duration-300"
            style={{ width: `${simulatedProgress}%` }}
          />
        </div>

        {/* Payment Channels Selector */}
        <div className="w-full bg-[#FBF9F6] p-3 rounded-lg border border-[#EAE8E5] mb-4 text-left">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#807571] block mb-2">
            Select Payment Channel:
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setSelectedChannel('card')}
              className={`py-2 px-3 text-xs font-semibold rounded border transition-all text-center ${
                selectedChannel === 'card'
                  ? 'bg-[#1A1412] text-white border-[#1A1412] shadow-sm'
                  : 'bg-white text-[#4E4542] border-[#D1C4C0] hover:bg-[#F5F3F0]'
              }`}
            >
              Debit Card
            </button>
            <button
              onClick={() => setSelectedChannel('bank')}
              className={`py-2 px-3 text-xs font-semibold rounded border transition-all text-center ${
                selectedChannel === 'bank'
                  ? 'bg-[#1A1412] text-white border-[#1A1412] shadow-sm'
                  : 'bg-white text-[#4E4542] border-[#D1C4C0] hover:bg-[#F5F3F0]'
              }`}
            >
              Bank Transfer
            </button>
            <button
              onClick={() => setSelectedChannel('ussd')}
              className={`py-2 px-3 text-xs font-semibold rounded border transition-all text-center ${
                selectedChannel === 'ussd'
                  ? 'bg-[#1A1412] text-white border-[#1A1412] shadow-sm'
                  : 'bg-white text-[#4E4542] border-[#D1C4C0] hover:bg-[#F5F3F0]'
              }`}
            >
              USSD / Apple Pay
            </button>
          </div>
        </div>

        {/* Merchant Dossier */}
        <div className="w-full bg-[#F5F3F0] p-4 rounded-lg flex items-center justify-between text-left mb-6 border border-[#EAE8E5]">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#807571] block font-semibold">
              Destination Merchant
            </span>
            <span className="text-xs font-bold text-[#1A1412]">
              Bernice Hairplace Lagos Ltd
            </span>
            <span className="text-[10px] font-mono text-[#807571] block mt-0.5">
              Ref: {refCode}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider text-[#807571] block font-semibold">
              Gateway
            </span>
            <span className="text-xs font-bold text-[#725B38] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Official Direct
            </span>
            <span className="text-[10px] uppercase font-semibold text-[#807571] block mt-0.5">
              NGN • USD Card
            </span>
          </div>
        </div>

        {/* Actions for Interactive Simulation */}
        <div className="w-full space-y-2.5">
          <button
            onClick={handlePayNow}
            disabled={isProcessing}
            className="w-full h-12 bg-[#1A1412] hover:bg-[#201A18] text-white text-xs font-semibold uppercase tracking-widest rounded flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#C5A880]" />
                <span>Authorizing with Paystack...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 text-[#C5A880]" />
                <span>Complete Payment ({displayAmount})</span>
              </>
            )}
          </button>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={simulatePaystackSuccess}
              className="py-2.5 px-3 bg-[#FEDEB2]/40 hover:bg-[#FEDEB2] border border-[#725B38]/30 text-[#281800] text-[11px] font-bold uppercase tracking-wider rounded transition-colors"
            >
              Simulate Success
            </button>
            <button
              onClick={simulatePaystackFailure}
              className="py-2.5 px-3 bg-[#FFDAD6]/60 hover:bg-[#FFDAD6] border border-[#BA1A1A]/30 text-[#BA1A1A] text-[11px] font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-1"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Simulate Decline</span>
            </button>
          </div>
        </div>

        <button
          onClick={closePaystackPayment}
          className="text-xs text-[#807571] hover:text-[#1A1412] uppercase tracking-wider transition-colors mt-5 underline underline-offset-4"
        >
          Cancel and return to delivery options
        </button>
      </div>
    </div>
  );
};
