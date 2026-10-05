import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  Lock,
  Check,
  ShieldCheck,
  Award,
  Wallet,
  Zap,
  Building,
  Truck,
  ArrowRight,
} from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    checkoutAddress,
    setCheckoutAddress,
    fulfillmentMethod,
    setFulfillmentMethod,
    deliveryFee,
    orderTotal,
    formatPrice,
    openPaystackPayment,
    user,
    loginWithGoogle,
    showToast,
  } = useShop();

  const [deliveryNotes, setDeliveryNotes] = useState(checkoutAddress.deliveryNotes || 'Notify front estate gate security; call upon arrival at the gatehouse.');

  const handleInputChange = (field: string, value: string) => {
    setCheckoutAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutAddress.firstName || !checkoutAddress.streetAddress || !checkoutAddress.phone) {
      showToast('Missing Details', 'Please provide delivery address & phone number.', 'error');
      return;
    }
    openPaystackPayment();
  };

  const handleGoogleAutofill = () => {
    loginWithGoogle();
    if (user) {
      setCheckoutAddress(user.defaultAddress);
      showToast('Autofilled with Google', 'Delivery coordinates loaded from profile.', 'success');
    }
  };

  return (
    <div className="flex flex-col w-full bg-[#FBF9F6] min-h-screen">
      {/* Top 3-Step Checkout Progress Bar */}
      <div className="w-full bg-[#F5F3F0] py-4 border-b border-[#EAE8E5]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-[#4E4542]">
            <Lock className="w-4 h-4 text-[#725B38]" />
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#1A1412]">
              256-Bit SSL Encrypted Checkout
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Step 1 */}
            <div className="flex items-center gap-1.5 text-[#725B38] font-bold">
              <span className="w-5 h-5 rounded-full bg-[#725B38] text-white flex items-center justify-center text-[10px]">
                <Check className="w-3 h-3" />
              </span>
              <span className="text-xs uppercase tracking-wider">1. Bag</span>
            </div>
            <div className="w-6 sm:w-10 h-[2px] bg-[#725B38]"></div>

            {/* Step 2 */}
            <div className="flex items-center gap-1.5 text-[#1A1412] font-bold">
              <span className="w-5 h-5 rounded-full bg-[#1A1412] text-white flex items-center justify-center text-[10px]">
                2
              </span>
              <span className="text-xs uppercase tracking-wider text-[#1A1412]">2. Delivery & Details</span>
            </div>
            <div className="w-6 sm:w-10 h-[2px] bg-[#D1C4C0]"></div>

            {/* Step 3 */}
            <div className="flex items-center gap-1.5 text-[#807571]">
              <span className="w-5 h-5 rounded-full bg-[#EAE8E5] text-[#807571] flex items-center justify-center text-[10px] font-bold">
                3
              </span>
              <span className="text-xs uppercase tracking-wider">3. Secure Payment</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-[#4E4542]">
            <ShieldCheck className="w-4 h-4 text-[#725B38]" />
            <span className="text-[11px] uppercase tracking-wider font-bold">
              Official Paystack Partner
            </span>
          </div>
        </div>
      </div>

      {/* Main Form & Bag Grid */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-10 py-10 lg:py-14 w-full">
        <form onSubmit={handleSubmitCheckout} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Input Forms */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-[#EAE8E5]">
              {/* Google Autofill Pill */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 bg-[#F5F3F0]/60 p-3 rounded-lg border border-[#EAE8E5]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#4E4542]">
                  Instant Autofill
                </span>
                <button
                  type="button"
                  onClick={handleGoogleAutofill}
                  className="flex items-center justify-center gap-2 bg-white hover:bg-[#F5F3F0] text-[#1A1412] px-4 py-2 rounded shadow-sm border border-[#D1C4C0] text-xs font-semibold transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </div>

              {/* Contact Information */}
              <div className="mb-6">
                <h2 className="font-editorial text-2xl text-[#1A1412] mb-1 font-medium">
                  Contact Information
                </h2>
                <p className="text-xs text-[#807571]">
                  We will use this to send order status, delivery dispatch tracking, and digital receipt.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] uppercase tracking-wider font-bold text-[#1A1412]">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={checkoutAddress.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="e.g. amara.alabi@theluxurylagos.com"
                    className="w-full h-12 px-4 bg-[#F5F3F0] rounded text-sm text-[#1A1412] focus:outline-none focus:bg-white border border-[#D1C4C0] focus:border-[#725B38] transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] uppercase tracking-wider font-bold text-[#1A1412]">
                    Phone Number (WhatsApp Active) *
                  </label>
                  <div className="flex items-center bg-[#F5F3F0] rounded border border-[#D1C4C0] focus-within:border-[#725B38] focus-within:bg-white">
                    <span className="text-xs font-bold text-[#725B38] px-3">+234</span>
                    <input
                      type="tel"
                      required
                      value={checkoutAddress.phone.replace('+234', '').trim()}
                      onChange={(e) => handleInputChange('phone', `+234 ${e.target.value}`)}
                      placeholder="814 982 4509"
                      className="w-full h-12 px-2 bg-transparent text-sm text-[#1A1412] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mb-6">
                <h2 className="font-editorial text-2xl text-[#1A1412] mb-1 font-medium">
                  Shipping Address
                </h2>
                <p className="text-xs text-[#807571]">
                  Complimentary white-glove packaging tailored for luxury extensions and lace units.
                </p>
              </div>

              <div className="flex flex-col gap-4 mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] uppercase tracking-wider font-bold text-[#1A1412]">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={checkoutAddress.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="Amara"
                      className="w-full h-12 px-4 bg-[#F5F3F0] rounded text-sm text-[#1A1412] focus:outline-none focus:bg-white border border-[#D1C4C0] focus:border-[#725B38] transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] uppercase tracking-wider font-bold text-[#1A1412]">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={checkoutAddress.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Alabi"
                      className="w-full h-12 px-4 bg-[#F5F3F0] rounded text-sm text-[#1A1412] focus:outline-none focus:bg-white border border-[#D1C4C0] focus:border-[#725B38] transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] uppercase tracking-wider font-bold text-[#1A1412]">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={checkoutAddress.streetAddress}
                    onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                    placeholder="Plot 14 Admiralty Way, Lekki Peninsula"
                    className="w-full h-12 px-4 bg-[#F5F3F0] rounded text-sm text-[#1A1412] focus:outline-none focus:bg-white border border-[#D1C4C0] focus:border-[#725B38] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] uppercase tracking-wider font-bold text-[#1A1412]">
                      Suite / Flat
                    </label>
                    <input
                      type="text"
                      value={checkoutAddress.suiteFlat || ''}
                      onChange={(e) => handleInputChange('suiteFlat', e.target.value)}
                      placeholder="Penthouse B4"
                      className="w-full h-12 px-4 bg-[#F5F3F0] rounded text-sm text-[#1A1412] focus:outline-none focus:bg-white border border-[#D1C4C0] focus:border-[#725B38] transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] uppercase tracking-wider font-bold text-[#1A1412]">
                      Lagos District *
                    </label>
                    <select
                      value={checkoutAddress.district}
                      onChange={(e) => handleInputChange('district', e.target.value)}
                      className="w-full h-12 px-4 bg-[#F5F3F0] rounded text-sm text-[#1A1412] focus:outline-none focus:bg-white border border-[#D1C4C0] focus:border-[#725B38] transition-colors font-medium"
                    >
                      <option value="Lekki Phase 1">Lekki Phase 1</option>
                      <option value="Victoria Island">Victoria Island</option>
                      <option value="Ikoyi">Ikoyi</option>
                      <option value="Banana Island">Banana Island</option>
                      <option value="Ikeja GRA">Ikeja GRA</option>
                      <option value="Surulere">Surulere</option>
                      <option value="Ajah / Sangotedo">Ajah / Sangotedo</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] uppercase tracking-wider font-bold text-[#1A1412]">
                      State
                    </label>
                    <input
                      type="text"
                      readOnly
                      value="Lagos State"
                      className="w-full h-12 px-4 bg-[#EAE8E5] rounded text-sm text-[#807571] cursor-not-allowed border border-[#D1C4C0]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] uppercase tracking-wider font-bold text-[#1A1412]">
                    Delivery Instructions & Security Gate Code
                  </label>
                  <textarea
                    rows={2}
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="Notify front estate gate security; call upon arrival at the gatehouse."
                    className="w-full p-4 bg-[#F5F3F0] rounded text-sm text-[#1A1412] focus:outline-none focus:bg-white border border-[#D1C4C0] focus:border-[#725B38] transition-colors"
                  />
                </div>
              </div>

              {/* Fulfillment Mode Selection */}
              <div className="pt-4 border-t border-[#EAE8E5]">
                <h3 className="text-xs uppercase tracking-widest font-bold text-[#1A1412] mb-3">
                  Select Fulfillment Mode
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Mode 1 */}
                  <label
                    onClick={() => setFulfillmentMethod('courier_express')}
                    className={`relative flex flex-col p-4 rounded-xl cursor-pointer transition-all border ${
                      fulfillmentMethod === 'courier_express'
                        ? 'bg-[#F5F3F0] border-[#1A1412] shadow-sm'
                        : 'bg-white border-[#EAE8E5] hover:bg-[#F5F3F0]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="fulfillment"
                          checked={fulfillmentMethod === 'courier_express'}
                          onChange={() => setFulfillmentMethod('courier_express')}
                          className="accent-[#1A1412] w-4 h-4"
                        />
                        <span className="text-xs font-bold text-[#1A1412] uppercase">
                          Express Lagos Courier
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[#725B38]">₦4,500</span>
                    </div>
                    <p className="text-xs text-[#807571] pl-6 leading-relaxed">
                      Same-day Island dispatch if ordered before 2 PM. Real-time driver WhatsApp tracker included.
                    </p>
                  </label>

                  {/* Mode 2 */}
                  <label
                    onClick={() => setFulfillmentMethod('studio_pickup')}
                    className={`relative flex flex-col p-4 rounded-xl cursor-pointer transition-all border ${
                      fulfillmentMethod === 'studio_pickup'
                        ? 'bg-[#F5F3F0] border-[#1A1412] shadow-sm'
                        : 'bg-white border-[#EAE8E5] hover:bg-[#F5F3F0]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="fulfillment"
                          checked={fulfillmentMethod === 'studio_pickup'}
                          onChange={() => setFulfillmentMethod('studio_pickup')}
                          className="accent-[#1A1412] w-4 h-4"
                        />
                        <span className="text-xs font-bold text-[#1A1412] uppercase">
                          Studio Pickup
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[#4E4542] uppercase">Free</span>
                    </div>
                    <p className="text-xs text-[#807571] pl-6 leading-relaxed">
                      Victoria Island Salon & Studio Suite. Available for collection within 3 hours.
                    </p>
                  </label>
                </div>
              </div>
            </div>

            {/* Quality Seal Guarantee */}
            <div className="p-5 bg-[#FEDEB2]/40 rounded-xl flex items-start gap-4 border border-[#FEDEB2]">
              <Award className="w-7 h-7 text-[#725B38] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs uppercase font-bold tracking-wider text-[#281800] mb-1">
                  The Bernice Quality Seal Guarantee
                </h4>
                <p className="text-xs text-[#4E4542] leading-relaxed">
                  Each bundle is carefully washed, inspected under salon luminescence, and certified 100% cuticle-aligned raw virgin hair before handover to logistics.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Order Bag Summary & Paystack Action */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-28">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-[#EAE8E5]">
              <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#EAE8E5]">
                <h3 className="font-editorial text-2xl text-[#1A1412] font-medium">Order Bag Summary</h3>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#4E4542] bg-[#EFEEEB] px-2.5 py-1 rounded">
                  {cart.length} Items Reserved
                </span>
              </div>

              {/* Reserved Items */}
              <div className="flex flex-col gap-4 pb-6 border-b border-[#EAE8E5]">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3.5 bg-[#F5F3F0] p-3 rounded-lg">
                    <img
                      src={item.product.images.main}
                      alt={item.product.name}
                      className="w-16 h-20 rounded object-cover shrink-0 bg-white"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-semibold text-[#725B38]">
                            {item.product.category === 'wigs' ? 'HD Unit' : 'Raw Hair Collection'}
                          </span>
                          <span className="text-[11px] text-[#807571] font-bold">× {item.quantity}</span>
                        </div>
                        <h4 className="text-xs font-bold text-[#1A1412] truncate mt-0.5">
                          {item.product.name}
                        </h4>
                        <p className="text-[11px] text-[#807571]">
                          {item.selectedLength} Inch • 100% Raw Virgin
                        </p>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[10px] text-[#807571]">Single Donor</span>
                        <span className="text-xs font-bold text-[#1A1412]">
                          {formatPrice(item.lineTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="bg-[#F5F3F0] p-4 rounded-lg flex flex-col gap-2 my-6">
                <div className="flex justify-between text-xs text-[#4E4542]">
                  <span>Item Subtotal</span>
                  <span className="text-[#1A1412] font-bold">{formatPrice(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-[#4E4542]">
                  <span>Delivery Charge ({fulfillmentMethod === 'courier_express' ? 'Lagos Island Express' : 'Studio Pickup'})</span>
                  <span className="text-[#1A1412] font-bold">
                    {deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-[#4E4542]">
                  <span>Estimated VAT & Customs Duty</span>
                  <span className="text-[#725B38] font-bold">Included</span>
                </div>

                <div className="my-1.5 h-[1px] bg-[#D1C4C0]/40"></div>

                <div className="flex justify-between items-baseline pt-1">
                  <div>
                    <span className="font-editorial text-lg text-[#1A1412] font-bold block">
                      Total Amount Due
                    </span>
                    <span className="text-[10px] text-[#807571]">Naira Payment via Local or Global Cards</span>
                  </div>
                  <span className="font-editorial text-2xl text-[#1A1412] font-bold">
                    {formatPrice(orderTotal)}
                  </span>
                </div>
              </div>

              {/* Paystack Official Info */}
              <div className="mb-6">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#1A1412] mb-2 block">
                  Secured Payment Processing
                </span>
                <div className="bg-[#EFEEEB] p-3.5 rounded-lg flex items-center justify-between border border-[#EAE8E5]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#1A1412] text-white flex items-center justify-center">
                      <Wallet className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#1A1412]">Paystack Gateway</span>
                        <span className="px-1.5 py-0.5 bg-[#725B38] text-white text-[9px] uppercase font-bold rounded">
                          Official
                        </span>
                      </div>
                      <p className="text-[11px] text-[#807571]">Cards, Bank Transfer, USSD & Apple Pay</p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-mono font-bold text-[#807571]">
                    NGN • USD
                  </span>
                </div>
              </div>

              {/* Paystack Submission Trigger */}
              <button
                type="submit"
                className="w-full h-14 bg-[#1A1412] hover:bg-[#201A18] text-white text-xs font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
              >
                <Lock className="w-4 h-4 text-[#C5A880]" />
                <span>Pay {formatPrice(orderTotal)} via Paystack</span>
              </button>

              <p className="text-center text-[11px] text-[#807571] mt-3 leading-relaxed">
                You will be securely redirected to Paystack to authenticate your payment. Upon successful confirmation, an automated dispatch notification is sent immediately.
              </p>

              <div className="mt-4 pt-3 flex items-center justify-center gap-4 text-xs text-[#807571] border-t border-[#EAE8E5]">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#725B38]" />
                  <span className="text-[10px] uppercase font-bold">PCI-DSS Level 1</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-[#725B38]" />
                  <span className="text-[10px] uppercase font-bold">Instant Confirmation</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};
