import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  Package,
  Home,
  CreditCard,
  Sparkles,
  Sliders,
  Plus,
  Truck,
  Download,
  MessageSquare,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
  MapPin,
  Phone,
  Lock,
  LogOut,
  Calendar,
} from 'lucide-react';

export const AccountView: React.FC = () => {
  const {
    user,
    orders,
    formatPrice,
    setCurrentView,
    setSelectedProduct,
    products,
    setIsConciergeOpen,
    setIsCustomOrderModalOpen,
    showToast,
    logout,
  } = useShop();

  const [activeNavTab, setActiveNavTab] = useState<'overview' | 'orders' | 'addresses' | 'hair_profile' | 'payment'>('overview');

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center">
        <h2 className="font-editorial text-2xl mb-2">Sign in to Account</h2>
        <p className="text-xs text-[#807571] mb-6">Access your single-donor human hair archives & custom wig orders.</p>
        <button
          onClick={() => setCurrentView('home')}
          className="px-6 py-3 bg-[#1A1412] text-white text-xs uppercase font-bold tracking-wider rounded"
        >
          Return Home
        </button>
      </div>
    );
  }

  const activeOrder = orders[0];

  const handleReorder = (orderName: string) => {
    const matched = products.find((p) => orderName.toLowerCase().includes(p.texture.toLowerCase())) || products[0];
    setSelectedProduct(matched);
    setCurrentView('product-detail');
    showToast('Reorder Loaded', `Navigated to ${matched.name}`, 'info');
  };

  return (
    <div className="flex flex-col w-full bg-[#FBF9F6] min-h-screen">
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-10 py-10 lg:py-14">
        {/* Account Editorial Header */}
        <section className="relative overflow-hidden rounded-2xl bg-[#F5F3F0] p-6 md:p-10 mb-10 shadow-sm border border-[#EAE8E5]">
          <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-[#FEDEB2]/20 blur-3xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#725B38]/10 text-[#725B38] text-[10px] uppercase font-bold tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#725B38]"></span>
                  {user.tier} • Lagos, Nigeria
                </span>
              </div>
              <h1 className="font-editorial text-3xl sm:text-4xl text-[#1A1412] tracking-tight font-medium">
                Welcome back, {user.firstName}
              </h1>
              <p className="text-xs sm:text-sm text-[#4E4542] mt-1">
                Single-donor human hair archives, private couture wig commissions, and exclusive Lagos priority care.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start md:self-auto">
              <button
                onClick={() => setIsCustomOrderModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded bg-[#1A1412] hover:bg-[#201A18] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4 text-[#C5A880]" />
                <span>New Custom Order</span>
              </button>

              <button
                onClick={() => showToast('Preferences', 'Lace profile & measurements synced.', 'info')}
                className="p-3 rounded bg-white text-[#1A1412] border border-[#D1C4C0] hover:bg-[#EFEEEB] transition-colors"
                title="Account Settings"
              >
                <Sliders className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[#EAE8E5]">
            <div className="p-3.5 bg-white/80 rounded-lg border border-[#EAE8E5] backdrop-blur-sm">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-[#807571]">
                Active Acquisition
              </p>
              <p className="font-editorial text-lg text-[#1A1412] font-bold mt-0.5">1 Parcel</p>
              <span className="text-[11px] text-[#725B38] font-medium">In transit to Lekki</span>
            </div>

            <div className="p-3.5 bg-white/80 rounded-lg border border-[#EAE8E5] backdrop-blur-sm">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-[#807571]">
                Archived Orders
              </p>
              <p className="font-editorial text-lg text-[#1A1412] font-bold mt-0.5">{orders.length} Completed</p>
              <span className="text-[11px] text-[#807571]">Single Donor Units</span>
            </div>

            <div className="p-3.5 bg-white/80 rounded-lg border border-[#EAE8E5] backdrop-blur-sm">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-[#807571]">
                Lagos Studio Tier
              </p>
              <p className="font-editorial text-lg text-[#725B38] font-bold mt-0.5">Premier Gold</p>
              <span className="text-[11px] text-[#807571]">Free Dispatch • VI Suite</span>
            </div>

            <div className="p-3.5 bg-white/80 rounded-lg border border-[#EAE8E5] backdrop-blur-sm">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-[#807571]">
                Dedicated Stylist
              </p>
              <p className="font-editorial text-lg text-[#1A1412] font-bold mt-0.5">Amina B.</p>
              <span className="text-[11px] text-[#807571]">Colorist & Lace Tech</span>
            </div>
          </div>
        </section>

        {/* Two-Column Primary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Navigation & Profile Snapshot */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            {/* Account Directory Menu */}
            <nav className="bg-white rounded-xl p-4 shadow-sm border border-[#EAE8E5] flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#807571] px-3 py-1 mb-1 block">
                Account Directory
              </span>

              <button
                onClick={() => setActiveNavTab('overview')}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded text-xs uppercase tracking-wider font-semibold transition-colors ${
                  activeNavTab === 'overview'
                    ? 'bg-[#1A1412] text-white shadow-sm'
                    : 'text-[#1A1412] hover:bg-[#F5F3F0]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4" />
                  <span>Overview</span>
                </div>
                <span className="text-[#C5A880]">→</span>
              </button>

              <button
                onClick={() => setActiveNavTab('orders')}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded text-xs uppercase tracking-wider font-semibold transition-colors ${
                  activeNavTab === 'orders'
                    ? 'bg-[#1A1412] text-white shadow-sm'
                    : 'text-[#1A1412] hover:bg-[#F5F3F0]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Truck className="w-4 h-4 text-[#807571]" />
                  <span>My Orders</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#EFEEEB] text-[#4E4542] text-[10px] font-bold">
                  {orders.length}
                </span>
              </button>

              <button
                onClick={() => setActiveNavTab('addresses')}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded text-xs uppercase tracking-wider font-semibold transition-colors ${
                  activeNavTab === 'addresses'
                    ? 'bg-[#1A1412] text-white shadow-sm'
                    : 'text-[#1A1412] hover:bg-[#F5F3F0]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-[#807571]" />
                  <span>Saved Addresses</span>
                </div>
                <span className="text-xs lowercase text-[#807571]">Lekki, Lagos</span>
              </button>

              <button
                onClick={() => setActiveNavTab('hair_profile')}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded text-xs uppercase tracking-wider font-semibold transition-colors ${
                  activeNavTab === 'hair_profile'
                    ? 'bg-[#1A1412] text-white shadow-sm'
                    : 'text-[#1A1412] hover:bg-[#F5F3F0]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-[#807571]" />
                  <span>Hair Care & Custom Units</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-[#725B38]"></span>
              </button>

              <button
                onClick={() => setActiveNavTab('payment')}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded text-xs uppercase tracking-wider font-semibold transition-colors ${
                  activeNavTab === 'payment'
                    ? 'bg-[#1A1412] text-white shadow-sm'
                    : 'text-[#1A1412] hover:bg-[#F5F3F0]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-[#807571]" />
                  <span>Payment Methods</span>
                </div>
              </button>

              <div className="pt-2 mt-1 border-t border-[#EAE8E5]">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded text-[#BA1A1A] hover:bg-[#FFDAD6]/40 text-xs uppercase tracking-wider font-semibold transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Security & Sign Out</span>
                </button>
              </div>
            </nav>

            {/* VIP Studio Concierge WhatsApp Direct Card */}
            <div className="bg-[#F5F3F0] rounded-xl p-6 shadow-sm border border-[#EAE8E5] relative overflow-hidden">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#FEDEB2] flex items-center justify-center text-[#725B38]">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-white text-[#725B38] font-bold">
                  Victoria Island
                </span>
              </div>

              <h3 className="font-editorial text-lg text-[#1A1412] font-semibold mb-1">
                Hair Specialist Concierge
              </h3>
              <p className="text-xs text-[#4E4542] mb-4 leading-relaxed">
                Connect directly with Bernice Master Colorists for HD lace tone harmonization, bundle weight calibration, and bespoke ventilations.
              </p>

              <button
                onClick={() => setIsConciergeOpen(true)}
                className="w-full h-11 bg-[#1A1412] hover:bg-[#201A18] text-white text-xs font-semibold uppercase tracking-wider rounded flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-[#C5A880]" />
                <span>Direct WhatsApp Concierge</span>
              </button>
              <p className="text-[10px] text-center text-[#807571] mt-2">
                Average response time: &lt; 15 mins
              </p>
            </div>

            {/* Archived Hair Profile Snapshot */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-[#EAE8E5]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#807571]">
                  Archived Hair Profile
                </span>
                <button
                  onClick={() => setIsCustomOrderModalOpen(true)}
                  className="text-[10px] uppercase font-bold text-[#725B38] hover:underline"
                >
                  Edit
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 bg-[#F5F3F0]/60 px-3 rounded">
                  <span className="text-[#807571]">Cap Circumference:</span>
                  <span className="font-bold text-[#1A1412]">{user.capCircumference}</span>
                </div>
                <div className="flex justify-between py-1.5 bg-[#F5F3F0]/60 px-3 rounded">
                  <span className="text-[#807571]">Lace Preference:</span>
                  <span className="font-bold text-[#1A1412]">{user.lacePreference}</span>
                </div>
                <div className="flex justify-between py-1.5 bg-[#F5F3F0]/60 px-3 rounded">
                  <span className="text-[#807571]">Signature Texture:</span>
                  <span className="font-bold text-[#1A1412]">{user.signatureTexture}</span>
                </div>
                <div className="flex justify-between py-1.5 bg-[#F5F3F0]/60 px-3 rounded">
                  <span className="text-[#807571]">Default Parting:</span>
                  <span className="font-bold text-[#1A1412]">{user.defaultParting}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column: Active Logistics, Order History & Wallet Information */}
          <section className="lg:col-span-8 flex flex-col gap-8">
            {/* Active Order Logistics Spotlight */}
            {activeOrder && (
              <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-[#EAE8E5]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-2 border-b border-[#EAE8E5]">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded bg-[#FEDEB2] text-[#281800] text-[10px] font-bold uppercase tracking-wider">
                        Active Dispatch
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#807571]">
                        Order #{activeOrder.orderNumber}
                      </span>
                    </div>
                    <h2 className="font-editorial text-xl sm:text-2xl text-[#1A1412] font-semibold">
                      {activeOrder.items[0]?.productName || 'Raw Cambodian Natural Wave • 3 Bundles'}
                    </h2>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-[10px] uppercase font-semibold text-[#807571]">Total Investment</p>
                    <p className="font-editorial text-xl font-bold text-[#1A1412]">
                      {formatPrice(activeOrder.total)}
                    </p>
                  </div>
                </div>

                {/* Product Item Preview */}
                <div className="flex flex-col sm:flex-row gap-4 py-4 items-center bg-[#F5F3F0]/70 rounded-lg p-4 my-4 border border-[#EAE8E5]">
                  <img
                    src={activeOrder.items[0]?.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuADLRPtru9NbmTyj7EShT0KL9XXloqmSE-DPPm1IVDK5ZTAxVpsq6jJtc3QgyjcLhEutEY99L8UNfy-1BCSe_y3kaY7hT-qB9KdIEm1SY9YN-kSQShR1l7vgGq9PemzJcuR0ifwtF564HtBXmVbYzb0jyt1IIexyEaZHcyihDHymos0FpuWZqL-0C-hh3vIbNccrUiaRIdYyqY0vvD17o2xfqQxhH-UI6mJ795S8wKbZrFNgFyi0wfL'}
                    alt="Active Order item"
                    className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded shadow-sm bg-white"
                  />
                  <div className="flex-1 space-y-1 text-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded bg-white text-[10px] font-bold uppercase text-[#807571]">
                        Length: {activeOrder.items[0]?.selectedLength}″
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white text-[10px] font-bold uppercase text-[#807571]">
                        Density: 250%
                      </span>
                    </div>
                    <p className="font-bold text-[#1A1412]">
                      Bespoke Machine Weft • Natural Brown (#1B) • Pre-plucked Hairline
                    </p>
                    <p className="text-[#807571] leading-relaxed">
                      Handcrafted in our Victoria Island Atelier. Sanitized and conditioned with organic argan botanical oil.
                    </p>
                  </div>

                  <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        setCurrentView('payment-status');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="flex-1 sm:flex-initial px-4 py-2 rounded bg-[#1A1412] hover:bg-[#201A18] text-white text-xs font-semibold uppercase tracking-wider transition-colors text-center"
                    >
                      View Order
                    </button>
                    <button
                      onClick={() => showToast('Dispatch Tracking', 'Courier is en route to Admiralty Way, Lekki Phase 1.', 'info')}
                      className="flex-1 sm:flex-initial px-4 py-2 rounded bg-[#EAE8E5] hover:bg-[#E4E2DF] text-[#1A1412] text-xs font-semibold uppercase tracking-wider transition-colors text-center"
                    >
                      Track Delivery
                    </button>
                  </div>
                </div>

                {/* Tracking Stepper */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-bold text-[#807571] mb-2">
                    <span className="text-[#1A1412]">1. Order Placed</span>
                    <span className="text-[#1A1412]">2. Atelier Quality Audit</span>
                    <span className="text-[#725B38]">3. In Courier Transit (Lekki)</span>
                    <span>4. Final Handover</span>
                  </div>

                  <div className="w-full bg-[#EAE8E5] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#725B38] h-full rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-3 pt-1 text-xs">
                    <div className="flex items-center gap-1.5 text-[#4E4542]">
                      <Truck className="w-4 h-4 text-[#725B38]" />
                      <span>Courier: GIG / Island VIP Same-Day Rider • Expected by 5:30 PM Today</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-[#725B38]">
                      Waybill #{activeOrder.waybillNumber || 'BHP-LG-9821'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Order History & Archives */}
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-[#EAE8E5]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="font-editorial text-2xl text-[#1A1412] font-medium">
                    Order History & Archives
                  </h2>
                  <p className="text-xs text-[#807571]">
                    Review lifetime single-donor hair acquisitions and download formal invoices.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => showToast('Filtered', 'Displaying all 2026 archives.', 'info')}
                    className="px-3 py-1.5 rounded bg-[#F5F3F0] text-[10px] uppercase font-bold tracking-wider text-[#4E4542] hover:bg-[#EAE8E5]"
                  >
                    Filter by Year
                  </button>
                  <button
                    onClick={() => showToast('Export Complete', 'Dossier CSV downloaded.', 'success')}
                    className="px-3 py-1.5 rounded bg-[#F5F3F0] text-[10px] uppercase font-bold tracking-wider text-[#4E4542] hover:bg-[#EAE8E5]"
                  >
                    Export CSV
                  </button>
                </div>
              </div>

              {/* Order Cards List */}
              <div className="flex flex-col gap-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-xl bg-[#F5F3F0]/50 border border-[#EAE8E5] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#F5F3F0] transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={ord.items[0]?.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhV7C68wLIJLPyJdngvZSr2_SSzLTKsUujyKtfhV09jkNwv3xx8N4KxqRePb71Bde_Dcf8hSyb4QgnhYBeJNH2lJBckq_sMEKFfVtb72fM4d_4UAqO3t60_M7IdWorSO_JJYa_OLm3feBwrGVyeAn40eNEKtyS5aBL3rLY4Vwm-QYz5CCt1n0P1_2ISY9bG4qG31_FrqZZWcByi9A2YGS54mxozPaVGi6r_y1ToZrXpPnUdoPPOBzx'}
                        alt="Order Thumbnail"
                        className="w-16 h-16 object-cover rounded bg-white shrink-0"
                      />
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-xs uppercase font-bold text-[#1A1412]">
                            #{ord.orderNumber}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-white text-[10px] text-[#807571] font-semibold">
                            {ord.date}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-[#1A1412] text-white text-[9px] uppercase font-bold">
                            PAID
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold ${
                            ord.status === 'delivered' ? 'bg-[#EAE8E5] text-[#1A1412]' : 'bg-[#FEDEB2] text-[#281800]'
                          }`}>
                            {ord.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-[#1A1412]">
                          {ord.items[0]?.productName || 'Raw Hair Curations'}
                        </p>
                        <p className="text-[11px] text-[#807571]">
                          Dispatched to {ord.shippingAddress.district || 'Lekki Phase 1'}, Lagos
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:flex-col md:items-end gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-[#EAE8E5]">
                      <p className="font-editorial text-lg font-bold text-[#1A1412]">
                        {formatPrice(ord.total)}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleReorder(ord.items[0]?.productName || '')}
                          className="px-3 py-1 bg-[#1A1412] hover:bg-[#201A18] text-white text-[10px] uppercase font-bold tracking-wider rounded transition-colors"
                        >
                          Reorder
                        </button>
                        <button
                          onClick={() => window.print()}
                          className="px-3 py-1 bg-white hover:bg-[#EAE8E5] text-[#1A1412] border border-[#D1C4C0] text-[10px] uppercase font-bold tracking-wider rounded transition-colors flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" />
                          <span>Invoice</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Address & Payment Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Default Address */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-[#EAE8E5] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#807571] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#725B38]" />
                      Default Shipping Address
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#FEDEB2] text-[#281800] text-[9px] uppercase font-bold">
                      Primary
                    </span>
                  </div>

                  <h4 className="font-editorial text-lg font-bold text-[#1A1412] mb-1">
                    {user.defaultAddress.firstName} {user.defaultAddress.lastName}
                  </h4>
                  <p className="text-xs text-[#1A1412]">{user.defaultAddress.streetAddress}</p>
                  <p className="text-xs text-[#807571]">{user.defaultAddress.district}, {user.defaultAddress.state} • Nigeria</p>
                  <p className="text-xs text-[#807571] mt-2 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    {user.defaultAddress.phone}
                  </p>

                  <div className="mt-3 p-2 bg-[#F5F3F0] rounded text-[11px] text-[#4E4542]">
                    <strong className="text-[#725B38] uppercase block text-[9px]">Delivery Instruction</strong>
                    {user.defaultAddress.deliveryNotes}
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-[#F5F3F0] flex items-center gap-4 text-xs font-bold text-[#725B38]">
                  <button onClick={() => showToast('Address Manager', '2 addresses currently active.', 'info')} className="hover:underline uppercase text-[11px]">
                    Manage Addresses (2)
                  </button>
                </div>
              </div>

              {/* Saved Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-[#EAE8E5] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#807571] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#725B38]" />
                      Payment Guarantee
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#EFEEEB] text-[#1A1412] text-[9px] uppercase font-bold">
                      Paystack Verified
                    </span>
                  </div>

                  <div className="p-4 rounded-lg bg-[#F5F3F0] mb-3 border border-[#EAE8E5]">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          <div className="w-4 h-4 rounded-full bg-[#BA1A1A] opacity-90"></div>
                          <div className="w-4 h-4 rounded-full bg-[#E0C298] opacity-90"></div>
                        </div>
                        <span className="text-xs font-bold uppercase text-[#1A1412]">
                          {user.savedCard.brand}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#807571] uppercase">
                        Exp {user.savedCard.expiry}
                      </span>
                    </div>

                    <p className="font-editorial text-lg tracking-widest font-bold text-[#1A1412]">
                      •••• •••• •••• {user.savedCard.last4}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E4E2DF] text-xs text-[#807571]">
                      <span>{user.savedCard.cardHolder}</span>
                      <span className="text-[#725B38] font-bold text-[10px] uppercase">
                        ⚡ 1-Click Pay Active
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#807571] flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-[#725B38]" />
                    <span>Google Pay & Apple Pay also configured on this device.</span>
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-[#F5F3F0] flex items-center gap-4 text-xs font-bold text-[#725B38]">
                  <button onClick={() => showToast('Payment Vault', 'Encrypted via Paystack PCI-DSS.', 'info')} className="hover:underline uppercase text-[11px]">
                    Add New Card
                  </button>
                </div>
              </div>
            </div>

            {/* VIP Complimentary Revamp Card */}
            <div className="bg-[#FEDEB2]/30 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#FEDEB2]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center text-[#725B38] shadow-sm shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-editorial text-lg text-[#1A1412] font-semibold">
                    Complimentary Lace Deep Clean & Revamp
                  </h4>
                  <p className="text-xs text-[#4E4542]">
                    As a Premier Gold member, enjoy 2 seasonal unit rejuvenations at our Victoria Island Studio per year.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsConciergeOpen(true);
                  showToast('Drop-Off Service', 'Concierge booked for Victoria Island revamp appointment.', 'success');
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded bg-[#1A1412] hover:bg-[#201A18] text-white text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors"
              >
                Schedule Drop-Off
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
